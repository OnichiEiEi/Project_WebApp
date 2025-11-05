const express = require('express');
const router = express.Router();

// mock user
const USERS = [
  { username: 'admin', password: '123456' },
  { username: 'ponkiat', password: 'robkob' }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  // mock token
  res.json({ success: true, token: 'mock-token-123', username });
});

module.exports = router;