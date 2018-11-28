const express = require('express');
const DBConnection = require('./connection_mongo');
const AuthController = require('./auth/AuthController');

const app = express();
const port =  process.env.PORT || 3000;

app.use('/api/auth', AuthController);
DBConnection();
app.listen(port, () => console.log(`sa_user_ms started! Listening on ${port}`));