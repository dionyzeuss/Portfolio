"use strict";

// =====================================================
// PORTFOLIO SCRIPT
// Navigation, animations, projects, certificates and gallery
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // =====================================================
  // 1. NAVIGATION AND SMOOTH SCROLLING
  // =====================================================

  const header = document.querySelector("header");
  const navMenu = document.getElementById("nav-menu");
  const menuToggle = document.querySelector(".menu-toggle");

  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));

  const sections = Array.from(document.querySelectorAll("section[id]"));

  function closeMenu() {
    if (!navMenu || !menuToggle) return;

    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function updateHeader() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    navMenu?.classList.toggle("open", !isOpen);
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      const target = href ? document.querySelector(href) : null;

      // Only handle links pointing to sections on this page.
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });

      closeMenu();
    });
  });

  navMenu?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (header && !header.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  function updateActiveNavigation() {
    let currentSection = "";

    for (const section of sections) {
      const rect = section.getBoundingClientRect();

      if (rect.top <= 200 && rect.bottom > 200) {
        currentSection = section.id;
      }
    }

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentSection}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  let scrollScheduled = false;

  function handleScroll() {
    if (scrollScheduled) return;

    scrollScheduled = true;

    requestAnimationFrame(() => {
      updateHeader();
      updateActiveNavigation();
      updateScrollProgress();
      scrollScheduled = false;
    });
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  updateHeader();
  updateActiveNavigation();

  // =====================================================
  // 2. RESUME DOWNLOAD
  // =====================================================

  const resumeButton = document.getElementById("resumeBtn");

  resumeButton?.addEventListener("click", () => {
    const link = document.createElement("a");

    link.href = "DOMNIC_GABRIEL_ESCALANTE_Resume.pdf";
    link.download = "DOMNIC_GABRIEL_ESCALANTE_Resume.pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  // =====================================================
  // 3. SECTION FADE-IN ANIMATION
  // =====================================================

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  } else {
    sections.forEach((section) => section.classList.add("show"));
  }

  // =====================================================
  // 4. BOOT-UP INTRO
  // Plays on every page load.
  // Total duration: approximately 5 seconds.
  // =====================================================

  const bootScreen = document.getElementById("boot-screen");
  const bootLog = document.getElementById("boot-log");
  const bootProgress = document.getElementById("boot-progress-bar");
  const bootStatus = document.getElementById("boot-status");
  const skipBootButton = document.getElementById("skip-boot");

  if (bootScreen) {
    const messages = [
      "INITIALIZING SYSTEM........",
      "LOADING PORTFOLIO MODULES...",
      "CHECKING PROJECT DATABASE...",
      "SYSTEM ONLINE ............ OK",
    ];

    let messageIndex = 0;
    let bootFinished = false;
    const timers = new Set();

    function scheduleBoot(callback, delay) {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);

      timers.add(timer);
    }

    function finishBoot() {
      if (bootFinished) return;

      bootFinished = true;

      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();

      if (bootProgress) {
        bootProgress.style.width = "100%";
      }

      if (bootStatus) {
        bootStatus.textContent = "SYSTEM ONLINE // WELCOME";
      }

      bootScreen.classList.add("boot-exit");

      scheduleBoot(
        () => {
          bootScreen.classList.remove("active", "boot-exit");
          bootScreen.style.display = "none";
          document.body.style.overflow = "";
        },
        reduceMotion ? 0 : 500,
      );
    }

    function showNextBootMessage() {
      if (bootFinished) return;

      if (messageIndex >= messages.length) {
        // Finish at approximately 4.5 seconds.
        scheduleBoot(finishBoot, 500);
        return;
      }

      if (bootLog) {
        const line = document.createElement("p");
        line.textContent = `> ${messages[messageIndex]}`;

        if (messageIndex === messages.length - 1) {
          line.classList.add("boot-ok");
        }

        bootLog.appendChild(line);
      }

      messageIndex++;

      if (bootProgress) {
        bootProgress.style.width = `${(messageIndex / messages.length) * 100}%`;
      }

      // Four messages, approximately one second apart.
      scheduleBoot(showNextBootMessage, 1000);
    }

    // Reset the boot screen on every page load.
    bootScreen.classList.remove("boot-exit");
    bootScreen.classList.add("active");
    bootScreen.style.display = "";

    if (bootLog) bootLog.replaceChildren();
    if (bootProgress) bootProgress.style.width = "0%";

    if (bootStatus) {
      bootStatus.textContent = "INITIALIZING...";
    }

    if (reduceMotion) {
      finishBoot();
    } else {
      document.body.style.overflow = "hidden";

      skipBootButton?.addEventListener("click", finishBoot);

      showNextBootMessage();
    }
  }
  // =====================================================
  // 5. PROJECT CARD NAVIGATION
  // Uses event delegation so cloned carousel cards also work.
  // =====================================================

  const projectPages = [
    "projects/metroidvania.html",
    "projects/techstore.html",
    "projects/flappybird.html",
    "projects/ticketingSystem.html",
    "projects/bargainApp.html",
  ];

  const projectTrack = document.querySelector(".projects-grid");

  projectTrack?.addEventListener("click", (event) => {
    // Preserve GitHub links and any other links inside a card.
    if (event.target.closest("a, button")) return;

    const card = event.target.closest(".project");

    if (!card || !projectTrack.contains(card)) return;

    const cards = Array.from(
      projectTrack.querySelectorAll(".project:not(.project-clone)"),
    );

    const index = cards.indexOf(card);

    if (index >= 0 && projectPages[index]) {
      window.location.href = projectPages[index];
    }
  });

  // =====================================================
  // 6. INFINITE PROJECT CAROUSEL
  // =====================================================

  const viewport = document.querySelector(".projects-viewport");
  const track = document.querySelector(".projects-grid");
  const previousProjectButton = document.getElementById("project-prev");
  const nextProjectButton = document.getElementById("project-next");
  const projectDots = document.getElementById("project-dots");
  const projectCounter = document.getElementById("project-counter");
  const carousel = document.querySelector(".projects-carousel");

  if (viewport && track) {
    const originalCards = Array.from(track.querySelectorAll(".project"));

    if (originalCards.length) {
      let visibleCount = 1;
      let position = 0;
      let isAnimating = false;
      let hoverTimer = null;
      let resizeTimer = null;

      function getVisibleCount() {
        if (window.innerWidth <= 700) return 1;
        if (window.innerWidth <= 1050) return 2;
        return 3;
      }

      function getStride() {
        const card = track.querySelector(".project");

        if (!card) return 0;

        const styles = window.getComputedStyle(track);
        const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 0;

        return card.getBoundingClientRect().width + gap;
      }

      function getRealIndex() {
        return (
          (((position - visibleCount) % originalCards.length) +
            originalCards.length) %
          originalCards.length
        );
      }

      function updateProjectDots() {
        if (!projectDots) return;

        const realIndex = getRealIndex();

        Array.from(projectDots.children).forEach((dot, index) => {
          const active = index === realIndex;

          dot.classList.toggle("active", active);
          dot.setAttribute("aria-current", active ? "true" : "false");
        });
      }

      function updateCarousel(animate = true) {
        track.style.transition =
          animate && !reduceMotion ? "transform 0.3s ease-in-out" : "none";

        track.style.transform = `translateX(-${position * getStride()}px)`;

        if (projectCounter) {
          projectCounter.textContent = `${getRealIndex() + 1} / ${originalCards.length}`;
        }

        updateProjectDots();
      }

      function createProjectDots() {
        if (!projectDots) return;

        projectDots.replaceChildren();

        originalCards.forEach((card, index) => {
          const dot = document.createElement("button");

          dot.type = "button";
          dot.className = "project-dot";
          dot.setAttribute("aria-label", `Show project ${index + 1}`);

          dot.addEventListener("click", () => {
            if (isAnimating) return;

            position = visibleCount + index;
            updateCarousel(true);
          });

          projectDots.appendChild(dot);
        });
      }

      function stopHoverSlide() {
        if (hoverTimer !== null) {
          clearInterval(hoverTimer);
          hoverTimer = null;
        }
      }

      function setupCarousel() {
        stopHoverSlide();

        track.querySelectorAll(".project-clone").forEach((clone) => {
          clone.remove();
        });

        visibleCount = Math.min(getVisibleCount(), originalCards.length);

        const beforeClones = originalCards.slice(-visibleCount).map((card) => {
          const clone = card.cloneNode(true);

          clone.classList.add("project-clone");
          clone.setAttribute("aria-hidden", "true");

          return clone;
        });

        beforeClones.forEach((clone) => track.prepend(clone));

        const afterClones = originalCards.slice(0, visibleCount).map((card) => {
          const clone = card.cloneNode(true);

          clone.classList.add("project-clone");
          clone.setAttribute("aria-hidden", "true");

          return clone;
        });

        afterClones.forEach((clone) => track.append(clone));

        position = visibleCount;
        isAnimating = false;

        createProjectDots();
        updateCarousel(false);
      }

      function moveCarousel(direction) {
        if (isAnimating || originalCards.length <= visibleCount) return;

        isAnimating = true;
        position += direction;

        updateCarousel(true);

        // Fallback in case transitionend does not fire.
        window.setTimeout(
          () => {
            if (!isAnimating) return;

            normalizeCarouselPosition();
          },
          reduceMotion ? 0 : 450,
        );
      }

      function normalizeCarouselPosition() {
        if (!isAnimating) return;

        if (position >= visibleCount + originalCards.length) {
          position = visibleCount;
        } else if (position < visibleCount) {
          position = visibleCount + originalCards.length - 1;
        }

        updateCarousel(false);
        isAnimating = false;
      }

      track.addEventListener("transitionend", (event) => {
        if (event.propertyName !== "transform" || !isAnimating) return;

        normalizeCarouselPosition();
      });

      previousProjectButton?.addEventListener("click", () => {
        moveCarousel(-1);
      });

      nextProjectButton?.addEventListener("click", () => {
        moveCarousel(1);
      });

      // Optional hover-edge navigation on desktop.
      if (carousel && window.matchMedia("(hover: hover)").matches) {
        const leftZone = document.createElement("div");
        const rightZone = document.createElement("div");

        leftZone.className = "carousel-hover-zone carousel-hover-left";
        rightZone.className = "carousel-hover-zone carousel-hover-right";

        leftZone.setAttribute("aria-hidden", "true");
        rightZone.setAttribute("aria-hidden", "true");

        carousel.append(leftZone, rightZone);

        function startHoverSlide(direction) {
          stopHoverSlide();
          moveCarousel(direction);

          hoverTimer = window.setInterval(() => {
            moveCarousel(direction);
          }, 900);
        }

        leftZone.addEventListener("mouseenter", () => {
          startHoverSlide(-1);
        });

        rightZone.addEventListener("mouseenter", () => {
          startHoverSlide(1);
        });

        leftZone.addEventListener("mouseleave", stopHoverSlide);
        rightZone.addEventListener("mouseleave", stopHoverSlide);
        carousel.addEventListener("mouseleave", stopHoverSlide);
      }

      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);

        resizeTimer = window.setTimeout(() => {
          setupCarousel();
        }, 180);
      });

      setupCarousel();
    }
  }

  // =====================================================
  // 7. CERTIFICATE FILTERS AND GALLERY
  // =====================================================

  const certificateGallery = document.getElementById("allCertificates");
  const expandCertificatesButton = document.getElementById(
    "toggleAllCertificates",
  );

  const certificateFilters = Array.from(
    document.querySelectorAll(".certificate-filter"),
  );

  const certificateCards = Array.from(
    document.querySelectorAll(".all-certificates-grid .certificate-card"),
  );

  const certificateResultCount = document.getElementById(
    "certificateResultsCount",
  );

  let activeCertificateFilter = "all";

  function applyCertificateFilter(category) {
    activeCertificateFilter = category;

    let visibleCount = 0;

    certificateCards.forEach((card) => {
      const matches = category === "all" || card.dataset.category === category;

      card.hidden = !matches;

      if (matches) visibleCount++;
    });

    if (certificateResultCount) {
      certificateResultCount.textContent = `Showing ${visibleCount} certificate${visibleCount === 1 ? "" : "s"}`;
    }
  }

  function updateCertificateFilterButtons(category) {
    certificateFilters.forEach((button) => {
      const active = button.dataset.filter === category;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setCertificateGalleryExpanded(expanded, shouldScroll = false) {
    if (!certificateGallery || !expandCertificatesButton) return;

    certificateGallery.classList.toggle("is-collapsed", !expanded);

    expandCertificatesButton.setAttribute("aria-expanded", String(expanded));

    const label = expandCertificatesButton.querySelector(
      ".expand-button-label",
    );

    if (label) {
      label.textContent = expanded ? "Show Less" : "Explore All Certificates";
    }

    if (expanded && shouldScroll) {
      certificateGallery.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }

    if (!expanded) {
      updateCertificateFilterButtons("all");
      applyCertificateFilter("all");
    }
  }

  // Start collapsed without overwriting the user's markup.
  if (certificateGallery && expandCertificatesButton) {
    setCertificateGalleryExpanded(false);
  }

  expandCertificatesButton?.addEventListener("click", () => {
    const expanded =
      expandCertificatesButton.getAttribute("aria-expanded") === "true";

    setCertificateGalleryExpanded(!expanded, !expanded);
  });

  certificateFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter || "all";

      updateCertificateFilterButtons(category);
      applyCertificateFilter(category);
    });
  });

  document.querySelectorAll(".credential-arrow").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category || "all";

      setCertificateGalleryExpanded(true, true);

      const matchingFilter = certificateFilters.find(
        (filterButton) => filterButton.dataset.filter === category,
      );

      if (matchingFilter) {
        matchingFilter.click();
      } else {
        updateCertificateFilterButtons("all");
        applyCertificateFilter("all");
      }
    });
  });

  applyCertificateFilter("all");
  updateCertificateFilterButtons("all");

  // =====================================================
  // 8. CERTIFICATE MODAL
  // =====================================================

  const certificateModal = document.getElementById("certificateModal");
  const certificateModalImage = document.getElementById(
    "certificateModalImage",
  );

  const modalCertificateTitle = document.getElementById(
    "modalCertificateTitle",
  );

  const modalCertificateCounter = document.getElementById(
    "modalCertificateCounter",
  );

  const modalCloseButton =
    certificateModal?.querySelector(".certificate-close");

  const modalPreviousButton =
    certificateModal?.querySelector(".modal-previous");

  const modalNextButton = certificateModal?.querySelector(".modal-next");

  let modalItems = [];
  let modalIndex = 0;
  let lastFocusedElement = null;

  function getCertificateButtons() {
    return Array.from(
      document.querySelectorAll("[data-certificate][data-title]"),
    ).filter((button) => {
      // Exclude certificate buttons inside a closed modal, if any.
      if (certificateModal?.contains(button)) return false;

      // Hidden certificates should not appear in modal navigation.
      if (button.closest(".certificate-card")?.hidden) return false;

      return true;
    });
  }

  function updateCertificateModal() {
    if (!modalItems.length || !certificateModalImage) return;

    const button = modalItems[modalIndex];

    certificateModalImage.src = button.dataset.certificate;
    certificateModalImage.alt = button.dataset.title || "Certificate Preview";

    if (modalCertificateTitle) {
      modalCertificateTitle.textContent =
        button.dataset.title || "Certificate Preview";
    }

    if (modalCertificateCounter) {
      modalCertificateCounter.textContent = `${modalIndex + 1} / ${modalItems.length}`;
    }
  }

  function openCertificateModal(button) {
    if (!certificateModal || !certificateModalImage || !button) return;

    const imageSrc = button.dataset.certificate;

    if (!imageSrc) return;

    modalItems = getCertificateButtons();

    // Ensure the clicked certificate is included.
    if (!modalItems.includes(button)) {
      modalItems.unshift(button);
    }

    modalIndex = modalItems.indexOf(button);

    if (modalIndex < 0) modalIndex = 0;

    lastFocusedElement = button;

    updateCertificateModal();

    certificateModal.classList.add("active");
    certificateModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    modalCloseButton?.focus();
  }

  function closeCertificateModal() {
    if (!certificateModal) return;

    certificateModal.classList.remove("active");
    certificateModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (certificateModalImage) {
      certificateModalImage.removeAttribute("src");
    }

    lastFocusedElement?.focus();
    lastFocusedElement = null;
  }

  function moveCertificateModal(direction) {
    if (!modalItems.length) return;

    modalIndex =
      (modalIndex + direction + modalItems.length) % modalItems.length;

    updateCertificateModal();
  }

  // Use one delegated handler for the featured and gallery certificates.
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-certificate][data-title]");

    if (!button) return;

    // If the element is an actual link, preserve normal link behavior.
    if (button.tagName === "A" && button.getAttribute("href")) {
      event.preventDefault();
    }

    openCertificateModal(button);
  });

  modalCloseButton?.addEventListener("click", closeCertificateModal);

  modalPreviousButton?.addEventListener("click", () => {
    moveCertificateModal(-1);
  });

  modalNextButton?.addEventListener("click", () => {
    moveCertificateModal(1);
  });

  certificateModal?.addEventListener("click", (event) => {
    if (event.target === certificateModal) {
      closeCertificateModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!certificateModal?.classList.contains("active")) return;

    if (event.key === "Escape") {
      closeCertificateModal();
    } else if (event.key === "ArrowLeft") {
      moveCertificateModal(-1);
    } else if (event.key === "ArrowRight") {
      moveCertificateModal(1);
    }
  });

  // =====================================================
  // 9. SCROLL PROGRESS BAR
  // =====================================================

  const progressBar = document.createElement("div");

  progressBar.id = "scroll-progress";
  progressBar.setAttribute("aria-hidden", "true");

  document.body.prepend(progressBar);

  function updateScrollProgress() {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

    progressBar.style.width = `${percentage}%`;
  }

  updateScrollProgress();

  // =====================================================
  // 10. CURSOR POSITION AND PROJECT CARD TILT
  // =====================================================

  const root = document.documentElement;

  if (!reduceMotion) {
    document.addEventListener("pointermove", (event) => {
      root.style.setProperty("--mx", `${event.clientX}px`);
      root.style.setProperty("--my", `${event.clientY}px`);

      if (event.pointerType === "touch") return;

      const element = event.target.closest?.(".project, .hero-image");

      if (!element) return;

      const rect = element.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 8;

      const rotateX = -((event.clientY - rect.top) / rect.height - 0.5) * 8;

      element.style.setProperty("--ry", `${rotateY}deg`);
      element.style.setProperty("--rx", `${rotateX}deg`);
    });

    document.addEventListener("pointerout", (event) => {
      const element = event.target.closest?.(".project, .hero-image");

      if (element && !element.contains(event.relatedTarget)) {
        element.style.setProperty("--rx", "0deg");
        element.style.setProperty("--ry", "0deg");
      }
    });
  }

  // =====================================================
  // 11. ABOUT SECTION SPOTLIGHT AND STAT COUNTERS
  // =====================================================

  document.addEventListener("pointermove", (event) => {
    const element = event.target.closest?.(".ab-main, .ab-card");

    if (!element) return;

    const rect = element.getBoundingClientRect();

    element.style.setProperty("--x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--y", `${event.clientY - rect.top}px`);
  });

  const statNumbers = document.querySelectorAll(".ab-stats [data-count]");

  if (statNumbers.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      statNumbers.forEach((element) => {
        element.textContent = element.dataset.count;
      });
    } else {
      const statsObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            observer.unobserve(entry.target);

            const element = entry.target;
            const endValue = Number(element.dataset.count);

            if (!Number.isFinite(endValue)) return;

            const startTime = performance.now();
            const duration = 1100;

            function animateNumber(now) {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);

              element.textContent = Math.round(endValue * eased);

              if (progress < 1) {
                requestAnimationFrame(animateNumber);
              }
            }

            requestAnimationFrame(animateNumber);
          });
        },
        { threshold: 0.6 },
      );

      statNumbers.forEach((element) => statsObserver.observe(element));
    }
  }

  // =====================================================
  // 12. ABOUT GALLERY: IMAGES, VIDEO, SWIPE AND AUTOPLAY
  // =====================================================

  const aboutGallery = document.getElementById("abGallery");

  if (aboutGallery) {
    const stage = aboutGallery.querySelector(".abg-stage");
    const dotsContainer = aboutGallery.querySelector(".abg-dots");
    const caption = aboutGallery.querySelector(".abg-caption");
    const playToggle = aboutGallery.querySelector(".abg-toggle");
    const soundToggle = aboutGallery.querySelector(".abg-sound");

    // Paths are relative to index.html.
    const galleryItems = [
      {
        type: "image",
        src: "gallery/gradpic1.jpg",
        cap: "Batch 2026",
      },
      {
        type: "image",
        src: "gallery/gradpic2.jpg",
        cap: "Graduation day",
      },
      {
        type: "image",
        src: "gallery/capstone.jpg",
        cap: "Defense day",
      },
      {
        type: "video",
        src: "gallery/capstone2.mp4",
        poster: "gallery/capstone.jpg",
        cap: "Capstone project demo",
      },
      {
        type: "image",
        src: "gallery/sampaguita.jpg",
        cap: "Sampaguita Interlude",
      },
    ];

    if (stage && dotsContainer && caption) {
      const delay = 4500;
      const videoMaxDuration = 15000;

      let items = [];
      let index = 0;
      let autoplay = !reduceMotion;
      let hovering = false;
      let inView = false;
      let slideTimer = null;
      let hoverTimer = null;
      let touchStartX = 0;

      function stopSlideTimer() {
        if (slideTimer !== null) {
          clearTimeout(slideTimer);
          slideTimer = null;
        }
      }

      function stopHoverTimer() {
        if (hoverTimer !== null) {
          clearInterval(hoverTimer);
          hoverTimer = null;
        }
      }

      function isRunning() {
        return autoplay && !hovering && inView && !document.hidden;
      }

      function getSlides() {
        return Array.from(stage.querySelectorAll(".abg-slide"));
      }

      function getVideos() {
        return getSlides().map((slide) => slide.querySelector("video"));
      }

      function syncGalleryVideo() {
        const slides = getSlides();
        const videos = getVideos();
        const currentVideo = videos[index];

        videos.forEach((video, videoIndex) => {
          if (!video) return;

          if (videoIndex === index && inView && !document.hidden) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });

        if (soundToggle) {
          soundToggle.hidden = !currentVideo;
          soundToggle.textContent =
            currentVideo && !currentVideo.muted ? "Sound on" : "Sound off";
          soundToggle.setAttribute(
            "aria-pressed",
            String(Boolean(currentVideo && !currentVideo.muted)),
          );
        }
      }

      function scheduleNextSlide() {
        stopSlideTimer();

        if (!isRunning() || !items.length) return;

        const currentVideo = getVideos()[index];

        slideTimer = window.setTimeout(
          () => {
            goToSlide(index + 1);
          },
          currentVideo ? videoMaxDuration : delay,
        );
      }

      function goToSlide(nextIndex) {
        if (!items.length) return;

        index = (nextIndex + items.length) % items.length;

        const slides = getSlides();
        const dots = Array.from(dotsContainer.children);

        slides.forEach((slide, slideIndex) => {
          slide.classList.toggle("active", slideIndex === index);
          slide.setAttribute("aria-hidden", String(slideIndex !== index));
        });

        dots.forEach((dot, dotIndex) => {
          const active = dotIndex === index;

          dot.classList.toggle("active", active);
          dot.setAttribute("aria-current", active ? "true" : "false");
        });

        caption.textContent = items[index].cap;

        const currentVideo = getVideos()[index];

        if (currentVideo) {
          try {
            currentVideo.currentTime = 0;
          } catch {
            // Some browsers may not allow seeking until metadata loads.
          }
        }

        syncGalleryVideo();
        scheduleNextSlide();
      }

      function buildGallery() {
        stage.replaceChildren();
        dotsContainer.replaceChildren();

        items.forEach((item, itemIndex) => {
          const figure = document.createElement("figure");
          figure.className = "abg-slide";
          figure.setAttribute("aria-hidden", "true");

          if (item.type === "video") {
            const video = document.createElement("video");

            video.muted = true;
            video.playsInline = true;
            video.preload = "metadata";
            video.src = item.src;
            video.setAttribute("aria-label", item.cap);

            if (item.poster) video.poster = item.poster;

            video.addEventListener("ended", () => {
              if (isRunning() && itemIndex === index) {
                goToSlide(index + 1);
              }
            });

            figure.appendChild(video);
          } else {
            const backgroundImage = document.createElement("img");
            backgroundImage.className = "abg-bg";
            backgroundImage.src = item.src;
            backgroundImage.alt = "";
            backgroundImage.setAttribute("aria-hidden", "true");

            const foregroundImage = document.createElement("img");
            foregroundImage.className = "abg-fg";
            foregroundImage.src = item.src;
            foregroundImage.alt = item.cap;

            if (itemIndex > 0) {
              backgroundImage.loading = "lazy";
              foregroundImage.loading = "lazy";
            }

            figure.append(backgroundImage, foregroundImage);
          }

          stage.appendChild(figure);

          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "abg-dot";
          dot.setAttribute(
            "aria-label",
            `Show slide ${itemIndex + 1}: ${item.cap}`,
          );

          dot.addEventListener("click", () => goToSlide(itemIndex));

          dotsContainer.appendChild(dot);
        });

        if (!items.length) {
          aboutGallery.hidden = true;
          return;
        }

        goToSlide(0);
      }

      // Check image paths before including images in the gallery.
      Promise.all(
        galleryItems.map((item) => {
          if (item.type === "video") {
            return Promise.resolve(item);
          }

          return new Promise((resolve) => {
            const image = new Image();

            image.onload = () => resolve(item);

            image.onerror = () => {
              console.warn(
                `About gallery image could not be loaded: ${item.src}`,
              );
              resolve(null);
            };

            image.src = item.src;
          });
        }),
      ).then((loadedItems) => {
        items = loadedItems.filter(Boolean);
        buildGallery();
      });

      aboutGallery.querySelector(".next")?.addEventListener("click", () => {
        goToSlide(index + 1);
      });

      aboutGallery.querySelector(".prev")?.addEventListener("click", () => {
        goToSlide(index - 1);
      });

      playToggle?.addEventListener("click", () => {
        autoplay = !autoplay;

        playToggle.textContent = autoplay ? "Pause" : "Play";
        playToggle.setAttribute("aria-pressed", String(!autoplay));

        scheduleNextSlide();
      });

      soundToggle?.addEventListener("click", () => {
        const video = getVideos()[index];

        if (!video) return;

        video.muted = !video.muted;

        soundToggle.textContent = video.muted ? "Sound off" : "Sound on";
        soundToggle.setAttribute("aria-pressed", String(!video.muted));

        if (!video.muted) {
          video.play().catch(() => {});
        }
      });

      aboutGallery.addEventListener("mouseenter", () => {
        hovering = true;
        stopHoverTimer();
        scheduleNextSlide();
      });

      aboutGallery.addEventListener("mouseleave", () => {
        hovering = false;
        stopHoverTimer();
        scheduleNextSlide();
      });

      // Hover the left/right edge to move between slides.
      if (window.matchMedia("(hover: hover)").matches) {
        ["left", "right"].forEach((side) => {
          const zone = document.createElement("div");

          zone.className = `abg-zone ${side}`;
          zone.setAttribute("aria-hidden", "true");

          zone.addEventListener("mouseenter", () => {
            stopHoverTimer();

            const direction = side === "right" ? 1 : -1;

            goToSlide(index + direction);

            hoverTimer = window.setInterval(() => {
              goToSlide(index + direction);
            }, 1100);
          });

          zone.addEventListener("mouseleave", stopHoverTimer);

          aboutGallery.appendChild(zone);
        });
      }

      // Swipe navigation.
      stage.addEventListener("pointerdown", (event) => {
        touchStartX = event.clientX;
      });

      stage.addEventListener("pointerup", (event) => {
        const distance = event.clientX - touchStartX;

        if (Math.abs(distance) > 50) {
          goToSlide(index + (distance < 0 ? 1 : -1));
        }
      });

      aboutGallery.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") goToSlide(index + 1);
        if (event.key === "ArrowLeft") goToSlide(index - 1);
      });

      if ("IntersectionObserver" in window) {
        const galleryObserver = new IntersectionObserver(
          (entries) => {
            inView = entries[0].isIntersecting;

            if (inView) {
              syncGalleryVideo();
              scheduleNextSlide();
            } else {
              stopSlideTimer();
              getVideos().forEach((video) => video?.pause());
            }
          },
          { threshold: 0.35 },
        );

        galleryObserver.observe(aboutGallery);
      } else {
        inView = true;
      }

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stopSlideTimer();
          getVideos().forEach((video) => video?.pause());
        } else {
          syncGalleryVideo();
          scheduleNextSlide();
        }
      });
    }
  }

  // =====================================================
  // 13. PROJECT VIDEO PLAYBACK
  // Only play videos while they are visible.
  // =====================================================

  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (document.hidden || !entry.isIntersecting) {
            video.pause();
          } else if (!reduceMotion) {
            video.play().catch(() => {});
          }
        });
      },
      { threshold: 0.3 },
    );

    document.querySelectorAll("video").forEach((video) => {
      video.preload = "metadata";
      videoObserver.observe(video);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        document.querySelectorAll("video").forEach((video) => {
          video.pause();
        });
      }
    });
  }

  console.log("Portfolio JavaScript initialized successfully.");
});
