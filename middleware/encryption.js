'use strict';
const crypto = require('crypto');
const secret = require('../config/common').secret;

const encryption = {
    encrypt: function ( password ) {
        let cipher = crypto.createCipher('aes192', secret);
        let encrypted = cipher.update(password, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;

    },
    decrypt: function ( encryption ) {

        let cipher = crypto.createDecipher('aes192', secret);
        let password = cipher.update(encryption, 'hex', 'utf8');
        password += cipher.final('utf8');
        return password;
    }
};


module.exports = encryption;