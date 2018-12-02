const ldap = require('ldapjs');
const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();


const connect = () => {
    let client = ldap.createClient({
        url: 'ldap://35.196.126.118:389'
    });
    return client;
}



router.post('/ldap', (req, res) => {
    console.log('LDAP? ....');    
    let client = connect();

    client.on('connect', () => {
        console.log('Connected to LDAP server ...');
        let username = 'diefrodriguezcha@unal.edu.co';
        let password = 'apollo';
        let dn = "cn=" + username + ",ou=apollo,dc=apollo,dc=unal,dc=edu,dc=co";
        client.bind(dn, password, (err) => {
            if (err) return res.status(500).send('Error al hacer binding de LDAP !.');
            return res.status(200).send('... Exito ? ....');
        });
    });
    
    
})

module.exports = router;