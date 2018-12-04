const mongoose = require('mongoose');

const options = {
    autoIndex: false,
    reconnectTries: 30,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true
}

const startingMongoDB = () => {
    const adress = process.env.DOCKER_DEPLOY? 'sa-user-db': '127.0.0.1';    
    const database = process.env.DATABASE? process.env.DATABASE:'27017';
    mongoose.connect(`mongodb://${adress}:${database}/users`, options, (err) => {
        console.log(`mongodb://${adress}:${database}/users`);
        if (err) {
            console.log('Not connected to users');
            setTimeout(startingMongoDB, 5000);
        } else {
            console.log('Connected to users-db !');
        }
    })
}

module.exports = startingMongoDB;