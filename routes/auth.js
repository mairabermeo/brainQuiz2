const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { getCollection } = require('../model/db');

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const usersCollection = getCollection('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
      scores: []
    };

    await usersCollection.insertOne(newUser);
    console.log(`User created: ${email}`);
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usersCollection = getCollection('users');
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Set session
    req.session.user = {
      email: user.email,
      scores: user.scores || [],
    };

    console.log(`User logged in: ${email}`);

    // Handle pending score
    if (req.session.pendingScore) {
      const { score, totalQuestions } = req.session.pendingScore;

      const newScore = {
        date: new Date(),
        score,
        totalQuestions,
      };

      console.log("Saving pending score for user:", email);

      await usersCollection.updateOne(
        { email },
        { $push: { scores: newScore } }
      );

      console.log("Pending score saved for user:", email);

      req.session.pendingScore = null;
    }

    res.status(200).json({ message: "Login successful", user: req.session.user });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Logout Route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err.message);
      return res.status(500).json({ error: "Logout failed" });
    }
    res.redirect('/');
  });
});

module.exports = router;