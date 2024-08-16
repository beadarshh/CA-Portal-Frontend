// routes/protectedRoutes.js or similar
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/certificates/certs', authenticateToken, (req, res) => {
  // Your logic to handle the request
  res.json({ message: 'Protected data' });
});

module.exports = router;
