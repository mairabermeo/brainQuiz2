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

  document.addEventListener('DOMContentLoaded', async () => {

    async function fetchLeaderboardData() {
      try {
        const response = await fetch('/leaderboard/data');
        if (!response.ok) throw new Error("Failed to fetch leaderboard data");
  
        const data = await response.json();
        console.log("Leaderboard Data:", data);
  
        updateUserStats(data.sessionUserRank, data.recentScore);
        populateLeaderboard(data.leaderboardEntries);
  
      } catch (error) {
        console.error("Error loading leaderboard data:", error.message);
      }
    }
  
    function updateUserStats(rank, recentScore) {
      const yourRankContainer = document.querySelector('.your-rank');
  
      yourRankContainer.innerHTML = `
        <p>YOUR RANK: ${rank !== "Not Ranked" ? rank : "Not Ranked"}</p>
        <p>RECENT SCORE: ${recentScore !== "No recent quiz" ? `${recentScore}%` : "No recent quiz"}</p>
      `;
    }
  
    function populateLeaderboard(entries) {
      const topRow = document.querySelector('.top-row');
      const middleRow = document.querySelector('.middle-row');
      const bottomRow = document.querySelector('.bottom-row');
  
      topRow.innerHTML = '';
      middleRow.innerHTML = '';
      bottomRow.innerHTML = '';
  
      entries.forEach((entry, index) => {
        const position = index + 1;
        const entryHTML = `
          <div class="place">
            <p>${position}TH PLACE</p>
            <p>${entry.email}</p>
            <p>${entry.percentage}%</p>
          </div>
        `;
  
        if (position === 1) {
          topRow.innerHTML = `
            <div class="first-place">
              ${entryHTML}
            </div>
          `;
        } else if (position >= 2 && position <= 5) {
          middleRow.innerHTML += entryHTML;
        } else if (position >= 6 && position <= 10) {
          bottomRow.innerHTML += entryHTML;
        }
      });
    }
  
    fetchLeaderboardData();
  });  