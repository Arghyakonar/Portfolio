/* ===== CURSOR GLOW ===== */
const cursorGlow = document.getElementById('cursor-glow');
const colors = [
  'rgba(255,45,120,0.08)',
  'rgba(0,229,255,0.08)',
  'rgba(184,255,0,0.07)',
  'rgba(191,95,255,0.08)'
];
let colorIdx = 0;
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let cx = mx, cy = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  const section = e.target.closest('section');
  if (section) {
    if (section.id === 'skills')      colorIdx = 1;
    else if (section.id === 'projects') colorIdx = 2;
    else if (section.id === 'contact')  colorIdx = 3;
    else colorIdx = 0;
  }
});

function animateCursor() {
  cx += (mx - cx) * 0.08;
  cy += (my - cy) * 0.08;
  if (cursorGlow) {
    cursorGlow.style.left = cx + 'px';
    cursorGlow.style.top  = cy + 'px';
    cursorGlow.style.background = `radial-gradient(circle, ${colors[colorIdx]} 0%, transparent 70%)`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ===== PARTICLE CANVAS ===== */
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H;
  const PARTICLE_COUNT = 55;
  let particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  const PAL = ['#ff2d78','#00e5ff','#b8ff00','#bf5fff','#ff9500'];

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      color: PAL[Math.floor(Math.random() * PAL.length)],
      alpha: Math.random() * 0.5 + 0.15,
    }));
  }
  initParticles();

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = (1 - dist / 110) * 0.12;
          ctx.lineWidth = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

/* ===== TYPED EFFECT ===== */
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Linux Technical Associate',
  'Full Stack Developer',
  'DevOps Enthusiast',
  'Server Infrastructure Pro',
  'AI Tools Builder'
];
let pIdx = 0, cIdx = 0, deleting = false;

function typeEffect() {
  if (!typedEl) return;
  const phrase = phrases[pIdx];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, cIdx + 1);
    cIdx++;
    if (cIdx === phrase.length) { deleting = true; setTimeout(typeEffect, 1800); return; }
    setTimeout(typeEffect, 60);
  } else {
    typedEl.textContent = phrase.slice(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(typeEffect, 400); return; }
    setTimeout(typeEffect, 35);
  }
}
typeEffect();

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ===== ACTIVE NAV HIGHLIGHT ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObserver.observe(s));

/* ===== SKILL CARD TILT ===== */
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    card.style.transition = 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.35s ease, border-color 0.25s';
  });
});

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1400;
  const startTime = performance.now();
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(eased * target * 10) / 10;
    el.textContent = (Number.isInteger(val) ? val : val.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statEls = document.querySelectorAll('.stat-val');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const val    = parseFloat(e.target.dataset.val);
      const suffix = e.target.dataset.suffix || '';
      animateCounter(e.target, val, suffix);
      statObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
statEls.forEach(el => statObserver.observe(el));

/* ===== NAV ACTIVE STYLE ===== */
const styleEl = document.createElement('style');
styleEl.textContent = `.nav-links a.active { color: #f2f0ff; } .nav-links a.active::after { width: 100%; }`;
document.head.appendChild(styleEl);
