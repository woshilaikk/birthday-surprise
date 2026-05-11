const cover = document.querySelector("#cover");
const page = document.querySelector("#page");
const openGift = document.querySelector("#openGift");
const countdown = document.querySelector("#countdown");
const heroTitle = document.querySelector("#heroTitle");
const daysTogether = document.querySelector("#daysTogether");
const hoursTogether = document.querySelector("#hoursTogether");
const minutesTogether = document.querySelector("#minutesTogether");
const secondsTogether = document.querySelector("#secondsTogether");
const typedText = document.querySelector("#typedText");
const finalButton = document.querySelector("#finalButton");
const finalMessage = document.querySelector("#finalMessage");
const petalLayer = document.querySelector(".petal-layer");
const musicButton = document.querySelector(".music-button");
const musicText = document.querySelector(".music-text");
const noteDialog = document.querySelector("#noteDialog");
const noteText = document.querySelector("#noteText");
const closeNote = document.querySelector("#closeNote");
const fireworksCanvas = document.querySelector(".fireworks");
const fireworksCtx = fireworksCanvas.getContext("2d");
const tunnelCanvas = document.querySelector(".heart-tunnel");
const tunnelCtx = tunnelCanvas.getContext("2d");

let audioContext;
let musicTimer;
let isMusicPlaying = false;
let particles = [];
let tunnelTime = 0;
let loveTimerId;
const loveStart = new Date(2025, 0, 9, 0, 0, 0).getTime();
const romanticSong = new Audio("assets/music/faded.mp3");
romanticSong.loop = true;
romanticSong.preload = "auto";

const spiralParticles = Array.from({ length: 1200 }, (_, index) => {
  const t = (index / 1200) * (Math.PI * 2) * 10;
  return {
    angle: t,
    ring: 24 + (index % 120) * 2.6 + Math.random() * 6,
    depth: Math.random(),
    speed: 0.0024 + Math.random() * 0.0028,
    size: 1.1 + Math.random() * 2.8,
    drift: (Math.random() - 0.5) * 0.34,
    tint: ["#ff8fb3", "#ff6fa2", "#ffc4d8", "#f15b97"][index % 4]
  };
});

const fallingParticles = Array.from({ length: 360 }, () => ({
  x: Math.random(),
  y: Math.random(),
  z: 0.2 + Math.random() * 0.8,
  speed: 0.0006 + Math.random() * 0.0014,
  sway: Math.random() * Math.PI * 2,
  size: 0.8 + Math.random() * 2.4
}));

const letter = `亲爱的宝贝：

生日快乐。

你出现以后，很多普通的日子都变得值得收藏。我喜欢你笑起来的样子，也喜欢和你一起做一些很小很小的事。

新的一岁，愿你永远有被爱包围的底气，有追逐热爱的勇气，也有随时放松撒娇的自由。

而我，会继续认真地喜欢你，陪你吃很多顿饭，走很多段路，看很多次日落，过很多很多个生日。`;

function openSurprise() {
  cover.classList.add("opened");
  page.classList.add("visible");
  page.setAttribute("aria-hidden", "false");
  launchPetals(36);
  runCountdown();
  startLoveTimer();
  setTimeout(() => document.querySelector(".hero").scrollIntoView({ behavior: "smooth" }), 500);
}

function runCountdown() {
  let value = 3;
  countdown.textContent = value;
  const timer = setInterval(() => {
    value -= 1;
    if (value > 0) {
      countdown.textContent = value;
      return;
    }
    clearInterval(timer);
    countdown.textContent = "盛开";
    heroTitle.textContent = "和宝宝在一起的时间";
    typeLetter();
  }, 900);
}

