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

  function drawTentVanFire(t, W, H){
    const baseY = H*0.66;
    const fireX = W*0.38, fireY = H*0.68;

    // VAN (simple silhouette with cabin glow)
    const vanX = W*0.18, vanY = baseY-18, vanW = Math.min(220, W*0.22), vanH = vanW*0.45;
    ctx.fillStyle = '#0c0817';
    ctx.fillRect(vanX, vanY-vanH, vanW, vanH);
    ctx.beginPath(); ctx.arc(vanX+vanW*0.82, vanY-vanH*0.15, vanH*0.22, 0, Math.PI*2); ctx.fill(); // wheel
    ctx.beginPath(); ctx.arc(vanX+vanW*0.18, vanY-vanH*0.15, vanH*0.22, 0, Math.PI*2); ctx.fill();
    // cabin glow
    const glow = ctx.createRadialGradient(vanX+vanW*0.35, vanY-vanH*0.55, 0, vanX+vanW*0.35, vanY-vanH*0.55, vanW*0.5);
    glow.addColorStop(0,'rgba(255,225,170,0.20)'); glow.addColorStop(1,'rgba(255,225,170,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(vanX+vanW*0.35, vanY-vanH*0.55, vanW*0.55, 0, Math.PI*2); ctx.fill();

    // TENT (triangular)
    const tentX = W*0.62, tentY = baseY-2;
    const tentW = Math.min(240, W*0.24), tentH = tentW*0.62;
    ctx.fillStyle = '#6b4a20';
    ctx.beginPath(); ctx.moveTo(tentX, tentY - tentH);
    ctx.lineTo(tentX - tentW/2, tentY);
    ctx.lineTo(tentX + tentW/2, tentY); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#523819';
    ctx.beginPath(); ctx.moveTo(tentX, tentY - tentH);
    ctx.lineTo(tentX, tentY); ctx.lineTo(tentX + tentW/2, tentY);
    ctx.closePath(); ctx.fill();

    // Interior warm glow
    const tentGlow = ctx.createRadialGradient(tentX - tentW*0.08, tentY - tentH*0.24, 4, tentX - tentW*0.08, tentY - tentH*0.24, tentW*0.7);
    tentGlow.addColorStop(0, 'rgba(255,225,160,0.35)');
    tentGlow.addColorStop(1, 'rgba(255,225,160,0)');
    ctx.fillStyle = tentGlow; ctx.beginPath();
    ctx.arc(tentX - tentW*0.08, tentY - tentH*0.24, tentW*0.74, 0, Math.PI*2); ctx.fill();

    // Campfire log
    ctx.strokeStyle = '#3a2a12'; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(fireX-48, fireY+14); ctx.lineTo(fireX+48, fireY+14); ctx.stroke();

    // Flames (animated)
    const flick = Math.sin(t*8)*0.5 + Math.sin(t*2.1)*0.3;
    const flameH = 46 + flick*10, flameW = 28 + flick*4;
    function flame(color, alpha, scale){
      ctx.globalAlpha = alpha; ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(fireX, fireY - flameH*scale);
      ctx.bezierCurveTo(fireX - flameW*scale, fireY - flameH*0.5*scale, fireX - flameW*0.6*scale, fireY, fireX, fireY);
      ctx.bezierCurveTo(fireX + flameW*0.6*scale, fireY, fireX + flameW*scale, fireY - flameH*0.5*scale, fireX, fireY - flameH*scale);
      ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    }
    flame('#ffefb2', 0.9, 0.6);
    flame('#ffd071', 0.85, 0.9);
    flame('#ff944f', 0.75, 1.15);
    flame('#ff6a39', 0.6, 1.35);

    // Embers
    if (!embers[0].x){
      embers.forEach(e => resetEmber(e, canvas.clientWidth, canvas.clientHeight));
    }
    embers.forEach(e=>{
      e.y -= e.vy;
      e.x += Math.sin(t*5 + e.seed)*0.25;
      e.life *= 0.985;
      if (e.life < 0.02 || e.y < baseY-120) resetEmber(e, canvas.clientWidth, canvas.clientHeight);
      ctx.globalAlpha = e.life; ctx.fillStyle = '#ffd071';
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Couple (silhouettes)
    const youX = W*0.46;
    ctx.fillStyle = '#0a0714';
    // you
    ctx.beginPath(); ctx.ellipse(youX, baseY, 26, 18, 0, 0, Math.PI*2); ctx.fill();            // seat / base
    ctx.beginPath(); ctx.arc(youX-8, baseY-28, 10, 0, Math.PI*2); ctx.fill();                 // head
    ctx.fillRect(youX-18, baseY+2, 36, 6);                                                    // plank shadow
    // her
    const herX = W*0.49;
    ctx.beginPath();
    ctx.moveTo(herX, baseY-6);
    ctx.quadraticCurveTo(herX+16, baseY-2, herX+18, baseY+16);
    ctx.lineTo(herX-18, baseY+16);
    ctx.quadraticCurveTo(herX-16, baseY-2, herX, baseY-6);
    ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(herX+10, baseY-30, 10, 0, Math.PI*2); ctx.fill();               // head
    ctx.beginPath(); ctx.ellipse(herX+14, baseY-26, 10, 6, 0, 0, Math.PI*2); ctx.fill();      // hair bun
    // Cozy light around the fire
    const cozy = ctx.createRadialGradient(fireX, fireY, 0, fireX, fireY, 170);
    cozy.addColorStop(0, 'rgba(255,170,100,0.18)');
    cozy.addColorStop(1, 'rgba(255,170,100,0)');
    ctx.fillStyle = cozy; ctx.beginPath(); ctx.arc(fireX, fireY, 170, 0, Math.PI*2); ctx.fill();
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
    drawTentVanFire(t, W, H);

    // Fade in the title after a few seconds
    const title = document.querySelector('.camp-title');
    if (title && t > 6.5) title.classList.add('show');

    if (!reduceMotion()) requestAnimationFrame(frame);
    else title?.classList.add('show');
  }
  requestAnimationFrame(frame);
})();
