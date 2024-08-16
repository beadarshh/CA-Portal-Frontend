// auth.js or a similar file
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key'; // Replace with your actual secret key

const generateToken = (user) => {
  return jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
};

module.exports = { generateToken };
