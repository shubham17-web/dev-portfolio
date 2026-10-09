const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
const isOpen = navLinks.classList.toggle("open");
menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
link.addEventListener("click", () => {
navLinks.classList.remove("open");
menuToggle.setAttribute("aria-expanded", "false");
});
});

document.getElementById("year").textContent = new Date().getFullYear();

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
button.addEventListener("click", () => {
const selectedFilter = button.dataset.filter;


    filterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
    });

    projectCards.forEach((card) => {
        const matches =
            selectedFilter === "all" ||
            card.dataset.category === selectedFilter;

        card.hidden = !matches;
    });
});


});

const contactForm = document.getElementById("contact-form");

if (contactForm) {
const contactStatus = document.getElementById("contact-status");
const contactSubmit = document.getElementById("contact-submit");


contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    contactStatus.textContent = "Sending your message...";
    contactSubmit.disabled = true;

    const formData = new FormData(contactForm);

    const payload = {
        name: formData.get("name").trim(),
        email: formData.get("email").trim(),
        subject: formData.get("subject").trim(),
        message: formData.get("message").trim(),
    };

    try {
        const response = await fetch(
            "https://dev-portfolio-api-egf2.onrender.com/api/contact",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            const detail = Array.isArray(result.detail)
                ? result.detail.map((item) => item.msg).join(", ")
                : result.detail;

            throw new Error(detail || "Unable to send your message.");
        }

        contactStatus.textContent = result.message;
        contactForm.reset();
    } catch (error) {
        contactStatus.textContent =
            error.message === "Failed to fetch"
                ? "Cannot connect to the server. Please try again later."
                : error.message || "Something went wrong. Please try again.";
    } finally {
        contactSubmit.disabled = false;
    }
});
}