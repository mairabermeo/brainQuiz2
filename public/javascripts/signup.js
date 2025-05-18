document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const fontButtons = document.querySelectorAll(".font-btn");
  const saveBtn = document.getElementById("save-settings-btn");
  const signupBtn = document.getElementById("signup-btn");

  const savedDarkMode = localStorage.getItem("darkMode");
  const savedFontSize = localStorage.getItem("fontSize");

  // Apply saved dark mode setting
  if (savedDarkMode === "true") {
    document.body.classList.add("dark-mode");
    if (darkModeToggle) darkModeToggle.checked = true;
  }

  // Apply saved font size setting
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

  // Save settings
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const isDarkMode = darkModeToggle?.checked || false;
      const fontSize = document.documentElement.style.fontSize || "16px";
      localStorage.setItem("darkMode", isDarkMode);
      localStorage.setItem("fontSize", fontSize);
      alert("Settings saved!");
    });
  }

  // Signup function
async function signup() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!emailInput || !passwordInput) {
    alert("Email or Password field not found.");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const response = await fetch("/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Signup failed");
    }

    alert("Signup successful!");
    window.location.href = "/login";

  } catch (error) {
    alert("Error: " + error.message);
  }
}
  // Attach signup listener
  if (signupBtn) {
    signupBtn.addEventListener("click", signup);
  }
});
