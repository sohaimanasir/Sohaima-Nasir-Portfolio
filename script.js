// hamburger toggle

const nav = document.getElementById("navLinks");
const icon = document.getElementById("hamburger-icon");
const backdrop = document.getElementById("navBackdrop");

function setMenu(open) {
  nav.classList.toggle("open", open);
  backdrop.classList.toggle("open", open);
  icon.classList.toggle("fa-bars", !open);
  icon.classList.toggle("fa-xmark", open);
}

function toggleMenu() {
  setMenu(!nav.classList.contains("open"));
}

document.querySelectorAll(".nav-links li").forEach((li) => {
  li.addEventListener("click", () => {
    setMenu(false);
    const target = document.getElementById(li.dataset.target);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// smooth scroll for any [data-scroll] links (e.g. About's CTA)
document.querySelectorAll("[data-scroll]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.getElementById(el.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// scroll-spy: highlight the nav link for the section in view
const navItems = document.querySelectorAll(".nav-links li");
const sections = ["home", "about", "projects", "skills", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((li) => {
          li.classList.toggle("active", li.dataset.target === entry.target.id);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
);

sections.forEach((section) => spyObserver.observe(section));

// screenshot gallery / lightbox
const galleries = {
  safeguard: [
    {
      src: "assets/login.png",
      caption: "Portal login — admin and technician access",
    },
    {
      src: "assets/overview.png",
      caption: "Executive overview — live performance snapshot",
    },
    {
      src: "assets/bookings.png",
      caption: "Booking management with detail view",
    },
    {
      src: "assets/calls.png",
      caption: "Call analytics with AI-extracted call data",
    },
    {
      src: "assets/technicians.png",
      caption: "Technician and team management",
    },
    {
      src: "assets/technician-portal.png",
      caption: "Technician field dashboard",
    },
    { src: "assets/cms.png", caption: "Built-in website builder / CMS" },
  ],
  kanban: [
    {
      src: "assets/kanban-login.png",
      caption: "Landing page — personal workspace",
    },
    {
      src: "assets/kanban-dashboard.png",
      caption: "Dashboard — boards and overdue tasks at a glance",
    },
  ],
};

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let activeGallery = [];
let activeIndex = 0;

function renderLightboxSlide() {
  const slide = activeGallery[activeIndex];
  lightboxImg.src = slide.src;
  lightboxImg.alt = slide.caption;
  lightboxCaption.textContent = `${slide.caption} (${activeIndex + 1}/${activeGallery.length})`;
}

function openLightbox(galleryKey) {
  activeGallery = galleries[galleryKey];
  if (!activeGallery || !activeGallery.length) return;
  activeIndex = 0;
  renderLightboxSlide();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showNext() {
  activeIndex = (activeIndex + 1) % activeGallery.length;
  renderLightboxSlide();
}

function showPrev() {
  activeIndex = (activeIndex - 1 + activeGallery.length) % activeGallery.length;
  renderLightboxSlide();
}

document.querySelectorAll(".gallery-trigger").forEach((btn) => {
  btn.addEventListener("click", () => openLightbox(btn.dataset.gallery));
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightboxNext) lightboxNext.addEventListener("click", showNext);
if (lightboxPrev) lightboxPrev.addEventListener("click", showPrev);

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
});
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector(".form-submit");
    const btnText = submitBtn.querySelector(".btn-text");

    submitBtn.disabled = true;
    btnText.textContent = "Sending...";
    formStatus.textContent = "";
    formStatus.className = "form-status";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        formStatus.textContent =
          "Thanks! Your message has been sent — I'll get back to you soon.";
        formStatus.classList.add("success");
        contactForm.reset();
      } else {
        formStatus.textContent =
          "Something went wrong. Please try again or email me directly.";
        formStatus.classList.add("error");
      }
    } catch (err) {
      formStatus.textContent =
        "Network error. Please try again or email me directly.";
      formStatus.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = "Send Message";
    }
  });
}