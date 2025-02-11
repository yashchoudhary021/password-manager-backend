require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'fallbackSecretKey',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h'
};