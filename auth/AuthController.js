const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

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

router.get('/me', (req, res) => {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No se proveyo ningun token.' });

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Falla al autenticar el token.' });

        res.status(200).send(decoded);
    })
});

module.exports = router;
