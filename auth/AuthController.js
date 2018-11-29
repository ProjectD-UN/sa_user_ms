const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
        if (err) return res.status(500).send("Hubo un problema con el registro de usuario.");

        // creacion token
        let token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: 86400 //24 horas = 1 dia
        });
        console.log('/register')        
        res.status(200).send({auth: true, token:token});
    })
});

router.get('/me', verifyToken, (req, res, next) => {
    console.log("/me");
    User.findById(req.userId, { password: 0 }, (err, user) => {
        if (err) return res.status(404).send("Hubo un problema al buscar el usuario.");
        if (!user) return res.status(404).send("No se encontro el usuario.");
        
        res.status(200).send(user);
    });
});

router.post("/login", (req, res) => {
    console.log("/login");
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send("Error en servidor al autenticar.");
        if (!user) return res.status(404).send("No se encontro el usuario.");

        let passwordIsInvalid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsInvalid) return res.status(401).send({ auth: false, token: null });
        
        let token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400// Expira en 24 horas
        });
        res.status(200).send({ auth: true, token: token });
    });
});

module.exports = router;
