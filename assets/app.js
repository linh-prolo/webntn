const menuButton = document.getElementById("menuBtn");
const navigation = document.getElementById("mainNav");
const header = document.querySelector(".site-header");
const progressBar = document.getElementById("progressBar");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightboxButton = document.getElementById("closeLightbox");
const animatedElements = document.querySelectorAll("[data-animate]");
const posterButtons = document.querySelectorAll("[data-src]");
const allowedImageSources = new Set([
  "assets/images/page-01.webp",
  "assets/images/page-02.webp",
  "assets/images/page-03.webp",
  "assets/images/page-04.webp",
  "assets/images/page-05.webp",
  "assets/images/page-06.webp",
  "assets/images/page-07.webp",
  "assets/images/page-08.webp",
  "assets/images/page-09.webp",
  "assets/images/page-10.webp",
  "assets/images/page-11.webp",
  "assets/images/page-12.webp",
  "assets/images/page-13.webp",
  "assets/images/page-14.webp",
  "assets/images/page-15.webp",
  "assets/images/page-16.webp",
  "assets/images/page-17.webp",
  "assets/images/page-18.webp",
  "assets/images/page-19.webp",
  "assets/images/page-20.webp"
]);

const updateMenuButtonLabel = (isOpen) => {
  if (!menuButton) {
    return;
  }

  menuButton.setAttribute("aria-label", isOpen ? "Đóng điều hướng" : "Mở điều hướng");
};

updateMenuButtonLabel(false);

const buildLightboxAlt = (button, image, source) => {
  const imageAlt = image?.getAttribute("alt")?.trim();
  const buttonLabel = button.getAttribute("aria-label")?.trim();

  if (imageAlt) {
    return imageAlt;
  }

  if (buttonLabel) {
    return buttonLabel;
  }

  const filename = source.split("/").pop()?.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return filename ? `Ảnh ${filename}` : "Ảnh phóng to";
};

const closeMenu = () => {
  if (!menuButton || !navigation) {
    return;
  }

  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  updateMenuButtonLabel(false);
  document.body.classList.remove("menu-open");
};

const updateScrollProgress = () => {
  if (!progressBar) {
    return;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progressBar.style.width = `${progress}%`;
};

const updateHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("scrolled", window.scrollY > 60);
};

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    updateMenuButtonLabel(isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

window.addEventListener("scroll", () => {
  updateScrollProgress();
  updateHeaderState();
}, { passive: true });

updateScrollProgress();
updateHeaderState();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");
      instance.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px"
  });

  animatedElements.forEach((element) => observer.observe(element));
} else {
  animatedElements.forEach((element) => element.classList.add("visible"));
}

const closeLightbox = () => {
  if (!lightbox || !lightbox.open) {
    return;
  }

  lightbox.close();
};

posterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) {
      return;
    }

    const source = button.getAttribute("data-src")?.trim();
    const image = button.querySelector("img");
    if (!source || !allowedImageSources.has(source)) {
      return;
    }

    lightboxImage.setAttribute("src", source);
    lightboxImage.setAttribute("alt", buildLightboxAlt(button, image, source));
    lightbox.showModal();
  });
});

closeLightboxButton?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightbox?.addEventListener("close", () => {
  if (lightboxImage) {
    lightboxImage.removeAttribute("src");
  }
});
