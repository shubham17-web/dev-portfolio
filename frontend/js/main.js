// ---------- Mobile menu ----------
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
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
}

// ---------- Footer year ----------
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

// ---------- Project filters ----------
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
        selectedFilter === "all" || card.dataset.category === selectedFilter;

      card.hidden = !matches;
    });
  });
});

// ---------- "View all" for Projects and Certificates ----------
// Shows only the first 3 cards by default; the rest appear on "View all".
// Works together with the project category filter above.
[
  { id: "projects", noun: "projects" },
  { id: "certificates", noun: "certificates" },
].forEach((cfg) => {
  const section = document.getElementById(cfg.id);
  if (!section) return;

  const grid = section.querySelector("[data-collapsible]");
  const btn = section.querySelector(".view-all-btn");
  if (!grid || !btn) return;

  const limit = parseInt(grid.getAttribute("data-limit"), 10) || 3;
  const cards = Array.from(grid.children);
  let expanded = false;

  const activeFilter = () => {
    const active = section.querySelector(".filter-btn.active");
    return active ? active.dataset.filter : "all";
  };

  const update = () => {
    const filter = activeFilter();

    // Cards that belong to the current filter (certificates have no filter)
    const matching = cards.filter((card) => {
      const cat = card.dataset.category;
      return filter === "all" || !cat || cat === filter;
    });

    cards.forEach((card) => {
      const index = matching.indexOf(card);
      card.classList.toggle("is-collapsed", !expanded && index >= limit);
    });

    const hasMore = matching.length > limit;
    btn.parentElement.hidden = !hasMore;
    btn.textContent = expanded
      ? "Show less"
      : `View all ${cfg.noun} (${matching.length})`;
    btn.setAttribute("aria-expanded", String(expanded));
  };

  btn.addEventListener("click", () => {
    expanded = !expanded;
    update();
    if (!expanded) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // Reset to collapsed whenever a category filter is clicked
  section.querySelectorAll(".filter-btn").forEach((b) => {
    b.addEventListener("click", () => {
      expanded = false;
      update();
    });
  });

  update();
});

// ---------- Contact form ----------
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const contactStatus = document.getElementById("contact-status");
  const contactSubmit = document.getElementById("contact-submit");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    contactStatus.textContent = "Sending your message...";
    contactSubmit.disabled = true;

    // Free-tier servers sleep when idle, so the first request can be slow
    const wakeTimer = setTimeout(() => {
      contactStatus.textContent =
        "The server is waking up, this can take up to a minute. Please wait...";
    }, 5000);

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
      clearTimeout(wakeTimer);
      contactSubmit.disabled = false;
    }
  });
}

// ---------- Back to top button ----------
const backToTop = document.getElementById("back-to-top");

if (backToTop) {
  backToTop.hidden = false;

  const toggleBackToTop = () => {
    backToTop.classList.toggle("show", window.scrollY > 500);
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ---------- Fade-in on scroll ----------
const revealTargets = document.querySelectorAll(
  ".project-card, .certificate-card, .skills-category, .education-card, .about-section, .contact-section .glass"
);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add("is-visible");
        observer.unobserve(el);

        // Remove the helper classes afterwards so normal hover effects work
        setTimeout(() => {
          el.classList.remove("reveal", "is-visible");
          el.style.transitionDelay = "";
        }, 800);
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    observer.observe(el);
  });
}