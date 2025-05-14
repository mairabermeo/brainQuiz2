const express = require('express');
const router = express.Router();
const User = require('../models/users');

// Save Score
router.post('/save-score', async (req, res) => {
  const { username, score } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });

    user.scores.push({ score });
    await user.save();
    res.json({ message: 'Score saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Profile
router.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ username: user.username, scores: user.scores });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
