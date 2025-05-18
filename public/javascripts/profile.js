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

document.addEventListener("DOMContentLoaded", () => {

  /**
   * Fetch Profile Data from Server
   */
  async function fetchProfileData() {
    try {
      const response = await fetch('/profile');
      if (!response.ok) throw new Error("Failed to fetch profile data");

      const { email, scores } = await response.json();

      console.log("Profile Data:", { email, scores });

      // Update user email display
      const profileUsername = document.getElementById("profile-username");
      if (profileUsername) {
        profileUsername.textContent = email.toUpperCase();
      }

      // Update Last Three Scores (Date)
      const dateList = document.getElementById("date-list");
      dateList.innerHTML = scores.length 
        ? scores.map(score => `<div class="stat-entry">${new Date(score.date).toLocaleString()}</div>`).join("")
        : `<div class="no-data">No quiz history yet</div>`;

      // Update Last Three Scores (Scores)
      const scoreList = document.getElementById("score-list");
      scoreList.innerHTML = scores.length 
        ? scores.map(score => `<div class="stat-entry">${score.score} / ${score.totalQuestions}</div>`).join("")
        : `<div class="no-data">No scores yet</div>`;

      // Calculate and Update Average Score
      const averageScoreEl = document.getElementById("average-score");
      if (scores.length > 0) {
        const totalScore = scores.reduce((sum, entry) => sum + entry.score, 0);
        const totalQuestions = scores.reduce((sum, entry) => sum + entry.totalQuestions, 0);
        const average = Math.round((totalScore / totalQuestions) * 100);
        averageScoreEl.textContent = `${average}%`;
      } else {
        averageScoreEl.textContent = "No Data";
      }

    } catch (error) {
      console.error("Error loading profile data:", error.message);
    }
  }

  fetchProfileData();
});
