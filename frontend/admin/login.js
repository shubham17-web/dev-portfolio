const API_BASE_URL = "https://dev-portfolio-api-egf2.onrender.com";

const loginForm = document.getElementById("admin-login-form");
const loginButton = document.getElementById("login-button");
const loginStatus = document.getElementById("login-status");

loginForm.addEventListener("submit", async (event) => {
event.preventDefault();


const username = document.getElementById("username").value.trim();
const password = document.getElementById("password").value;

loginButton.disabled = true;
loginButton.textContent = "Signing in...";
loginStatus.textContent = "";

try {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            typeof data.detail === "string"
                ? data.detail
                : "Login failed. Check your credentials."
        );
    }

    // Keep the token for this browser tab.
    sessionStorage.setItem("admin_access_token", data.access_token);

    window.location.href = "dashboard.html";
} catch (error) {
    loginStatus.textContent =
        error.message || "Unable to connect to the server.";

    loginStatus.style.color = "#b42318";
} finally {
    loginButton.disabled = false;
    loginButton.textContent = "Sign In";
}

});
