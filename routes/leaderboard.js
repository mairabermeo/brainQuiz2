const express = require('express');
const router = express.Router();
const { getCollection } = require('../model/db');

// Leaderboard Data Fetch Route
router.get('/data', async (req, res) => {
  try {
    const usersCollection = getCollection('users');
    const users = await usersCollection.find({}).toArray();

    let leaderboardEntries = [];

    // Extract the most recent score for each quiz attempt
    users.forEach(user => {
      const scores = user.scores || [];

      scores.forEach(scoreEntry => {
        const percentage = scoreEntry.totalQuestions > 0 
          ? Math.round((scoreEntry.score / scoreEntry.totalQuestions) * 100) 
          : 0;

        leaderboardEntries.push({
          email: user.email,
          percentage,
          date: new Date(scoreEntry.date),
        });
      });
    });

    // Sort by percentage first, then by date (most recent first for same scores)
    leaderboardEntries.sort((a, b) => {
      if (b.percentage === a.percentage) {
        return new Date(b.date) - new Date(a.date);
      }
      return b.percentage - a.percentage;
    });

    const sessionUserEmail = req.session.user ? req.session.user.email : null;
    let sessionUserRank = "Not Ranked";
    let recentScore = "No recent quiz";

    if (sessionUserEmail) {
      const userEntries = leaderboardEntries.filter(entry => entry.email === sessionUserEmail);

      if (userEntries.length > 0) {
        userEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        const mostRecentEntry = userEntries[0];

        recentScore = mostRecentEntry.percentage;
        sessionUserRank = leaderboardEntries.findIndex(entry => entry === mostRecentEntry) + 1;
      }
    }

    res.json({
      leaderboardEntries,
      sessionUserRank,
      recentScore,
    });

  } catch (err) {
    console.error("Error fetching leaderboard data:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;