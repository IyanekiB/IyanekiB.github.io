/* ============================================================
   main.js — Global site controller
   Handles: nav/footer injection, scroll effects, typed hero,
            mobile menu, scroll-reveal, card tilt, smooth scroll
   ============================================================ */

'use strict';

// ─── Utilities ───────────────────────────────────────────────
function getBasePath() {
  return window.location.pathname.includes('/projects/') ? '../' : './';
}

// ─── Navigation injection ─────────────────────────────────────
function injectNav(base) {
  const navHTML = `
    <nav id="site-nav" role="navigation" aria-label="Main navigation">
      <div class="nav-inner container">
        <a class="nav-logo" href="${base}index.html" aria-label="Iyan Nekib — Home">IN.</a>

        <ul class="nav-links" role="list">
          <li><a class="nav-link" href="${base}index.html">Home</a></li>
          <li><a class="nav-link" href="${base}about.html">About</a></li>
          <li><a class="nav-link" href="${base}projects.html">Projects</a></li>
          <li><a class="nav-link" href="${base}resume.html">Resume</a></li>
          <li>
            <a class="nav-link nav-external"
               href="https://github.com/IyanekiB"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="GitHub (opens in new tab)">
              GitHub&nbsp;↗
            </a>
          </li>
          <li>
            <a class="nav-link nav-external"
               href="https://www.linkedin.com/in/iyan-nekib/"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="LinkedIn (opens in new tab)">
              LinkedIn&nbsp;↗
            </a>
          </li>
        </ul>

        <button id="hamburger" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobile-menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `;

  // Mobile menu is injected at body level (not inside <nav>) to prevent
  // backdrop-filter on .scrolled nav from creating a containing block that
  // traps position:fixed children within the 68px nav height.
  const mobileMenuHTML = `
    <div id="mobile-menu" aria-hidden="true" role="dialog" aria-label="Mobile navigation">
      <a class="mobile-nav-link" href="${base}index.html">Home</a>
      <a class="mobile-nav-link" href="${base}about.html">About</a>
      <div class="mobile-nav-divider"></div>
      <a class="mobile-nav-link" href="${base}projects.html">Projects</a>
      <div class="mobile-nav-divider"></div>
      <a class="mobile-nav-link" href="${base}resume.html">Resume</a>
      <div class="mobile-social-links">
        <a class="mobile-social-link" href="https://github.com/IyanekiB" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a class="mobile-social-link" href="https://www.linkedin.com/in/iyan-nekib/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      </div>
    </div>
  `;

  const mount = document.getElementById('nav-mount');
  if (mount) {
    mount.innerHTML = navHTML;
    // Remove any previous mobile menu (re-injection on SPA-style reloads)
    const existing = document.getElementById('mobile-menu');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', mobileMenuHTML);
  }
}

// ─── Footer injection ─────────────────────────────────────────
function injectFooter() {
  const footerHTML = `
    <footer id="site-footer">
      <div class="container footer-inner">
        <p class="footer-copy">© ${new Date().getFullYear()} Iyan Nekib — Halifax, NS</p>
        <div class="footer-social">
          <a href="https://github.com/IyanekiB" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/iyan-nekib/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:iyan.n@outlook.com">iyan.n@outlook.com</a>
        </div>
      </div>
    </footer>
  `;

  const mount = document.getElementById('footer-mount');
  if (mount) mount.innerHTML = footerHTML;
}

// ─── Sticky nav on scroll ─────────────────────────────────────
function initScrolledNav() {
  const isHome = !document.body.classList.contains('page-interior');
  if (!isHome) return;

  const handler = () => {
    const nav = document.getElementById('site-nav');
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 80);
  };

  window.addEventListener('scroll', handler, { passive: true });
  handler(); // run once immediately
}

// ─── Hamburger / mobile menu ──────────────────────────────────
function initHamburger() {
  document.addEventListener('click', (e) => {
    const hamburger   = document.getElementById('hamburger');
    const mobileMenu  = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    if (hamburger.contains(e.target)) {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    } else if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target)) {
      // Close on outside click
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    }
  });

  // Close on nav link click (mobile)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('mobile-nav-link') || e.target.classList.contains('mobile-social-link')) {
      const hamburger  = document.getElementById('hamburger');
      const mobileMenu = document.getElementById('mobile-menu');
      if (!hamburger || !mobileMenu) return;
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const hamburger  = document.getElementById('hamburger');
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
        hamburger.focus();
      }
    }
  });
}

// ─── Projects dropdown keyboard support ──────────────────────
function initDropdown() {
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.nav-dropdown-toggle');
    if (toggle) {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
    } else {
      // Close all dropdowns on outside click
      document.querySelectorAll('.nav-dropdown-toggle[aria-expanded="true"]').forEach(t => {
        t.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

// ─── Active nav link ──────────────────────────────────────────
function initActiveLink() {
  const currentPath = window.location.pathname;

  document.querySelectorAll('#site-nav .nav-link, #site-nav .nav-dropdown-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Normalize by extracting just the filename
    const linkFile = href.split('/').pop();
    const currentFile = currentPath.split('/').pop() || 'index.html';

    if (linkFile && currentFile && linkFile === currentFile) {
      link.classList.add('active');
    }

    // Special case: root or empty path → index.html
    if ((currentFile === '' || currentFile === 'index.html') && linkFile === 'index.html') {
      link.classList.add('active');
    }
  });
}

// ─── Scroll-reveal animations ─────────────────────────────────
function initScrollAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // Observe existing elements
    const observeAll = () => {
      document.querySelectorAll('[data-animate]:not(.visible)').forEach(el => {
        observer.observe(el);
      });
    };

    observeAll();

    // also watch for dynamically injected elements (like projects)
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// ─── Typewriter hero ──────────────────────────────────────────
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    el.textContent = 'Electrical & Computer Engineer';
    return;
  }

  const roles = [
    'Electrical & Computer Engineer',
    'Systems Software Developer',
    'ML / AI Practitioner',
    'Embedded Systems Engineer',
    'Open Source Contributor',
  ];

  let roleIdx  = 0;
  let charIdx  = 0;
  let isDeleting = false;
  let timer    = null;

  function tick() {
    const current = roles[roleIdx];

    if (!isDeleting) {
      charIdx++;
      el.textContent = current.substring(0, charIdx);

      if (charIdx === current.length) {
        isDeleting = true;
        timer = setTimeout(tick, 2200);
        return;
      }
    } else {
      charIdx--;
      el.textContent = current.substring(0, charIdx);

      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }

    const speed = isDeleting ? 42 : 82;
    timer = setTimeout(tick, speed);
  }

  tick();
}

// ─── Card 3D tilt ─────────────────────────────────────────────
function initCardTilt() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateZ(6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ─── Smooth scroll for anchor links ──────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ─── Copy email button ────────────────────────────────────────
function initCopyEmail() {
  document.querySelectorAll('[data-copy-email]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = 'iyan.n@outlook.com';
      try {
        await navigator.clipboard.writeText(email);
        const prev = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = prev;
          btn.classList.remove('copied');
        }, 2200);
      } catch {
        // Fallback for non-secure contexts
        btn.textContent = email;
        setTimeout(() => { btn.textContent = 'Copy'; }, 3000);
      }
    });
  });
}

// ─── Skill chip stagger ───────────────────────────────────────
function initSkillChips() {
  document.querySelectorAll('.skill-chip').forEach((chip, i) => {
    chip.style.animationDelay = `${i * 40}ms`;
  });
}

// ─── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const base = getBasePath();

  injectNav(base);
  injectFooter();

  // Must run after nav is injected
  initScrolledNav();
  initHamburger();
  initDropdown();
  initActiveLink();
  initScrollAnimations();
  initSmoothScroll();
  initCopyEmail();
  initSkillChips();

  // Page-specific
  if (document.getElementById('typed-text'))       initTyped();
  if (document.querySelector('.project-card'))      initCardTilt();
});
