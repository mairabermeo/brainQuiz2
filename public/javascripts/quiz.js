// === APPLY SAVED SETTINGS === //
document.addEventListener('DOMContentLoaded', () => {
  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode === "true") {
    document.body.classList.add("dark-mode");
  }
  const savedFontSize = localStorage.getItem("fontSize");
  if (savedFontSize) {
    document.documentElement.style.fontSize = savedFontSize;
  }
});

// Author: Jude Marryshow

let allQuestions = [];
let userAnswers = [];
let currentQuestionIndex = 0;
let timerInterval;

// Retrieve the saved timer setting or default to 45 seconds
let totalTimeLeft = parseInt(localStorage.getItem("timer")) || 45;

// Element references
const questionNumberEl = document.getElementById('question-number');
const questionTextEl = document.getElementById('question-text');
const optionsContainerEl = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const timerEl = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');

// Fetch quiz questions with retry mechanism
function fetchQuizQuestions(retries = 5) {
  console.log(`Fetching questions... Attempt ${6 - retries}`);
  
  fetch('https://opentdb.com/api.php?amount=10')
    .then(response => response.json())
    .then(data => {
      if (!data.results || data.results.length === 0) {
        throw new Error('No questions received');
      }

      const questions = data.results.map((item) => ({
        question: item.question,
        options: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
        correctAnswer: item.correct_answer
      }));

      allQuestions = questions;
      userAnswers = Array(questions.length).fill(null);

      updateQuestion();
      startTimer();
    })
    .catch(error => {
      console.error(`Error fetching quiz questions: ${error.message}`);
      
      if (retries > 0) {
        setTimeout(() => {
          fetchQuizQuestions(retries - 1);
        }, 2000); // Retry after 2 seconds
      } else {
        questionTextEl.textContent = 'Unable to load questions. Please try again later.';
      }
    });
}


// Update question and options
function updateQuestion() {
  const currentQuestion = allQuestions[currentQuestionIndex];

  questionNumberEl.textContent = `Question ${currentQuestionIndex + 1}/${allQuestions.length}`;
  questionTextEl.innerHTML = currentQuestion.question;
  optionsContainerEl.innerHTML = '';

  currentQuestion.options.forEach((option) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('option-btn');

    button.addEventListener('click', () => {
      handleAnswerSelection(button, option);
    });

    optionsContainerEl.appendChild(button);
  });

  updateNavigationButtons();
  updateProgressBar();
}

// Handle answer selection and highlighting
function handleAnswerSelection(button, selectedOption) {
  const currentQuestion = allQuestions[currentQuestionIndex];
  const correctOption = currentQuestion.correctAnswer;
  const buttons = optionsContainerEl.querySelectorAll('.option-btn');

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctOption) {
      btn.classList.add('correct');
    }
    if (btn.textContent === selectedOption && selectedOption !== correctOption) {
      btn.classList.add('incorrect');
    }
  });

  userAnswers[currentQuestionIndex] = selectedOption;
}

// Update navigation buttons
function updateNavigationButtons() {
  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.style.display = currentQuestionIndex === allQuestions.length - 1 ? 'none' : 'block';
  submitBtn.style.display = currentQuestionIndex === allQuestions.length - 1 ? 'block' : 'none';
}

// Update progress bar
function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Start timer
function startTimer() {
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    totalTimeLeft--;
    updateTimerDisplay();

    if (totalTimeLeft <= 0) {
      clearInterval(timerInterval);
      finishQuiz();
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  timerEl.textContent = `Time Left: ${totalTimeLeft}s`;
  timerEl.style.color = totalTimeLeft <= 5 ? '#cc0000' : '#fc94df';
}

// Navigation
prevBtn.addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    updateQuestion();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentQuestionIndex < allQuestions.length - 1) {
    currentQuestionIndex++;
    updateQuestion();
  }
});

submitBtn.addEventListener('click', finishQuiz);

// Finish the quiz
function finishQuiz() {
  clearInterval(timerInterval);

  let score = 0;

  allQuestions.forEach((question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      score++;
    }
  });

  const percentage = Math.round((score / allQuestions.length) * 100);

  localStorage.setItem('quizScore', percentage);
  localStorage.setItem('totalQuestions', allQuestions.length);
  localStorage.setItem('correctAnswers', score);

  window.location.href = '/results';
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchQuizQuestions);