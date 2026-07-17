/* ============================================================
   NTN Việt Nam – app.js
   Features:
     • Mobile menu toggle
     • Scroll progress bar
     • Header scroll state (sticky blur)
     • IntersectionObserver animate-on-scroll
     • Counter animation for hero stats
     • Active nav-link highlight on scroll
     • Contact form validation
   ============================================================ */

"use strict";

/* ---- Element references ---------------------------------- */
const menuButton   = document.getElementById("menuBtn");
const navigation   = document.getElementById("mainNav");
const header       = document.querySelector(".site-header");
const progressBar  = document.getElementById("progressBar");
const contactForm  = document.getElementById("contactForm");
const formSuccess  = document.getElementById("formSuccess");

/* ============================================================
   MOBILE MENU
   ============================================================ */
const closeMenu = () => {
  if (!menuButton || !navigation) return;
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Mở điều hướng");
  document.body.classList.remove("menu-open");
};

if (menuButton && navigation) {
  menuButton.setAttribute("aria-label", "Mở điều hướng");

  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Đóng điều hướng" : "Mở điều hướng");
    document.body.classList.toggle("menu-open", isOpen);
  });

  navigation.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", closeMenu)
  );

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
const updateProgress = () => {
  if (!progressBar) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = maxScroll > 0
    ? `${(window.scrollY / maxScroll) * 100}%`
    : "0%";
};

/* ============================================================
   HEADER SCROLL STATE
   ============================================================ */
const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 60);
};

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */
const navLinks = Array.from(
  document.querySelectorAll(".main-nav a[href^='#']")
);

const sectionTargets = navLinks
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const updateActiveLink = () => {
  const scrollPos = window.scrollY + window.innerHeight * 0.35;
  let current = null;

  sectionTargets.forEach(sec => {
    if (sec.offsetTop <= scrollPos) current = sec;
  });

  navLinks.forEach(a => {
    a.classList.toggle(
      "active",
      current !== null && a.getAttribute("href") === `#${current.id}`
    );
  });
};

/* ---- Combined scroll handler ----------------------------- */
window.addEventListener("scroll", () => {
  updateProgress();
  updateHeader();
  updateActiveLink();
}, { passive: true });

updateProgress();
updateHeader();
updateActiveLink();

/* ============================================================
   ANIMATE ON SCROLL  (IntersectionObserver)
   ============================================================ */
if ("IntersectionObserver" in window) {
  const ioOptions = { threshold: 0.12, rootMargin: "0px 0px -8% 0px" };
  const animateObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    });
  }, ioOptions);

  document.querySelectorAll("[data-animate]").forEach(el =>
    animateObserver.observe(el)
  );
} else {
  /* Fallback: show all immediately */
  document.querySelectorAll("[data-animate]").forEach(el =>
    el.classList.add("visible")
  );
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
/**
 * Animate a numeric counter from 0 to `target` over `duration` ms.
 * Uses an ease-out cubic function.
 */
const animateCounter = (element, target, duration) => {
  const start = performance.now();
  const tick = now => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const statsSection = document.querySelector(".hero-stats");

if (statsSection && "IntersectionObserver" in window) {
  let statsAnimated = false;
  const statsObserver = new IntersectionObserver(entries => {
    if (statsAnimated || !entries[0].isIntersecting) return;
    statsAnimated = true;

    statsSection.querySelectorAll(".stat-item").forEach(item => {
      const counter = item.querySelector(".counter");
      const target  = parseInt(item.getAttribute("data-count"), 10);
      if (counter && !isNaN(target)) {
        animateCounter(counter, target, 1600);
      }
    });
  }, { threshold: 0.4 });

  statsObserver.observe(statsSection);
} else if (statsSection) {
  /* Fallback: set final values immediately */
  statsSection.querySelectorAll(".stat-item").forEach(item => {
    const counter = item.querySelector(".counter");
    const target  = parseInt(item.getAttribute("data-count"), 10);
    if (counter && !isNaN(target)) counter.textContent = target;
  });
}

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */
if (contactForm) {
  /** Map field id → error element id */
  const errorId = fieldId => ({
    contactName:    "nameError",
    contactPhone:   "phoneError",
    contactEmail:   "emailError",
    contactMessage: "messageError",
  }[fieldId] || null);

  const setError = (fieldId, message) => {
    const input = document.getElementById(fieldId);
    const errEl = document.getElementById(errorId(fieldId));
    input?.classList.add("error");
    if (errEl) errEl.textContent = message;
  };

  const resetError = fieldId => {
    const input = document.getElementById(fieldId);
    const errEl = document.getElementById(errorId(fieldId));
    input?.classList.remove("error");
    if (errEl) errEl.textContent = "";
  };

  /** At least 8 digits (ignoring spaces, dashes, parens, leading +) */
  const isValidPhone = v => (v.match(/\d/g) || []).length >= 8 && /^[\+\d][\d\s\-\(\)]{7,}$/.test(v);
  const isValidEmail = v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  /* Live clear on typing */
  ["contactName", "contactPhone", "contactEmail", "contactMessage"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", () => resetError(id));
  });

  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const name    = document.getElementById("contactName")?.value.trim() ?? "";
    const phone   = document.getElementById("contactPhone")?.value.trim() ?? "";
    const email   = document.getElementById("contactEmail")?.value.trim() ?? "";
    const message = document.getElementById("contactMessage")?.value.trim() ?? "";

    /* Reset all errors */
    ["contactName", "contactPhone", "contactEmail", "contactMessage"].forEach(resetError);
    if (formSuccess) formSuccess.textContent = "";

    let valid = true;

    if (!name) {
      setError("contactName", "Vui lòng nhập họ tên.");
      valid = false;
    }

    if (!phone) {
      setError("contactPhone", "Vui lòng nhập số điện thoại.");
      valid = false;
    } else if (!isValidPhone(phone)) {
      setError("contactPhone", "Số điện thoại không hợp lệ (8–15 chữ số).");
      valid = false;
    }

    if (email && !isValidEmail(email)) {
      setError("contactEmail", "Địa chỉ email không hợp lệ.");
      valid = false;
    }

    if (!message) {
      setError("contactMessage", "Vui lòng nhập nội dung tư vấn.");
      valid = false;
    }

    if (!valid) return;

    /* In production: replace with fetch() to your API endpoint */
    contactForm.reset();
    if (formSuccess) {
      formSuccess.textContent = "✓ Yêu cầu đã được gửi thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.";
      setTimeout(() => {
        if (formSuccess) formSuccess.textContent = "";
      }, 6000);
    }
  });
}
