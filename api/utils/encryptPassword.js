const bcrypt = require('bcrypt');

function encryptPassword(password) {
    const SALT = 10;
    const encryptedPassword = bcrypt.hash(password, SALT);
    return encryptedPassword;
}

module.exports = encryptPassword;
