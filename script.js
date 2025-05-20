// Toggle hamburger menu
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Initialise AOS and set up replay logic
window.addEventListener("load", () => {
  // First‑run settings
  AOS.init({
    duration: 800,   // initial animation speed
    once: false,     // allow repeats when elements re‑enter view
    offset: 100,
  });

  /**
   * Replay all AOS elements inside a section.
   * • First play: 800 ms (default)
   * • Subsequent plays: 400 ms
   * Works even if the section is already in view by manually toggling
   * the "aos-animate" class after refreshing AOS.
   */
  function replayAOS(section) {
    if (!section) return;

    // 1️⃣ Remove animation class & adjust duration
    section.querySelectorAll('[data-aos]').forEach(el => {
      el.classList.remove('aos-animate');

      if (el.dataset.played === 'true') {
        el.setAttribute('data-aos-duration', '400'); // faster on replay
      } else {
        el.dataset.played = 'true';
      }
    });

    // 2️⃣ Force AOS to recalculate
    AOS.refreshHard();

    // 3️⃣ Re‑apply class so animation triggers even while element is in view
    setTimeout(() => {
      section.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.add('aos-animate');
      });
    }, 50);
  }

  // Attach replay to ALL in‑page anchor links (top, hamburger, and footer nav)
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetSection = document.querySelector(targetId);

      // Wait for smooth scroll to finish before replaying (adjust if needed)
      setTimeout(() => replayAOS(targetSection), 600);
    });
  });
});

// Background transition on scroll
const sections = document.querySelectorAll("section");
const body = document.body;

window.addEventListener("scroll", () => {
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      const bg = section.getAttribute("data-bg");
      if (bg) {
        body.style.backgroundImage = `url('./assets/${bg}')`;
        body.style.backgroundSize = "cover";
        body.style.backgroundAttachment = "fixed";
        body.style.backgroundPosition = "center";
        body.style.transition = "background-image 0.6s ease-in-out";
      }
    }
  });
});

