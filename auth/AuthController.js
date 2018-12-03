const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ldap = require('ldapjs');
const config = require('../config');
const verifyToken = require("./VerifyToken");

const router = express.Router();

// new user schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

// middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// routes
router.post('/register', (req, res) => {
    let hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    }, (err, user) => {
        if (err) return res.send({auth: false, message: "Hubo un problema con el registro de usuario."});

        // creacion token
        let token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: 86400 //24 horas = 1 dia
        });
        console.log('/register')        
        res.send({auth: true, token: token, expiresIn: 86400});
    })
});

router.get('/me', verifyToken, (req, res, next) => {
    console.log("/me");
    User.findById(req.userId, { password: 0 }, (err, user) => {
        if (err) return res.send({ auth: false, message: "Hubo un problema al buscar el usuario."});
        if (!user) return res.send({ auth: false, message: "No se encontro el usuario."});
        
        res.send(user);
    });
});

// Connecting with LDAP server
const connect = () => {
    let client = ldap.createClient({
        url: 'ldap://35.231.237.201:389'
    });
    return client;
}

router.post("/login", (req, res) => {
    console.log("/login");
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.send({ auth: false, message: "Error en servidor al autenticar."});
        if (!user) return res.send({ auth: false, message: "El usuario no se encontro en la base de datos."});

        let clientldap = connect();
        clientldap.on('connect', () => {
            console.log('Connected to LDAP server ...');
            let username = req.body.email;
            let password = req.body.password;
            let dn = "cn=" + username + ",ou=apollo,dc=apollo,dc=unal,dc=edu,dc=co";
            clientldap.bind(dn, password, (err) => {
                if (err) return res.send({ auth: false, message: 'El usuario no existe en el servidor LDAP.'});
                
                let passwordIsInvalid = bcrypt.compareSync(req.body.password, user.password);
                if (!passwordIsInvalid) return res.send({ auth: false, message: "La contraseña no es la correcta." });

                let token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400// Expira en 24 horas
                });
                res.send({ auth: true, token: token, expiresIn: 86400 });                        
            });
        });
    });
});

module.exports = router;
