document.addEventListener("DOMContentLoaded", () => {
  // === Apply Saved Settings ===
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const fontButtons = document.querySelectorAll(".font-btn");
  const saveBtn = document.getElementById("save-settings-btn");

  const savedDarkMode = localStorage.getItem("darkMode");
  const savedFontSize = localStorage.getItem("fontSize");

  // Apply dark mode if saved
  if (savedDarkMode === "true") {
    document.body.classList.add("dark-mode");
    if (darkModeToggle) darkModeToggle.checked = true;
  }

  // Apply font size if saved
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

  // === Attach the login listener ===
  const loginBtn = document.getElementById("login-btn");

  async function login() {
    const email = document.getElementById("email")?.value.trim() || "";
    const password = document.getElementById("password")?.value.trim() || "";

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      console.log(`Attempting to login with email: ${email}`);

      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);

        if (contentType && contentType.includes("application/json")) {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || "Login failed");
        } else {
          throw new Error("Unexpected response format or route not found");
        }
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Store email in session storage for use in profile page
      sessionStorage.setItem("userEmail", email);
      localStorage.setItem("email", email);

      alert("Login successful!");
      window.location.href = "/profile";

    } catch (error) {
      console.error("Login error:", error.message);
      alert("Error: " + error.message);
    }
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", login);
  }
});
