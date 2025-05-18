require('dotenv').config();
const express = require('express');
const session = require('express-session'); 
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const { connectToDB } = require('./model/db');
const app = express();

// Connect to MongoDB
(async () => {
  try {
    await connectToDB();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1); 
  }
})();

// Session Setup
app.use(
  session({
    secret: 'brainQuizSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, 
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);

// Set View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import Routers
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const leaderboardRouter = require('./routes/leaderboard');
const profileRouter = require('./routes/profile');
const questionsRouter = require('./routes/questions');
const usersRouter = require('./routes/users');

// Middleware to Pass User Data to All Views
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  next();
});

// Register Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/leaderboard', leaderboardRouter);
app.use('/profile', profileRouter);
app.use('/quiz', questionsRouter);
app.use('/users', usersRouter);

// Home Route
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error Handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error('Error:', err.message);
  res.status(err.status || 500);
  res.render('error', { error: err.message });
});
module.exports = app;
