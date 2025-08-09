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


(function() {
    const env = document.getElementById('envelope');
    if (!env) return;

    function toggleOpen() {
      const isOpen = env.classList.toggle('open');
      env.setAttribute('aria-expanded', String(isOpen));
    }

    env.addEventListener('click', toggleOpen);
    env.addEventListener('touchstart', function(e){
      // allow quick tap without triggering simulated mouse event twice
      e.preventDefault();
      toggleOpen();
    }, { passive: false });
  })();