const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getCollection } = require('../model/db');

// Render the quiz page
router.get('/', (req, res) => {
  res.render('main/quiz', { user: req.session.user });
});

// Utility function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Fetch questions from Open Trivia Database API
router.get('/quiz', async (req, res) => {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=10');
    const rawQuestions = response.data.results;
    const transformedQuestions = rawQuestions.map(item => ({
      question: item.question,
      options: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
      correctAnswer: item.correct_answer
    }));

    res.json(transformedQuestions);
  } catch (error) {
    console.error("Error fetching quiz questions:", error.message);
    res.status(500).json({ error: "Failed to fetch quiz questions" });
  }
});

// Save quiz result to the database
router.post('/save-result', async (req, res) => {
  const { score, totalQuestions } = req.body;
  const email = req.session.user ? req.session.user.email : null;

  if (!score || !totalQuestions) {
    return res.status(400).json({ error: "Score and totalQuestions are required." });
  }

  try {
    const usersCollection = getCollection('users');

    if (!email) {
      req.session.pendingScore = { score, totalQuestions };
      return res.status(401).json({ redirect: "/auth/login" });
    }

    const newScore = {
      date: new Date(),
      score,
      totalQuestions,
    };

    await usersCollection.updateOne(
      { email },
      { $push: { scores: newScore } }
    );

    res.status(200).json({ message: "Score saved successfully" });

  } catch (error) {
    console.error("Error saving score:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;