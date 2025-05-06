// routes/profile.js
const express = require('express');
const router = express.Router();

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
  
  res.render('profile', { user: mockUser });
});

module.exports = router;