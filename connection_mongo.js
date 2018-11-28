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
    mongoose.connect(`mongodb://${adress}:27017/users`, options, (err) => {
        if (err) {
            console.log('Not connected to users');
            setTimeout(startingMongoDB, 5000);
        } else {
            console.log('Connected to users-db !');
        }
    })
}

module.exports = startingMongoDB;