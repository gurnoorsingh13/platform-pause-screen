/* ═══════════════════════════════════════════════════════════
   GURNOORSINGH.IN — script.js
   Ambient canvas · Scroll reveals · Subtle interactions
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. AMBIENT PARTICLE CANVAS ─────────────────────── */
  (function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles, animFrame;

    /* Warm ivory accent colour — matches CSS --accent */
    const ACCENT_R = 200;
    const ACCENT_G = 191;
    const ACCENT_B = 168;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    /* Particle factory */
    function makeParticle() {
      return {
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     Math.random() * 1.4 + 0.3,
        vx:    (Math.random() - 0.5) * 0.18,
        vy:   -(Math.random() * 0.22 + 0.06),
        alpha: Math.random() * 0.4 + 0.05,
        life:  0,
        maxLife: Math.random() * 320 + 180,
      };
    }

    function buildParticles(count) {
      particles = [];
      for (let i = 0; i < count; i++) {
        const p = makeParticle();
        p.life = Math.random() * p.maxLife; /* stagger birth */
        particles.push(p);
      }
    }

    /* Two large soft orbs that drift slowly */
    const orbs = [
      { x: 0.28, y: 0.38, r: 0.42, hue: `${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}`, t: 0, speed: 0.00016 },
      { x: 0.72, y: 0.62, r: 0.35, hue: `160, 145, 190`,                          t: Math.PI, speed: 0.00012 },
    ];

    function drawOrbs(t) {
      orbs.forEach(o => {
        const cx = (o.x + Math.sin(t * o.speed + o.t) * 0.08) * W;
        const cy = (o.y + Math.cos(t * o.speed * 0.7 + o.t) * 0.06) * H;
        const rad = o.r * Math.min(W, H);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        grad.addColorStop(0,   `rgba(${o.hue}, 0.042)`);
        grad.addColorStop(0.55,`rgba(${o.hue}, 0.016)`);
        grad.addColorStop(1,   `rgba(${o.hue}, 0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    }

    let lastTime = 0;
    function draw(ts) {
      animFrame = requestAnimationFrame(draw);
      const dt = ts - lastTime;
      lastTime = ts;

      /* Clear with very slight trail for smoothness */
      ctx.clearRect(0, 0, W, H);

      /* Orbs */
      drawOrbs(ts);

      /* Particles */
      particles.forEach((p, i) => {
        p.life += 1;
        if (p.life > p.maxLife) {
          particles[i] = makeParticle();
          return;
        }

        /* Fade in / out */
        const progress = p.life / p.maxLife;
        const fade = progress < 0.15
          ? progress / 0.15
          : progress > 0.75
            ? (1 - progress) / 0.25
            : 1;

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, ${p.alpha * fade})`;
        ctx.fill();
      });
    }

    function init() {
      resize();
      const density = Math.min(W * H / 14000, 90); /* cap at 90 */
      buildParticles(Math.floor(density));
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
      resize();
      buildParticles(Math.min(Math.floor(W * H / 14000), 90));
    }, { passive: true });

    init();
  })();


  /* ── 2. SCROLL REVEAL — IntersectionObserver ─────────── */
  (function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px',
      }
    );

    elements.forEach(el => observer.observe(el));

    /* Reveal above-the-fold elements immediately */
    setTimeout(() => {
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.95) {
          el.classList.add('in-view');
        }
      });
    }, 60);
  })();


  /* ── 3. NAV — subtle background on scroll ────────────── */
  (function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 40;
          nav.style.background = scrolled
            ? 'rgba(10, 10, 11, 0.90)'
            : 'rgba(10, 10, 11, 0.72)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  })();


  /* ── 4. SMOOTH ANCHOR SCROLLING ─────────────────────── */
  (function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();

        const navH = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-h') || '64',
          10
        );

        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  })();


  /* ── 5. CURSOR GLOW — subtle warm trail ──────────────── */
  (function initCursorGlow() {
    /* Only on non-touch devices */
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const glow = document.createElement('div');
    glow.setAttribute('aria-hidden', 'true');
    Object.assign(glow.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '320px',
      height: '320px',
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(200,191,168,0.055) 0%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: '9999',
      transform: 'translate(-50%, -50%)',
      transition: 'transform 0.08s linear',
      willChange: 'transform',
    });
    document.body.appendChild(glow);

    let mx = -500, my = -500;
    let cx = -500, cy = -500;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    }, { passive: true });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animateGlow() {
      cx = lerp(cx, mx, 0.1);
      cy = lerp(cy, my, 0.1);
      glow.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  })();

})();
