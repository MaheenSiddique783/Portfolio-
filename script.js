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
const bgLayer = document.getElementById('bg-layer');
const defaultBg = body.getAttribute('data-default-bg') || 'bg-default.jpg';
let currentBg = defaultBg;

function crossfadeBackground(bgName) {
  if (!bgName || bgName === currentBg) return;
  const url = `./assets/${bgName}`;
  const img = new Image();
  img.onload = () => {
    bgLayer.style.backgroundImage = `url('${url}')`;
    // Fade in overlay
    bgLayer.style.opacity = '1';
    // After fade, swap base background and fade out overlay
    setTimeout(() => {
      body.style.backgroundImage = `url('${url}')`;
      bgLayer.style.opacity = '0';
      currentBg = bgName;
    }, 450);
  };
  img.onerror = () => {
    // silently ignore if asset missing
  };
  img.src = url;
}

function updateBackgroundForViewport() {
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.6 && rect.bottom >= window.innerHeight * 0.4) {
      const bg = section.id === 'metrics'
        ? (section.getAttribute('data-bg') || defaultBg)
        : defaultBg;
      crossfadeBackground(bg);
    }
  });
}

window.addEventListener('scroll', updateBackgroundForViewport);
window.addEventListener('load', updateBackgroundForViewport);

// Animated counters for metrics section
(function setupCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 1200 + Math.min(1800, target / 5000); // scale slightly by size
    const start = performance.now();

    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const val = Math.floor(target * ease(p));
      el.textContent = val.toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const seen = new WeakSet();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !seen.has(entry.target)) {
        seen.add(entry.target);
        animate(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((c) => io.observe(c));
})();
