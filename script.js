// script.js - starry background

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
  });
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updateStars() {
  stars.forEach(star => {
    star.x += star.vx;
    star.y += star.vy;

    if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
    if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
  });
}

function animate() {
  drawStars();
  updateStars();
  requestAnimationFrame(animate);
}

animate();

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        entry.target.classList.add("animate");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  const targets = document.querySelectorAll('.fade-in');
  targets.forEach(el => {
    // If already visible (e.g., on large screen), add class immediately
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('animate');
    } else {
      observer.observe(el);
    }
  });
});


window.addEventListener("load", () => {

  const heartCanvas = document.getElementById("hearts");
  if (heartCanvas) {
    const hctx = heartCanvas.getContext("2d");

    heartCanvas.width = window.innerWidth;
    heartCanvas.height = window.innerHeight;

    const hearts = [];

    for (let i = 0; i < 50; i++) {
      hearts.push({
        x: Math.random() * heartCanvas.width,
        y: Math.random() * heartCanvas.height,
        size: Math.random() * 20 + 10,
        speedY: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.5
      });
    }

    function drawHearts() {
      hctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
      hearts.forEach(h => {
        hctx.globalAlpha = h.opacity;
        drawHeart(hctx, h.x, h.y, h.size);
      });
    }

    function updateHearts() {
      hearts.forEach(h => {
        h.y -= h.speedY;
        if (h.y < -h.size) {
          h.y = heartCanvas.height + h.size;
          h.x = Math.random() * heartCanvas.width;
        }
      });
    }

    function animateHearts() {
      drawHearts();
      updateHearts();
      requestAnimationFrame(animateHearts);
    }

    function drawHeart(ctx, x, y, size) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x, y - size / 2, x - size, y - size / 2, x - size, y);
      ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.5, x, y + size * 2);
      ctx.bezierCurveTo(x, y + size * 1.5, x + size, y + size, x + size, y);
      ctx.bezierCurveTo(x + size, y - size / 2, x, y - size / 2, x, y);
      ctx.fillStyle = "#ff4d6d";
      ctx.fill();
    }

    animateHearts();
  }

    document.querySelectorAll('.fade-in').forEach(el => {
    el.classList.add('animate');
  });
});

// Envelope toggle (click / tap)
(function () {
  const env = document.getElementById('envelope');
  if (!env) return;
  function toggleOpen(){
    const isOpen = env.classList.toggle('open');
    env.setAttribute('aria-expanded', String(isOpen));
  }
  env.addEventListener('click', toggleOpen);
  env.addEventListener('touchstart', e => { e.preventDefault(); toggleOpen(); }, { passive:false });
})();

// Envelope toggle + alpine parallax
// Envelope interactions + Alpine parallax
(function () {
  const env = document.getElementById('envelope');
  const section = document.querySelector('.letter-section.alpine-photo');
  const bg = section ? section.querySelector('.bg') : null;

  let isOpen = false;

  function setOpen(v){
    isOpen = !!v;
    if (!env) return;
    env.classList.toggle('open', isOpen);
    env.setAttribute('aria-expanded', String(isOpen));
    if (section) section.classList.toggle('envelope-open', isOpen);
  }

  if (env) {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    if (isTouch) {
      // Mobile/tablet: tap to toggle, tap outside to close
      env.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!isOpen); });
      document.addEventListener('click', () => setOpen(false));
    } else {
      // Desktop: open on hover, close on mouseleave
      env.addEventListener('mouseenter', () => setOpen(true));
      env.addEventListener('mouseleave', () => setOpen(false));
      // Also allow click to toggle if someone clicks instead of hovering
      env.addEventListener('click', () => setOpen(!isOpen));
    }
  }

  // Subtle parallax for the alpine background
  function updateParallax() {
    if (!section || !bg) return;
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const progress = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height))); // 0..1
    const shift = (progress - 0.5) * 60; // -30px..+30px
    section.style.setProperty('--bg-y', `${shift}px`);
  }
  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', updateParallax);
})();

(function initTypingOnce(){
  if (window.__typingInit) return;    // guard: don't start twice
  window.__typingInit = true;

  const el = document.getElementById('typing-title');
  if (!el) return;

  const text = "A whispered vow beneath the endless sky, my heart’s devotion written in every star above…";
  const typeSpeed = 80;     // ms per char when typing
  const eraseSpeed = 50;    // ms per char when deleting
  const holdAfterType = 1200;  // pause at full text
  const holdAfterErase = 600;  // pause at empty
  let i = 0;
  let typing = true;

  function step(){
    if (typing) {
      // type forward
      el.textContent = text.slice(0, i + 1);
      i++;
      if (i >= text.length) {
        typing = false;
        setTimeout(step, holdAfterType);
      } else {
        setTimeout(step, typeSpeed);
      }
    } else {
      // erase backward
      el.textContent = text.slice(0, i - 1);
      i--;
      if (i <= 0) {
        typing = true;
        setTimeout(step, holdAfterErase);
      } else {
        setTimeout(step, eraseSpeed);
      }
    }
  }

  // start fresh
  el.textContent = "";
  i = 0;
  typing = true;
  step();
})();
