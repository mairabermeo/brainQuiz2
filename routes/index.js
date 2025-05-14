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
router.get('/profile', function(req, res, next) {
  // Mock user data for testing
  const mockUser = {
    username: 'Jane Doe',
    email: 'jane@example.com',
    quizHistory: [
      {
        date: new Date('2025-02-09T20:05:00'),
        score: 7,
        totalQuestions: 10,
        category: 'History',
        difficulty: 'medium'
      },
      {
        date: new Date('2025-04-02T15:45:00'),
        score: 5,
        totalQuestions: 10,
        category: 'Science',
        difficulty: 'hard'
      },
      {
        date: new Date('2025-05-02T00:30:00'),
        score: 6,
        totalQuestions: 10,
        category: 'Entertainment',
        difficulty: 'easy'
      }
    ]
  };
  
  res.render('main/profile', { user: mockUser });
});

router.get('/settings', function(req, res, next) {
  res.render('main/settings');
});

module.exports = router;
