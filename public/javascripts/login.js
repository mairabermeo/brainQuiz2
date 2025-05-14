document.addEventListener("DOMContentLoaded", () => {
  // === Applied the saved settings ===
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const fontButtons = document.querySelectorAll(".font-btn");
  const saveBtn = document.getElementById("save-settings-btn");

  const savedDarkMode = localStorage.getItem("darkMode");
  const savedFontSize = localStorage.getItem("fontSize");

  if (savedDarkMode === "true") {
    document.body.classList.add("dark-mode");
    if (darkModeToggle) darkModeToggle.checked = true;
  }

  if (savedFontSize) {
    document.documentElement.style.fontSize = savedFontSize;
    fontButtons.forEach((btn) => {
      btn.classList.remove("active-font");
      if (
        (savedFontSize === "14px" && btn.classList.contains("small")) ||
        (savedFontSize === "18px" && btn.classList.contains("medium")) ||
        (savedFontSize === "22px" && btn.classList.contains("large"))
      ) {
        btn.classList.add("active-font");
      }
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const isDarkMode = darkModeToggle?.checked || false;
      const fontSize = document.documentElement.style.fontSize || "16px";
      localStorage.setItem("darkMode", isDarkMode);
      localStorage.setItem("fontSize", fontSize);
      alert("Settings saved!");
    });
  }

  // === Attached the login listener ===
  const loginBtn = document.getElementById("login-btn");

  async function login() {
    const username = document.getElementById("username")?.value || "";
    const password = document.getElementById("password")?.value || "";

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      localStorage.setItem("username", username);
      alert("Login successful!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", login);
  }
});
