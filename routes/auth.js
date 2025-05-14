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

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;