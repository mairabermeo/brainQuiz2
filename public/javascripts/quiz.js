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
let score = 0;

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
        }, 2000);
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

  if (selectedOption === correctOption) {
    score++;
  }
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

// Navigate
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

// Finish the quiz and handle results
function finishQuiz() {
  clearInterval(timerInterval);

  let correctAnswers = 0;

  allQuestions.forEach((question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      correctAnswers++;
    }
  });

  const percentage = Math.round((correctAnswers / allQuestions.length) * 100);

  localStorage.setItem('quizScore', percentage);
  localStorage.setItem('totalQuestions', allQuestions.length);
  localStorage.setItem('correctAnswers', correctAnswers);

  const email = localStorage.getItem("email");

  if (email) {
    saveQuizResult(correctAnswers, allQuestions.length, email);
  } else {
    window.location.href = "/results";
  }
}

// Save quiz result to the server for logged-in users
async function saveQuizResult(score, totalQuestions, email) {
  try {
    const response = await fetch("/quiz/save-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score, totalQuestions, email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to save quiz result.");
    }

    console.log("Quiz result saved successfully:", data.message);

    window.location.href = "/results";

  } catch (error) {
    console.error("Error saving quiz result:", error.message);

    window.location.href = "/results";
  }
}

document.addEventListener('DOMContentLoaded', fetchQuizQuestions);
