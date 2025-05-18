// === APPLY SAVED SETTINGS === //
document.addEventListener('DOMContentLoaded', function() {
    const savedDarkMode = localStorage.getItem("darkMode");
    const savedFontSize = localStorage.getItem("fontSize");
  
    if (savedDarkMode === "true") {
      document.body.classList.add("dark-mode");
    }
  
    if (savedFontSize) {
      document.documentElement.style.fontSize = savedFontSize;
    }
    
    // Hide elements initially until we determine which ones to show
    const resultEmoji = document.getElementById('result-emoji');
    const resultMessage = document.getElementById('result-message');
    const scorePercentage = document.getElementById('score-percentage');
    const percImage = document.querySelector('.perc-image');
    const bannerContainer = document.querySelector('.banner-container');
  
    [resultEmoji, resultMessage, scorePercentage, percImage].forEach((el) => {
      if (el) {
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
      }
    });
  
    // Get score data from localStorage
    const score = localStorage.getItem('quizScore') || '0';
    const username = localStorage.getItem('username') || '';
  
    console.log('Score retrieved from localStorage:', score);
  
    // Save the score to the server
    async function saveScore() {
      try {
        const response = await fetch('/profile/save-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, score: parseInt(score) }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save score');
        }
  
        const result = await response.json();
        console.log('Score saved:', result.message);
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
  
    if (username) {
      saveScore();
    }
  
    // Display the score
    if (scorePercentage && percImage && bannerContainer) {
      scorePercentage.style.position = 'absolute';
      scorePercentage.style.bottom = '30%';
      scorePercentage.style.left = '35%';
      scorePercentage.style.fontSize = '130px';
      scorePercentage.style.color = 'white';
      scorePercentage.style.fontWeight = 'bold';
      scorePercentage.style.transition = 'opacity 0.3s ease';
  
      percImage.style.position = 'absolute';
      percImage.style.bottom = '30%';
      percImage.style.left = '50%';
      percImage.style.transition = 'opacity 0.3s ease';
  
      scorePercentage.textContent = score;
    }
  
    // Set size and visibility for result images
    [resultEmoji, resultMessage].forEach((el) => {
      if (el) {
        el.style.maxWidth = '150px';
        el.style.maxHeight = '150px';
        el.style.width = 'auto';
        el.style.height = 'auto';
      }
    });
  
    // Determine the score category and update images
    const scoreNum = parseInt(score) || 0;
  
    if (resultEmoji) resultEmoji.src = '';
    if (resultMessage) resultMessage.src = '';
  
    if (scoreNum >= 70) {
      if (resultEmoji) resultEmoji.src = '/images/thumbs-up.webp';
      if (resultMessage) resultMessage.src = '/images/great.webp';
      document.body.classList.add('good-score');
    } else if (scoreNum >= 40) {
      if (resultEmoji) resultEmoji.src = '/images/meh.webp';
      if (resultMessage) resultMessage.src = '/images/almost.webp';
      document.body.classList.add('meh-score');
    } else {
      if (resultEmoji) resultEmoji.src = '/images/crying-img.webp';
      if (resultMessage) resultMessage.src = '/images/better-luck-next-time.webp';
      document.body.classList.add('bad-score');
    }
  
    setTimeout(function() {
      [resultEmoji, resultMessage, scorePercentage, percImage].forEach((el) => {
        if (el) {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        }
      });
    }, 50);
  
    if (!score) {
      console.warn('No score found in localStorage');
    }
  });  