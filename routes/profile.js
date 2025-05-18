const express = require('express');
const router = express.Router();
const { getCollection } = require('../model/db');

router.get('/', async (req, res) => {
  if (!req.session.user || !req.session.user.email) {
    console.log("No session user found. Redirecting to login.");
    return res.redirect('/auth/login');
  }

  try {
    const usersCollection = getCollection('users');
    const user = await usersCollection.findOne({ email: req.session.user.email });

    if (!user) {
      console.log(`User not found in DB: ${req.session.user.email}`);
      return res.status(404).send('User not found');
    }

    let userScores = user.scores || [];

    // Calculate percentages similar to leaderboard
    userScores = userScores.map(scoreEntry => {
      const percentage = scoreEntry.totalQuestions > 0 
        ? Math.round((scoreEntry.score / scoreEntry.totalQuestions) * 100) 
        : 0;
      return {
        ...scoreEntry,
        percentage,
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    res.render('main/profile', { 
      user: {
        email: user.email,
        scores: userScores
      }
    });

  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;