// profile.js (JavaScript)
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");

  async function fetchProfileData() {
    try {
      const response = await fetch(`/profile/${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();
      console.log("Profile Data:", data);
      displayUserProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }

  function displayUserProfile(data) {
    const profileUsername = document.getElementById("profile-username");
    const scoreList = document.getElementById("score-list");

    if (profileUsername) {
      profileUsername.textContent = data.username.toUpperCase();
    }

    if (scoreList && data.scores) {
      scoreList.innerHTML = data.scores
        .map(score => `<li>${score.score} - ${new Date(score.date).toLocaleString()}</li>`)
        .join("");
    }
  }

  fetchProfileData();
});