require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

// Import Database Connection
const { connectToDB } = require('./model/db');

// Create Express App
const app = express();

// Connect to MongoDB
(async () => {
  try {
    await connectToDB();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1); // Exit the application if connection fails
  }
})();

// Import Routers
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const questionsRouter = require('./routes/questions');

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/quiz', questionsRouter);

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

  // Log the error message to the console
  console.error('Error:', err.message);

  // Render the error page
  res.status(err.status || 500);
  res.render('error', { error: err, message: err.message });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;