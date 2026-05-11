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

const tunnelHearts = Array.from({ length: 58 }, (_, index) => ({
  angle: index * 0.68,
  orbit: 34 + (index % 9) * 19,
  depth: Math.random(),
  size: 10 + Math.random() * 20,
  speed: 0.0036 + Math.random() * 0.0042,
  spin: Math.random() * Math.PI,
  color: ["#ff8fb3", "#ef5d8f", "#f6c76b", "#bca8ff", "#fff7ef"][index % 5]
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
  const centerY = height * 0.48;

  tunnelCtx.clearRect(0, 0, width, height);
  tunnelTime += 1;

  for (let ring = 0; ring < 9; ring += 1) {
    const progress = ((tunnelTime * 0.006 + ring / 9) % 1);
    const radiusX = progress * width * 0.62 + 38;
    const radiusY = progress * height * 0.38 + 28;
    tunnelCtx.globalAlpha = (1 - progress) * 0.34;
    tunnelCtx.strokeStyle = ring % 2 ? "#ff8fb3" : "#f6c76b";
    tunnelCtx.lineWidth = 1.3;
    tunnelCtx.beginPath();
    tunnelCtx.ellipse(centerX, centerY, radiusX, radiusY, tunnelTime * 0.003, 0, Math.PI * 2);
    tunnelCtx.stroke();
  }

  tunnelHearts.forEach((heart) => {
    heart.depth += heart.speed;
    if (heart.depth > 1) {
      heart.depth = 0;
      heart.angle += 1.1;
    }

    const eased = heart.depth * heart.depth;
    const twist = tunnelTime * 0.018 + heart.angle;
    const x = centerX + Math.cos(twist) * (heart.orbit + eased * width * 0.42);
    const y = centerY + Math.sin(twist * 0.86) * (heart.orbit * 0.48 + eased * height * 0.28);
    const size = heart.size * (0.42 + eased * 2.9);
    const alpha = Math.max(0.08, 1 - eased * 0.72);
    drawHeart(tunnelCtx, x, y, size, heart.spin + tunnelTime * 0.012, heart.color, alpha);
  });

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
