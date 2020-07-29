const bcrypt = require("bcryptjs");

const Bcrypt = {
    hashPassword(password){

        return bcrypt.hash(password, 12);
    },
    comparePassword(password, hashedPassword){

        return bcrypt.compare(password, hashedPassword);
    }
};

module.exports = Bcrypt;