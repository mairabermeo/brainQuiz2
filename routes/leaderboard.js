const express = require('express');
const router = express.Router();
const User = require('../model/User');

// Get Leaderboard
router.get('/', async (req, res) => {
  try {
    const users = await User.aggregate([
      { $unwind: "$scores" },
      {
        $group: {
          _id: "$username",
          totalScore: { $sum: "$scores.score" }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: 10 }
    ]);

    res.json(users);

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;