const jwt = require("jsonwebtoken");
const config = require("../config");

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'Sin token no hay acceso.' });

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Falla al autenticar el token.' });

        req.userId = decoded.id;
        next();
    })
};

module.exports = verifyToken;