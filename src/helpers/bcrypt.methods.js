const bcrypt = require("bcryptjs");
const { SALT_BCRYPT } = process.env;
const saltN = Number.parseInt(SALT_BCRYPT, 10);

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltN);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

const matchPassword = async (passwordBody, passwordDB) => {
    return await bcrypt.compare(passwordBody, passwordDB);
};

module.exports = { matchPassword, encryptPassword }; 