// Author: Maira Bermeo
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

//start
router.get('/', function(req, res, next) {
  res.render('main/index');
});

router.get('/start', function(req, res, next) {
  res.render('main/start');
});

router.get('/results', function(req, res, next) {
  res.render('main/results');
});

router.get('/leaderboard', function(req, res, next) {
  res.render('main/leaderboard');
});

router.get('/login', function(req, res, next) {
  res.render('main/login');
});

router.get('/signup', function(req, res, next) {
  res.render('main/signup');
});

// Updated profile route to use main/profile
router.get('/profile', function(req, res) {
  res.render('main/profile');
});

// Fetch Profile Data (JSON Response)
router.get('/profile/data', async function(req, res) {
  const email = req.session.user ? req.session.user.email : null;

  if (!email) {
    console.warn("User not logged in. Redirecting to login...");
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    const usersCollection = getCollection('users');
    const user = await usersCollection.findOne({ email });

    if (!user) {
      console.warn("User not found in database.");
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      username: user.username,
      email: user.email,
      quizHistory: user.scores || []
    });

  } catch (err) {
    console.error("Error fetching profile data:", err.message);
    res.status(500).json({ error: "Server error while fetching profile data" });
  }
});

router.get('/settings', function(req, res, next) {
  res.render('main/settings');
});

module.exports = router;