function updateLoveTimer() {
  const elapsed = Math.max(0, Math.floor((Date.now() - loveStart) / 1000));
  const days = Math.floor(elapsed / 86400);
  const hours = Math.floor((elapsed % 86400) / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  daysTogether.textContent = days;
  hoursTogether.textContent = hours;
  minutesTogether.textContent = minutes;
  secondsTogether.textContent = seconds;
}

function startLoveTimer() {
  updateLoveTimer();
  if (!loveTimerId) {
    loveTimerId = setInterval(updateLoveTimer, 1000);
  }
}

function typeLetter() {
  if (typedText.dataset.done) return;
  typedText.dataset.done = "true";
  let index = 0;
  const timer = setInterval(() => {
    typedText.textContent = letter.slice(0, index);
    index += 1;
    if (index > letter.length) clearInterval(timer);
  }, 52);
}

function launchPetals(amount) {
  for (let i = 0; i < amount; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${6 + Math.random() * 5}s`;
    petal.style.animationDelay = `${Math.random() * 2}s`;
    petal.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
    petalLayer.appendChild(petal);
    setTimeout(() => petal.remove(), 12000);
  }
}

function resizeCanvas(canvas, context) {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function resizeAllCanvases() {
  resizeCanvas(fireworksCanvas, fireworksCtx);
  resizeCanvas(tunnelCanvas, tunnelCtx);
}

function drawHeart(context, x, y, size, rotation, color, alpha) {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.scale(size / 32, size / 32);
  context.globalAlpha = alpha;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(0, 10);
  context.bezierCurveTo(-28, -12, -14, -34, 0, -18);
  context.bezierCurveTo(14, -34, 28, -12, 0, 10);
  context.fill();
  context.restore();
}

function animateHeartTunnel() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const centerX = width / 2;
  const centerY = height * 0.42;

  tunnelCtx.clearRect(0, 0, width, height);
  tunnelTime += 1;

  const pulse = 1 + Math.sin(tunnelTime * 0.03) * 0.06;

  for (let ring = 0; ring < 7; ring += 1) {
    const progress = ((tunnelTime * 0.0045 + ring / 7) % 1);
    const radiusX = progress * width * 0.42 + 20;
    const radiusY = progress * height * 0.28 + 16;
    tunnelCtx.globalAlpha = (1 - progress) * 0.2;
    tunnelCtx.strokeStyle = ring % 2 ? "#ff8fb3" : "#ff6fa2";
    tunnelCtx.lineWidth = 0.9;
    tunnelCtx.beginPath();
    tunnelCtx.ellipse(centerX, centerY, radiusX * pulse, radiusY * pulse, tunnelTime * 0.0016, 0, Math.PI * 2);
    tunnelCtx.stroke();
  }

  spiralParticles.forEach((p) => {
    p.depth += p.speed;
    if (p.depth > 1) {
      p.depth = 0;
      p.angle += Math.PI * 2 * Math.random();
    }

    const eased = p.depth * p.depth;
    const spin = p.angle + tunnelTime * (0.012 + p.drift);
    const swirlX = Math.cos(spin) * (p.ring + eased * width * 0.28);
    const swirlY = Math.sin(spin * 1.06) * (p.ring * 0.62 + eased * height * 0.24);
    const x = centerX + swirlX;
    const y = centerY + swirlY;
    const size = p.size + eased * 5.4;
    const alpha = Math.max(0.06, 1 - eased * 0.64);
    drawHeart(tunnelCtx, x, y, size, spin * 0.62, p.tint, alpha);
  });

  fallingParticles.forEach((p) => {
    p.y += p.speed * (1.2 + p.z);
    p.x += Math.sin(tunnelTime * 0.01 + p.sway) * 0.0004;
    if (p.y > 1.04) {
      p.y = -0.04;
      p.x = Math.random();
    }
    const x = p.x * width;
    const y = p.y * height;
    const alpha = 0.18 + p.z * 0.42;
    tunnelCtx.globalAlpha = alpha;
    tunnelCtx.fillStyle = "#ffc4d8";
    tunnelCtx.beginPath();
    tunnelCtx.arc(x, y, p.size * p.z, 0, Math.PI * 2);
    tunnelCtx.fill();
  });

  tunnelCtx.globalAlpha = 0.72;
  const halo = tunnelCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height) * 0.18);
  halo.addColorStop(0, "rgba(255, 220, 235, 0.85)");
  halo.addColorStop(0.26, "rgba(255, 120, 175, 0.44)");
  halo.addColorStop(0.72, "rgba(255, 92, 160, 0.08)");
  halo.addColorStop(1, "rgba(255, 92, 160, 0)");
  tunnelCtx.fillStyle = halo;
  tunnelCtx.beginPath();
  tunnelCtx.arc(centerX, centerY, Math.min(width, height) * 0.2, 0, Math.PI * 2);
  tunnelCtx.fill();

  tunnelCtx.globalAlpha = 1;
  drawHeart(tunnelCtx, centerX, centerY + 4, 36 + pulse * 8, Math.sin(tunnelTime * 0.03) * 0.25, "#ffd7e8", 0.85);

  tunnelCtx.globalAlpha = 1;
  requestAnimationFrame(animateHeartTunnel);
}

function createFirework(x, y) {
  const colors = ["#ff8fb3", "#f6c76b", "#bca8ff", "#7bd8c4", "#fffaf5"];
  for (let i = 0; i < 54; i += 1) {
    const angle = (Math.PI * 2 * i) / 54;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 70,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function animateFireworks() {
  fireworksCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((particle) => particle.life > 0);
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.035;
    particle.life -= 1;
    fireworksCtx.globalAlpha = particle.life / 70;
    fireworksCtx.fillStyle = particle.color;
    fireworksCtx.beginPath();
    fireworksCtx.arc(particle.x, particle.y, 2.4, 0, Math.PI * 2);
    fireworksCtx.fill();
  });
  fireworksCtx.globalAlpha = 1;
  requestAnimationFrame(animateFireworks);
}

function playSoftMusic() {
  romanticSong.currentTime = romanticSong.currentTime || 0;
  romanticSong.play().catch(() => {
    playGeneratedMelody();
  });
}

function playGeneratedMelody() {
  if (musicTimer) return;
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) {
    musicText.textContent = "音乐不可用";
    isMusicPlaying = false;
    return;
  }
  audioContext = audioContext || new AudioEngine();
  const notes = [261.63, 329.63, 392, 523.25, 392, 329.63];
  let step = 0;

  musicTimer = setInterval(() => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = notes[step % notes.length];
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.09, audioContext.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.72);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.76);
    step += 1;
  }, 780);
}

function stopSoftMusic() {
  romanticSong.pause();
  clearInterval(musicTimer);
  musicTimer = null;
}

openGift.addEventListener("click", openSurprise);

musicButton.addEventListener("click", () => {
  isMusicPlaying = !isMusicPlaying;
  if (isMusicPlaying) {
    playSoftMusic();
    musicText.textContent = "暂停音乐";
  } else {
    stopSoftMusic();
    musicText.textContent = "播放音乐";
  }
});

document.querySelectorAll(".photo-card").forEach((card) => {
  card.addEventListener("click", () => {
    noteText.textContent = card.dataset.note;
    noteDialog.showModal();
  });
});

closeNote.addEventListener("click", () => noteDialog.close());

finalButton.addEventListener("click", () => {
  finalMessage.classList.add("show");
  launchPetals(44);
  createFirework(window.innerWidth * 0.28, window.innerHeight * 0.32);
  createFirework(window.innerWidth * 0.62, window.innerHeight * 0.25);
  createFirework(window.innerWidth * 0.48, window.innerHeight * 0.44);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
window.addEventListener("resize", resizeAllCanvases);

resizeAllCanvases();
startLoveTimer();
animateHeartTunnel();
animateFireworks();
