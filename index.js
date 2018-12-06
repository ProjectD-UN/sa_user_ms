const express = require('express');
const DBConnection = require('./connection_mongo');
const AuthController = require('./auth/AuthController');
const LDAP = require('./ldap');


const app = express();
const port =  process.env.PORT || 3003;

app.use('/api/auth', AuthController);
app.use('/api/auth', LDAP);
DBConnection();
app.listen(port, () => console.log(`sa_user_ms started! Listening on ${port}`));