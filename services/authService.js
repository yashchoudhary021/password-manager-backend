const jwt = require('jsonwebtoken');
const config = require('../config/jwt');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        config.secret,
        { expiresIn: config.expiresIn }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.secret);
    } catch (error) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };
