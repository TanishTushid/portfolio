/* =====================================================
   TANISH — BRUTALIST PORTFOLIO JS
   Scroll animations · Nav · Mobile menu · Counters
   ===================================================== */

'use strict';

/* ── Helpers ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =====================================================
   NAVIGATION — active link on scroll, mobile toggle
   ===================================================== */
(function initNav() {
  const navbar    = $('#navbar');
  const toggle    = $('#nav-toggle');
  const navLinks  = $('#nav-links');
  const links     = $$('.nav-link');
  const sections  = $$('section[id], aside[id]');

  /* Scroll: add shadow + active link */
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 0 #0A0A0A';
    } else {
      navbar.style.boxShadow = 'none';
    }

    /* Active link highlighting */
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 80;
      if (window.scrollY >= top) current = sec.id;
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile toggle */
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);

      /* Animate hamburger → X */
      const spans = $$('span', toggle);
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    /* Close on link click */
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        $$('span', toggle).forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }
})();

/* =====================================================
   SCROLL FADE-IN — IntersectionObserver
   ===================================================== */
(function initScrollAnimations() {
  /* Register elements for fade-in */
  const fadeEls = [
    $$('.about-card'),
    $$('.bubble-category'),
    $$('.project-card'),
    $$('.cert-card'),
    $$('.exp-item'),
    $$('.contact-item'),
    $$('[id^="lc-"]'),
    [$('#about-terminal-panel')].filter(Boolean),
    [$('.contact-panel')].filter(Boolean),
    [$('#arcade-panel')].filter(Boolean),
  ].flat().filter(Boolean);

  /* Stagger delay per group */
  const staggerGroups = [
    { sel: '.about-card',      delay: 0.08 },
    { sel: '.bubble-category', delay: 0.07 },
    { sel: '.project-card',    delay: 0.1  },
    { sel: '.cert-card',       delay: 0.1  },
    { sel: '.exp-item',        delay: 0.12 },
    { sel: '.contact-item',    delay: 0.08 },
  ];

  staggerGroups.forEach(({ sel, delay }) => {
    $$(sel).forEach((el, i) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${i * delay}s`;
    });
  });

  /* Singletons */
  const singles = [
    '#about-terminal-panel',
    '#arcade-panel',
    '.hero-left',
    '.hero-right',
    '.contact-panel',
    '.exp-layout',
    '.certs-col',
  ];
  singles.forEach(sel => {
    const el = $(sel);
    if (el) el.classList.add('fade-in');
  });

  /* Observer */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.fade-in').forEach(el => io.observe(el));
})();

/* =====================================================
   HERO — TYPING ANIMATION
   ===================================================== */
(function initHeroTyping() {
  const titles = [
    'ML ENGINEER',
    'AI DEVELOPER',
    'DATA SCIENTIST',
    'DEEP LEARNER',
  ];
  const subtitle = $('.hero-subtitle');
  if (!subtitle) return;

  let ti = 0, ci = 0, deleting = false;

  const type = () => {
    const word = titles[ti];
    if (!deleting) {
      subtitle.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 90);
    } else {
      subtitle.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ti = (ti + 1) % titles.length;
        setTimeout(type, 350);
        return;
      }
      setTimeout(type, 55);
    }
  };
  setTimeout(type, 1000);
})();

/* =====================================================
   STAT COUNTERS — count up on scroll into view
   ===================================================== */
(function initCounters() {
  const counters = [
    { id: 'lc-total', target: 150, suffix: '+' },
    { id: 'lc-easy',  target: 80,  suffix: '' },
    { id: 'lc-medium',target: 55,  suffix: '' },
    { id: 'lc-hard',  target: 15,  suffix: '' },
  ];

  const animateCount = (el, target, suffix) => {
    const valEl = el.querySelector('.as-val');
    if (!valEl) return;
    let start = 0;
    const duration = 1200;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      valEl.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      const counter = counters.find(c => c.id === id);
      if (counter) animateCount(entry.target, counter.target, counter.suffix);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach(({ id }) => {
    const el = $(`#${id}`);
    if (el) io.observe(el);
  });
})();

/* =====================================================
   HOVER LIFT on brut-cards — extra shadow on mouse
   ===================================================== */
(function initCardTilt() {
  $$('.brut-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform, box-shadow';
    });
    card.addEventListener('mouseleave', () => {
      card.style.willChange = '';
    });
  });
})();

/* =====================================================
   SMOOTH SCROLL — internal anchor links
   ===================================================== */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY;
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      window.scrollTo({ top: top - navH, behavior: 'smooth' });
    });
  });
})();

/* =====================================================
   PROJECT CARD — colour border on hover per category
   ===================================================== */
(function initProjectHover() {
  const colors = {
    'project-agent':    'var(--pink)',
    'project-pulse':    'var(--purple)',
    'project-trustlens':'var(--blue)',
    'project-tomato':   'var(--green)',
  };
  Object.entries(colors).forEach(([id, color]) => {
    const card = $(`#${id}`);
    if (!card) return;
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = color;
      card.style.boxShadow = `8px 8px 0 ${color}`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    });
  });
})();

/* =====================================================
   TOPIC CHIPS — click highlight
   ===================================================== */
(function initTopicChips() {
  $$('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.style.background = 'rgba(255,230,0,0.25)';
      chip.style.borderColor = 'var(--yellow)';
      setTimeout(() => {
        chip.style.background = '';
        chip.style.borderColor = '';
      }, 600);
    });
  });
})();

/* =====================================================
   TERMINAL — typewriter for about panel
   ===================================================== */
(function initTerminalTypewriter() {
  const body = $('#about-terminal-body');
  if (!body) return;

  const lines = body.querySelectorAll('.t-line');
  lines.forEach(l => { l.style.opacity = '0'; });

  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();

    let i = 0;
    const showNext = () => {
      if (i >= lines.length) return;
      lines[i].style.transition = 'opacity 0.3s ease';
      lines[i].style.opacity = '1';
      i++;
      setTimeout(showNext, 160);
    };
    setTimeout(showNext, 400);
  }, { threshold: 0.5 });

  const panel = $('#about-terminal-panel');
  if (panel) io.observe(panel);
})();

/* =====================================================
   CONTACT PANEL — button ripple
   ===================================================== */
(function initRipple() {
  $$('.btn, .project-btn, .arcade-link').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;width:8px;height:8px;
        background:rgba(255,255,255,0.4);
        border-radius:50%;
        transform:scale(0);
        animation:ripple-anim 0.5s ease forwards;
        pointer-events:none;
        left:${e.offsetX - 4}px;top:${e.offsetY - 4}px;
      `;
      if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  /* Add ripple keyframe once */
  if (!$('#ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = `@keyframes ripple-anim{to{transform:scale(24);opacity:0}}`;
    document.head.appendChild(s);
  }
})();
