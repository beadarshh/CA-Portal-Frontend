// routes/authRoutes.js or similar
const express = require('express');
const router = express.Router();
const { generateToken } = require('../auth');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Authenticate user (replace this with your actual authentication logic)
  const user = { id: 1, username }; // Dummy user data

  if (username && password) {
    const token = generateToken(user);
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

module.exports = router;
