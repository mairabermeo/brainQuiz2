const mongoose = require('mongoose');

// User schema with quiz history
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  quizHistory: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      score: {
        type: Number,
        required: true
      },
      totalQuestions: {
        type: Number,
        default: 10
      },
      category: {
        type: String
      },
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard']
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// If mongoose isn't used yet in your project, you can comment out this line
// or add mongoose as a dependency
// module.exports = mongoose.model('User', userSchema);

// For development without mongoose
module.exports = { userSchema };