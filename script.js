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


// ===== CAMPING UNDER THE STARS (scoped animation) =====
(function(){
  const canvas = document.getElementById('camp-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Fit canvas to CSS size (with DPR)
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  function fit(){
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width  = Math.max(1, Math.floor(width  * DPR));
    canvas.height = Math.max(1, Math.floor(height * DPR));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  new ResizeObserver(fit).observe(canvas);
  fit();

  // Palette (purple evening)
  const SKY = ['#3a2d68','#2a1f58','#1c143f'];   // top → bottom
  const GROUND_TOP = '#160e2a';
  const GROUND_BOT = '#0f0a1d';

  // Stars
  let stars = [];
  function seedStars(){
    const W = canvas.clientWidth, H = canvas.clientHeight;
    const count = Math.round(Math.min(260, (W*H)/4500));
    stars = Array.from({length: count}, () => ({
      x: Math.random()*W,
      y: Math.random()*H * 0.72,
      r: Math.random()*1.4 + 0.3,
      p: Math.random()*Math.PI*2,
      s: 0.5 + Math.random()*0.8
    }));
  }
  seedStars();
  window.addEventListener('resize', seedStars);

  // Shooting star
  let meteor = null;
  function spawnMeteor(){
    const W = canvas.clientWidth, H = canvas.clientHeight;
    const startX = Math.random()*W*0.6 + W*0.2;
    const startY = Math.random()*H*0.2 + H*0.05;
    const ang = (-Math.PI/3) + (Math.random()*Math.PI/7);
    meteor = { x:startX, y:startY, vx:Math.cos(ang)*9, vy:Math.sin(ang)*9, life:1 };
  }
  const reduceMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setInterval(() => { if (!meteor && Math.random() < 0.35 && !reduceMotion()) spawnMeteor(); }, 3800);

  // Campfire embers
  const embers = Array.from({length: 40}, () => ({}));
  function resetEmber(e, W, H){
    const fx = W*0.38, fy = H*0.68;
    e.x = fx + (Math.random()*18 - 9);
    e.y = fy - 2;
    e.r = Math.random()*1.8 + 0.7;
    e.vy = Math.random()*0.8 + 0.6;
    e.life = 0.9;
    e.seed = Math.random()*10;
  }

  // Noisy mountain ridge helper
  function ridge(W, H, yBase, amp, segs, color, tShift){
    ctx.beginPath();
    const step = W / segs;
    for (let i=0;i<=segs;i++){
      const x = i*step;
      const n = Math.sin((i*0.7 + tShift)*0.7)*amp + Math.sin((i*0.18 - tShift)*1.3)*amp*0.5;
      const y = yBase + n;
      (i===0) ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
  }

  // Draw parts
  function drawSky(W, H){
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, SKY[0]); g.addColorStop(.55, SKY[1]); g.addColorStop(1, SKY[2]);
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

    // faint nebula
    const neb = ctx.createRadialGradient(W*0.72, H*0.24, 0, W*0.72, H*0.24, Math.max(W,H)*0.55);
    neb.addColorStop(0, 'rgba(210,175,255,0.12)');
    neb.addColorStop(1, 'rgba(210,175,255,0)');
    ctx.fillStyle = neb; ctx.fillRect(0,0,W,H);
  }

  function drawStars(t, W, H){
    for (const s of stars){
      s.p += s.s * 0.02;
      const a = 0.45 + 0.45*Math.sin(s.p + t*0.6);
      ctx.globalAlpha = a; ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (meteor){
      ctx.strokeStyle = 'rgba(255,220,255,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      ctx.lineTo(meteor.x - meteor.vx*6, meteor.y - meteor.vy*6);
      ctx.stroke();
      meteor.x += meteor.vx; meteor.y += meteor.vy; meteor.life *= 0.97;
      if (meteor.life < 0.05 || meteor.x < -60 || meteor.y > H+60) meteor = null;
    }
  }

  function drawGround(W, H){
    const g = ctx.createLinearGradient(0, H*0.65, 0, H);
    g.addColorStop(0, GROUND_TOP); g.addColorStop(1, GROUND_BOT);
    ctx.fillStyle = g; ctx.fillRect(0, H*0.65, W, H*0.35);
  }

// ----- helpers -----
function roundedRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w * 0.5, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function softGlow(ctx, x, y, r, rgba) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba.replace('ALPHA', '0.35'));
  g.addColorStop(1, rgba.replace('ALPHA', '0'));
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}

// ----- detailed pieces -----
function drawVan(ctx, W, H, baseY, t) {
  const x = W * 0.17, w = Math.min(260, W * 0.26), h = w * 0.46;
  const y = baseY - h - 6;

  // body
  ctx.save();
  ctx.fillStyle = '#12101a';
  roundedRect(ctx, x, y, w, h, 12); ctx.fill();

  // belt line
  ctx.fillStyle = '#0d0b14';
  roundedRect(ctx, x, y + h * 0.55, w, h * 0.45, 12); ctx.fill();

  // side window glow
  const winX = x + w * 0.42, winY = y + h * 0.18, winW = w * 0.42, winH = h * 0.35;
  const g = ctx.createLinearGradient(winX, winY, winX, winY + winH);
  g.addColorStop(0, 'rgba(255,235,200,0.18)');
  g.addColorStop(1, 'rgba(255,235,200,0.05)');
  ctx.fillStyle = g; roundedRect(ctx, winX, winY, winW, winH, 8); ctx.fill();

  // small cabin window
  const w2 = w * 0.18, h2 = h * 0.26;
  const g2 = ctx.createLinearGradient(x + w * 0.08, y + h * 0.24, x + w * 0.08, y + h * 0.24 + h2);
  g2.addColorStop(0, 'rgba(255,235,200,0.22)');
  g2.addColorStop(1, 'rgba(255,235,200,0.06)');
  ctx.fillStyle = g2; roundedRect(ctx, x + w * 0.08, y + h * 0.24, w2, h2, 6); ctx.fill();

  // roof rack
  ctx.strokeStyle = '#0b0a12'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x + 10, y - 8); ctx.lineTo(x + w - 10, y - 8); ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x + w * 0.33, y - 14); ctx.lineTo(x + w * 0.67, y - 14); ctx.stroke();

  // wheels
  const wy = y + h - 4, r1 = h * 0.18, r2 = h * 0.18;
  ctx.fillStyle = '#07060c';
  ctx.beginPath(); ctx.arc(x + w * 0.23, wy, r1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + w * 0.78, wy, r2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#171422';
  ctx.beginPath(); ctx.arc(x + w * 0.23, wy, r1 * 0.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + w * 0.78, wy, r2 * 0.4, 0, Math.PI * 2); ctx.fill();

  // faint interior glow (breathing)
  const breathe = 0.5 + 0.5 * Math.sin(t * 1.4);
  softGlow(ctx, x + w * 0.35, y + h * 0.35, w * 0.7, `rgba(255,225,170,ALPHA)`);
  ctx.globalAlpha = 0.15 * breathe;
  softGlow(ctx, x + w * 0.35, y + h * 0.35, w * 0.9, `rgba(255,225,170,ALPHA)`);
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawTent(ctx, W, H, baseY) {
  const tx = W * 0.63, tw = Math.min(260, W * 0.26), th = tw * 0.62, ty = baseY - 2;

  // body (two planes)
  const fabric1 = ctx.createLinearGradient(tx - tw / 2, ty - th, tx - tw / 2, ty);
  fabric1.addColorStop(0, '#8d6a2b'); fabric1.addColorStop(1, '#5b3f17');
  ctx.fillStyle = fabric1;
  ctx.beginPath(); ctx.moveTo(tx, ty - th); ctx.lineTo(tx - tw / 2, ty); ctx.lineTo(tx, ty); ctx.closePath(); ctx.fill();

  const fabric2 = ctx.createLinearGradient(tx, ty - th, tx, ty);
  fabric2.addColorStop(0, '#a97a31'); fabric2.addColorStop(1, '#6c4a1b');
  ctx.fillStyle = fabric2;
  ctx.beginPath(); ctx.moveTo(tx, ty - th); ctx.lineTo(tx, ty); ctx.lineTo(tx + tw / 2, ty); ctx.closePath(); ctx.fill();

  // center seam + door flap
  ctx.strokeStyle = 'rgba(30,20,10,0.55)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(tx, ty - th + 6); ctx.lineTo(tx, ty - 6); ctx.stroke();

  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.moveTo(tx, ty - th + th * 0.35);
  ctx.lineTo(tx + tw * 0.18, ty - th * 0.12);
  ctx.lineTo(tx, ty - th * 0.12);
  ctx.closePath(); ctx.fill();

  // guy lines + stakes
  ctx.strokeStyle = 'rgba(40,28,14,0.65)'; ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(tx - tw * 0.42, ty - th * 0.15); ctx.lineTo(tx - tw * 0.55, ty + 10);
  ctx.moveTo(tx + tw * 0.42, ty - th * 0.15); ctx.lineTo(tx + tw * 0.55, ty + 10);
  ctx.stroke();
  ctx.fillStyle = '#2b1c0b';
  ctx.fillRect(tx - tw * 0.56, ty + 8, 6, 4);
  ctx.fillRect(tx + tw * 0.50, ty + 8, 6, 4);

  // interior warm glow
  softGlow(ctx, tx - tw * 0.08, ty - th * 0.22, tw * 0.8, 'rgba(255,225,160,ALPHA)');
}

function drawFire(ctx, t, W, H, baseY, embers) {
  const x = W * 0.38, y = H * 0.68;

  // crossed logs
  ctx.strokeStyle = '#3b2912'; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 42, y + 16); ctx.lineTo(x + 40, y + 8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 10, y + 12); ctx.lineTo(x + 56, y + 20); ctx.stroke();

  // flames
  const flick = Math.sin(t * 8) * 0.5 + Math.sin(t * 2.1) * 0.3;
  const h = 48 + flick * 10, w = 28 + flick * 4;
  function flame(color, a, s) {
    ctx.globalAlpha = a; ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - h * s);
    ctx.bezierCurveTo(x - w * s, y - h * 0.55 * s, x - w * 0.6 * s, y, x, y);
    ctx.bezierCurveTo(x + w * 0.6 * s, y, x + w * s, y - h * 0.55 * s, x, y - h * s);
    ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
  }
  flame('#ffefb8', 0.90, 0.60);
  flame('#ffd07a', 0.85, 0.92);
  flame('#ff984f', 0.75, 1.18);
  flame('#ff6a3b', 0.60, 1.36);

  // embers
  if (!embers.initialized) {
    embers.list = Array.from({ length: 50 }, () => ({}));
    embers.initialized = true;
  }
  embers.list.forEach((e) => {
    if (!e.life) {
      e.x = x + (Math.random() * 18 - 9);
      e.y = y - 2;
      e.r = Math.random() * 1.8 + 0.7;
      e.vy = Math.random() * 0.8 + 0.6;
      e.life = 0.9;
      e.seed = Math.random() * 10;
    }
    e.y -= e.vy;
    e.x += Math.sin(t * 5 + e.seed) * 0.25;
    e.life *= 0.985;
    ctx.globalAlpha = e.life;
    ctx.fillStyle = '#ffd07a';
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
    if (e.life < 0.02) e.life = 0;
  });
  ctx.globalAlpha = 1;

  // cozy glow
  softGlow(ctx, x, y, 180, 'rgba(255,170,100,ALPHA)');
}

function drawCouple(ctx, W, H, baseY) {
  const youX = W * 0.46, herX = W * 0.49, y = baseY;

  // blanket
  ctx.fillStyle = 'rgba(20,15,35,0.8)';
  ctx.beginPath(); ctx.moveTo(youX - 70, y + 16); ctx.quadraticCurveTo(youX, y + 32, herX + 80, y + 18);
  ctx.lineTo(herX + 70, y + 28); ctx.quadraticCurveTo(youX, y + 44, youX - 80, y + 30); ctx.closePath();
  ctx.fill();

  // bodies (silhouette)
  ctx.fillStyle = '#09060f';
  // you
  ctx.beginPath(); ctx.ellipse(youX - 6, y + 4, 28, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(youX - 16, y - 26, 10, 0, Math.PI * 2); ctx.fill(); // head
  // her, leaning on your shoulder
  ctx.beginPath(); ctx.ellipse(herX + 6, y + 6, 30, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(herX, y - 26, 10, 0, Math.PI * 2); ctx.fill();
  // hair bun
  ctx.beginPath(); ctx.ellipse(herX + 6, y - 30, 9, 6, 0, 0, Math.PI * 2); ctx.fill();

  // hands joined
  ctx.strokeStyle = '#09060f'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(youX - 4, y - 6); ctx.lineTo(herX + 2, y - 6); ctx.stroke();
}

// ----- orchestrator (replaces drawTentVanFire) -----
function drawCampScene(t, W, H) {
  const baseY = H * 0.66;

  // ground shadow band where everyone sits
  const g = ctx.createLinearGradient(0, baseY - 30, 0, baseY + 60);
  g.addColorStop(0, 'rgba(10,7,18,0)');
  g.addColorStop(1, 'rgba(10,7,18,0.55)');
  ctx.fillStyle = g; ctx.fillRect(0, baseY - 30, W, 90);

  drawVan(ctx, W, H, baseY, t);
  drawTent(ctx, W, H, baseY);
  drawCouple(ctx, W, H, baseY);
  drawFire(ctx, t, W, H, baseY, drawCampScene._embers || (drawCampScene._embers = {}));
}


  function frame(ts){
    const t = ts/1000;
    const W = canvas.clientWidth, H = canvas.clientHeight;

    // Sky
    drawSky(W, H);

    // Stars
    drawStars(t, W, H);

    // Mountain ridges
    ridge(W, H, H*0.58, 18, 22, 'rgba(35,22,63,0.85)',  t*0.15);
    ridge(W, H, H*0.60, 24, 18, 'rgba(28,18,56,0.95)', -t*0.12);
    ridge(W, H, H*0.63, 30, 14, 'rgba(22,12,42,1)',     t*0.08);

    // Ground + scene elements
    drawGround(W, H);
    drawCampScene(t, W, H);

    // Fade in the title after a few seconds
    const title = document.querySelector('.camp-title');
    if (title && t > 6.5) title.classList.add('show');

    if (!reduceMotion()) requestAnimationFrame(frame);
    else title?.classList.add('show');
  }
  requestAnimationFrame(frame);
})();
