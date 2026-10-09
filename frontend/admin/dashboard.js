
const API_BASE_URL = "http://127.0.0.1:8000";

const token = sessionStorage.getItem("admin_access_token");

const messageCount = document.getElementById("message-count");
const messagesList = document.getElementById("messages-list");
const dashboardStatus = document.getElementById("dashboard-status");
const refreshButton = document.getElementById("refresh-button");
const logoutButton = document.getElementById("logout-button");

if (!token) {
    window.location.replace("login.html");
}

function addTextElement(parent, tagName, className, value) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    // Use textContent so submitted messages cannot inject HTML.
    element.textContent = value ?? "";
    parent.appendChild(element);

    return element;
}

function formatDate(value) {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleString();
}

async function loadMessages() {
    refreshButton.disabled = true;
    dashboardStatus.textContent = "Loading messages...";
    messagesList.replaceChildren();

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/messages`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            sessionStorage.removeItem("admin_access_token");
            window.location.replace("login.html");
            return;
        }

        if (!response.ok) {
            throw new Error("Unable to load messages. Please try again.");
        }

        const data = await response.json();

        messageCount.textContent = data.total ?? 0;

        if (!Array.isArray(data.messages) || data.messages.length === 0) {
            dashboardStatus.textContent = "No contact messages yet.";
            return;
        }

        dashboardStatus.textContent =
            `Showing ${data.messages.length} message(s).`;

        for (const message of data.messages) {
            const card = document.createElement("article");
            card.className = "message-card";

            addTextElement(card, "h3", "", message.subject);
            addTextElement(
                card,
                "p",
                "message-meta",
                `From: ${message.name} · ${message.email}`
            );
            addTextElement(
                card,
                "p",
                "message-meta",
                `Received: ${formatDate(message.created_at)}`
            );
            addTextElement(card, "p", "message-body", message.message);

            messagesList.appendChild(card);
        }
    } catch (error) {
        dashboardStatus.textContent =
            error.message || "Could not connect to the API.";
    } finally {
        refreshButton.disabled = false;
    }
}

refreshButton.addEventListener("click", loadMessages);

logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("admin_access_token");
    window.location.replace("login.html");
});

if (token) {
    loadMessages();
}