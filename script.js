const cover = document.querySelector("#cover");
const page = document.querySelector("#page");
const openGift = document.querySelector("#openGift");
const secretGate = document.querySelector(".secret-gate");
const secretAnswer = document.querySelector("#secretAnswer");
const secretHint = document.querySelector("#secretHint");
const countdown = document.querySelector("#countdown");
const heroTitle = document.querySelector("#heroTitle");
const daysTogether = document.querySelector("#daysTogether");
const hoursTogether = document.querySelector("#hoursTogether");
const minutesTogether = document.querySelector("#minutesTogether");
const secondsTogether = document.querySelector("#secondsTogether");
const lovePromise = document.querySelector("#lovePromise");
const typedText = document.querySelector("#typedText");
const finalButton = document.querySelector("#finalButton");
const finalMessage = document.querySelector("#finalMessage");
const wishText = document.querySelector("#wishText");
const wishStars = document.querySelector("#wishStars");
const birthdayCard = document.querySelector("#birthdayCard");
const heartTree = document.querySelector(".heart-tree");
const treeSecret = document.querySelector("#treeSecret");
const photoWall = document.querySelector("#photoWall");
const brightMemoryCard = document.querySelector("#brightMemoryCard");
const brightMemoryTrigger = document.querySelector("#brightMemoryTrigger");
const dailyMemoryCard = document.querySelector("#dailyMemoryCard");
const dailyMemoryTrigger = document.querySelector("#dailyMemoryTrigger");
const futureMemoryCard = document.querySelector("#futureMemoryCard");
const futureMemoryTrigger = document.querySelector("#futureMemoryTrigger");
const nextBirthdayDays = document.querySelector("#nextBirthdayDays");
const nextBirthdayHours = document.querySelector("#nextBirthdayHours");
const nextBirthdayMinutes = document.querySelector("#nextBirthdayMinutes");
const nextBirthdaySeconds = document.querySelector("#nextBirthdaySeconds");
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
let treeTapCount = 0;
let finalWishStep = 0;
let wishStarsShown = false;
let surpriseOpening = false;
let nextBirthdayTimerId;
const viewedPhotos = new Set();
const collectedWishes = new Set();
const loveStart = new Date(2025, 0, 9, 0, 0, 0).getTime();
const nextBirthday = new Date(2027, 4, 4, 0, 0, 0).getTime();
const romanticSong = new Audio("assets/music/faded.mp3");
romanticSong.loop = true;
romanticSong.preload = "auto";

function heartCurve(t) {
  return {
    x: 16 * Math.sin(t) ** 3,
    y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  };
}

const vortexPetals = Array.from({ length: 1800 }, (_, index) => {
  const t = (index / 1800) * Math.PI * 2;
  const point = heartCurve(t);
  const depth = Math.random();
  return {
    t,
    x: point.x,
    y: point.y,
    depth,
    offset: Math.random() * Math.PI * 2,
    lane: 0.72 + Math.random() * 0.5,
    size: 3 + Math.random() * 8,
    speed: 0.0014 + Math.random() * 0.0028,
    spin: Math.random() * Math.PI * 2,
    color: ["#ff4f86", "#ff74a5", "#ff9abd", "#ffd0dc", "#e94073"][index % 5]
  };
});

const starDust = Array.from({ length: 520 }, () => ({
  x: Math.random(),
  y: Math.random(),
  z: 0.3 + Math.random() * 1.2,
  size: 0.5 + Math.random() * 1.7,
  speed: 0.0008 + Math.random() * 0.0018,
  alpha: 0.12 + Math.random() * 0.42,
  spin: Math.random() * Math.PI * 2,
  color: ["#ff8fb3", "#ffc4d8", "#ff6f9f", "#ffdce6"][Math.floor(Math.random() * 4)]
}));

const codeLines = [
  "love",
  "love",
  "love",
  "love",
  "love",
  "love",
  "love",
  "love",
  "love",
  "love"
];

const wishMessages = [
  "愿你永远被偏爱，也永远有选择自己的勇气。",
  "愿新的一岁，所有温柔都刚好落在你身上。",
  "愿我能陪你把普通日子过成很多很多纪念日。",
  "愿你想要的快乐，都慢慢走到你身边。",
  "愿每一次看海、看花、看日落，我都在你旁边。"
];

const letter = `亲爱的宝贝：

生日快乐。

你出现以后，很多普通的日子都变得值得收藏。我喜欢你笑起来的样子，也喜欢和你一起做一些很小很小的事。

新的一岁，愿你永远有被爱包围的底气，有追逐热爱的勇气，也有随时放松撒娇的自由。

而我，会继续认真地喜欢你，陪你吃很多顿饭，走很多段路，看很多次日落，过很多很多个生日。`;

function openSurprise() {
  if (surpriseOpening) return;
  const answer = secretAnswer.value.trim().replace(/\s+/g, "");
  if (answer !== "早安宝宝") {
    secretHint.textContent = "暗号不对哦，再想想每天早上的第一句话。";
    secretHint.classList.add("shake");
    secretAnswer.focus();
    setTimeout(() => secretHint.classList.remove("shake"), 420);
    return;
  }
  surpriseOpening = true;
  secretHint.textContent = "早安宝宝，今天也要被爱包围。";
  secretGate.classList.add("unlocked");
  openGift.classList.add("opening");
  openGift.disabled = true;

  setTimeout(() => {
    cover.classList.add("opened");
    page.classList.add("visible");
    page.setAttribute("aria-hidden", "false");
    launchPetals(36);
    runCountdown();
    startLoveTimer();
    setTimeout(() => document.querySelector(".hero").scrollIntoView({ behavior: "smooth" }), 500);
  }, 950);
}

function runCountdown() {
  let value = 3;
  countdown.classList.remove("heart-bloom");
  countdown.textContent = value;
  const timer = setInterval(() => {
    value -= 1;
    if (value > 0) {
      countdown.textContent = value;
      return;
    }
    clearInterval(timer);
    showHeartBloom();
    heroTitle.textContent = "和宝宝在一起的时间";
    typeLetter();
  }, 900);
}

function showHeartBloom() {
  countdown.classList.add("heart-bloom");
  countdown.innerHTML = `
    <span class="bloom-heart bloom-center" style="--dx:0px; --dy:0px; --delay:0ms; --rot:0deg; --color:#fff5f8;">❤</span>
    <span class="bloom-heart bloom-top" style="--dx:0px; --dy:-20px; --delay:70ms; --rot:-8deg; --color:#ff6f9f;">❤</span>
    <span class="bloom-heart bloom-right" style="--dx:18px; --dy:-2px; --delay:120ms; --rot:12deg; --color:#ff8db7;">❤</span>
    <span class="bloom-heart bloom-bottom" style="--dx:2px; --dy:20px; --delay:170ms; --rot:4deg; --color:#ffd0df;">❤</span>
    <span class="bloom-heart bloom-left" style="--dx:-18px; --dy:-2px; --delay:140ms; --rot:-14deg; --color:#ff4f86;">❤</span>
    <span class="bloom-heart bloom-top-left" style="--dx:-14px; --dy:-16px; --delay:90ms; --rot:-20deg; --color:#ffb3c7;">❤</span>
    <span class="bloom-heart bloom-top-right" style="--dx:14px; --dy:-16px; --delay:90ms; --rot:16deg; --color:#ffb15e;">❤</span>
  `;
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
  lovePromise.textContent = `从 2025.01.09 开始，我已经喜欢你 ${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒啦。`;
}

function startLoveTimer() {
  updateLoveTimer();
  if (!loveTimerId) {
    loveTimerId = setInterval(updateLoveTimer, 1000);
  }
}

function updateNextBirthdayTimer() {
  const remaining = Math.max(0, Math.floor((nextBirthday - Date.now()) / 1000));
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  nextBirthdayDays.textContent = days;
  nextBirthdayHours.textContent = hours;
  nextBirthdayMinutes.textContent = minutes;
  nextBirthdaySeconds.textContent = seconds;
}

function startNextBirthdayTimer() {
  updateNextBirthdayTimer();
  if (!nextBirthdayTimerId) {
    nextBirthdayTimerId = setInterval(updateNextBirthdayTimer, 1000);
  }
}

function typeLetter() {
  if (typedText.dataset.done) return;
  typedText.dataset.done = "true";
  typedText.classList.add("typing");
  let index = 0;
  const timer = setInterval(() => {
    typedText.textContent = letter.slice(0, index);
    index += 1;
    if (index > letter.length) {
      clearInterval(timer);
      typedText.classList.remove("typing");
      document.querySelector(".letter-signature").classList.add("show");
    }
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

function launchHeartRain(amount) {
  const colors = ["#ff4f86", "#ff6fa3", "#ff9bc0", "#ffd0df", "#ff86b2"];

  for (let i = 0; i < amount; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart-rain-heart";
    heart.textContent = "❤";
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.setProperty("--size", `${10 + Math.random() * 18}px`);
    heart.style.setProperty("--duration", `${5.5 + Math.random() * 4.5}s`);
    heart.style.setProperty("--delay", `${Math.random() * 2.2}s`);
    heart.style.setProperty("--drift", `${-120 + Math.random() * 240}px`);
    heart.style.setProperty("--spin", `${-170 + Math.random() * 340}deg`);
    heart.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
    petalLayer.appendChild(heart);

    const lifetime = (5.5 + Math.random() * 4.5 + 2.6) * 1000;
    setTimeout(() => heart.remove(), lifetime);
  }
}

function showWishStars() {
  if (wishStarsShown) return;
  wishStarsShown = true;
  wishStars.innerHTML = "";

  wishMessages.forEach((message, index) => {
    const star = document.createElement("button");
    star.className = "wish-star";
    star.type = "button";
    star.textContent = "★";
    star.style.setProperty("--delay", `${index * 130}ms`);
    star.dataset.message = message;
    star.dataset.index = String(index);
    star.setAttribute("aria-label", message);
    star.addEventListener("click", () => {
      star.classList.add("collected");
      collectedWishes.add(index);
      wishText.textContent = message;
      launchHeartRain(12);
      if (collectedWishes.size === wishMessages.length) {
        birthdayCard.classList.remove("locked");
        birthdayCard.classList.add("unlocked");
        birthdayCard.innerHTML = `
          <span>Hidden Wish</span>
          <strong>宝宝你的愿望我听见啦</strong>
          <p>我也在心里祝你一臂之力。</p>
          <small>以后每一年，我都想认真祝你生日快乐</small>
        `;
        launchHeartRain(36);
      }
    });
    wishStars.appendChild(star);
  });
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
  const isPhone = width <= 520;
  const centerY = height * (isPhone ? 0.36 : 0.42);
  const unit = Math.min(width, height) * (isPhone ? 0.019 : 0.023);

  tunnelCtx.globalCompositeOperation = "source-over";
  tunnelCtx.fillStyle = "rgba(5, 6, 10, 0.34)";
  tunnelCtx.fillRect(0, 0, width, height);
  tunnelTime += 1;

  const pulse = 1 + Math.sin(tunnelTime * 0.025) * 0.035;

  tunnelCtx.save();
  tunnelCtx.globalAlpha = 0.13;
  tunnelCtx.fillStyle = "#cfd4dc";
  tunnelCtx.font = `${Math.max(10, Math.min(14, width * 0.014))}px Consolas, monospace`;
  for (let col = 0; col < Math.ceil(width / 170); col += 1) {
    codeLines.forEach((line, row) => {
      const x = col * 170 + 18;
      const y = ((row * 22 + tunnelTime * 0.18 + col * 37) % (height + 160)) - 80;
      tunnelCtx.fillText(line, x, y);
    });
  }
  tunnelCtx.restore();

  starDust.forEach((star) => {
    star.y += star.speed;
    star.spin += 0.01;
    if (star.y > 1.05) {
      star.y = -0.05;
      star.x = Math.random();
    }
    drawHeart(tunnelCtx, star.x * width, star.y * height, star.size * star.z * 2.2, star.spin, star.color, star.alpha);
  });

  tunnelCtx.save();
  tunnelCtx.globalCompositeOperation = "lighter";

  vortexPetals.forEach((petal) => {
    petal.depth += petal.speed;
    petal.spin += 0.011;
    if (petal.depth > 1) petal.depth = 0;

    const flowT = petal.t + tunnelTime * 0.0018 + petal.offset * 0.08;
    const flowed = heartCurve(flowT);
    const layer = (isPhone ? 0.76 : 0.86) + Math.sin(petal.depth * Math.PI) * (isPhone ? 0.12 : 0.16);
    const spread = petal.lane * layer * pulse;
    const naturalDriftX = Math.sin(tunnelTime * 0.01 + petal.offset) * (isPhone ? 2.4 : 3.6);
    const naturalDriftY = Math.cos(tunnelTime * 0.008 + petal.offset) * (isPhone ? 1.8 : 2.8);
    const x = centerX + flowed.x * unit * spread + naturalDriftX;
    const y = centerY + flowed.y * unit * spread * 0.82 + naturalDriftY;
    const alpha = (isPhone ? 0.18 : 0.22) + Math.sin(petal.depth * Math.PI) * (isPhone ? 0.42 : 0.48);
    const size = petal.size * ((isPhone ? 0.34 : 0.42) + Math.sin(petal.depth * Math.PI) * (isPhone ? 0.42 : 0.5));

    drawHeart(tunnelCtx, x, y, size, petal.spin, petal.color, alpha);
  });

  const halo = tunnelCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height) * (isPhone ? 0.135 : 0.18));
  halo.addColorStop(0, "rgba(255, 246, 250, 0.58)");
  halo.addColorStop(0.08, "rgba(255, 118, 169, 0.26)");
  halo.addColorStop(0.34, "rgba(255, 74, 132, 0.07)");
  halo.addColorStop(1, "rgba(255, 92, 160, 0)");
  tunnelCtx.fillStyle = halo;
  tunnelCtx.globalAlpha = isPhone ? 0.58 : 0.72;
  tunnelCtx.beginPath();
  tunnelCtx.arc(centerX, centerY, Math.min(width, height) * (isPhone ? 0.135 : 0.18), 0, Math.PI * 2);
  tunnelCtx.fill();

  tunnelCtx.restore();

  tunnelCtx.globalAlpha = 1;
  tunnelCtx.globalCompositeOperation = "source-over";
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
secretAnswer.addEventListener("keydown", (event) => {
  if (event.key === "Enter") openSurprise();
});

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

document.querySelectorAll(".photo-card").forEach((card, index) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".photo-card.flipped").forEach((openCard) => {
      if (openCard !== card) openCard.classList.remove("flipped");
    });
    card.classList.toggle("flipped");
    viewedPhotos.add(index);
    if (viewedPhotos.size === 5 && !photoWall.dataset.eggShown) {
      photoWall.dataset.eggShown = "true";
      noteText.textContent = "哈哈哈哈，宝宝我知道你会看完的，以后照片会越来越多的哦。";
      setTimeout(() => noteDialog.showModal(), 450);
    }
  });
});

closeNote.addEventListener("click", () => noteDialog.close());

function brightenMemories() {
  document.querySelector(".memories").classList.add("pink-memory");
  brightMemoryCard.classList.add("lit");
  launchHeartRain(18);
}

brightMemoryTrigger.addEventListener("click", brightenMemories);
brightMemoryTrigger.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    brightenMemories();
  }
});

function revealDailyMemory() {
  dailyMemoryCard.classList.toggle("photo-open");
  if (dailyMemoryCard.classList.contains("photo-open")) launchHeartRain(12);
}

dailyMemoryTrigger.addEventListener("click", revealDailyMemory);
dailyMemoryTrigger.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    revealDailyMemory();
  }
});

function revealFutureCountdown() {
  futureMemoryCard.classList.toggle("time-open");
  if (futureMemoryCard.classList.contains("time-open")) {
    startNextBirthdayTimer();
    launchHeartRain(12);
  }
}

futureMemoryTrigger.addEventListener("click", revealFutureCountdown);
futureMemoryTrigger.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    revealFutureCountdown();
  }
});

heartTree.addEventListener("click", () => {
  treeTapCount += 1;
  if (treeTapCount < 3) return;
  treeTapCount = 0;
  treeSecret.classList.add("show");
  launchHeartRain(22);
  setTimeout(() => treeSecret.classList.remove("show"), 4200);
});

finalButton.addEventListener("click", () => {
  if (finalWishStep === 0) {
    finalWishStep = 1;
    wishText.textContent = "闭上眼，在心里许愿。准备好了，就再点一次。";
    finalButton.textContent = "我许好愿了";
    launchHeartRain(18);
    return;
  }
  finalMessage.classList.add("show");
  finalButton.textContent = "愿望已点亮";
  finalButton.disabled = true;
  showWishStars();
  launchHeartRain(88);
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

// ===== REVERSE GAME - 5 LEVELS =====
var gameArena=document.querySelector("#gameArena");
var gamePlayer=document.querySelector("#gamePlayer");
var gameStartBtn=document.querySelector("#gameStart");
var gameLivesEl=document.querySelector("#gameLives");
var gameStatusEl=document.querySelector("#gameStatus");
var nextPageCard=document.querySelector("#nextPageCard");
var gameGoal=document.querySelector("#gameGoal");
var gameTimerEl=document.querySelector("#gameTimer");
var REVERSE_STORAGE_KEY="reverse-challenge-v3";

var REVERSE_LEVELS=[
  {name:"l1",obstacles:[{l:0,t:20,w:70,h:5},{l:30,t:40,w:70,h:5},{l:0,t:60,w:70,h:5},{l:30,t:78,w:52,h:5}],moving:[],timeLimit:0},
  {name:"l2",obstacles:[{l:0,t:24,w:64,h:6},{l:36,t:44,w:64,h:6},{l:0,t:64,w:64,h:6},{l:36,t:82,w:42,h:6}],moving:[{l:20,t:36,w:12,h:6,dir:1,speed:0.24,axis:"x",minL:20,maxL:54}],timeLimit:0},
  {name:"l3",obstacles:[{l:0,t:16,w:72,h:5},{l:28,t:34,w:72,h:5},{l:0,t:52,w:72,h:5},{l:28,t:70,w:72,h:5},{l:0,t:86,w:58,h:5}],moving:[{l:18,t:42,w:10,h:8,dir:1,speed:0.3,axis:"x",minL:18,maxL:58}],timeLimit:60},
  {name:"l4",obstacles:[{l:0,t:18,w:45,h:6},{l:55,t:38,w:45,h:6},{l:0,t:58,w:45,h:6},{l:55,t:78,w:45,h:6}],moving:[{l:18,t:28,w:12,h:6,dir:1,speed:0.24,axis:"x",minL:18,maxL:44},{l:56,t:68,w:12,h:6,dir:-1,speed:0.22,axis:"x",minL:52,maxL:76}],timeLimit:50},
  {name:"l5",obstacles:[{l:0,t:0,w:100,h:5},{l:0,t:95,w:100,h:5},{l:0,t:5,w:5,h:90},{l:95,t:5,w:5,h:90},{l:15,t:15,w:5,h:25},{l:30,t:15,w:40,h:5},{l:30,t:35,w:5,h:20},{l:45,t:50,w:5,h:25},{l:45,t:75,w:40,h:5},{l:60,t:25,w:5,h:15},{l:80,t:15,w:5,h:25},{l:15,t:60,w:15,h:5},{l:20,t:75,w:5,h:15},{l:70,t:65,w:25,h:5}],moving:[{l:5,t:10,w:8,h:8,dir:1,speed:0.2,axis:"y",minT:5,maxT:85},{l:85,t:30,w:8,h:8,dir:-1,speed:0.22,axis:"x",minL:60,maxL:87},{l:40,t:50,w:8,h:8,dir:1,speed:0.18,axis:"y",minT:40,maxT:70}],timeLimit:45}
];

var reverseGameState={lives:1,lastResetDay:todayKey(),cleared:[false,false,false,false,false],playerX:5,playerY:5,timeLeft:0};
var reverseActive=false;
var reverseTimerId=null;
var movingObsData=[];
var movingObsTimer=null;
var currentReverseLevel=0;

function getCurrentRevLevel(){return REVERSE_LEVELS[currentReverseLevel];}

function todayKey(){var d=new Date();return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();}

function readReverseState(){
  try{
    var saved=JSON.parse(localStorage.getItem(REVERSE_STORAGE_KEY));
    if(saved){
      reverseGameState.lives=Number.isFinite(saved.lives)?saved.lives:1;
      reverseGameState.lastResetDay=saved.lastResetDay||"";
      reverseGameState.cleared=saved.cleared||[false,false,false,false,false];
      reverseGameState.playerX=Number.isFinite(saved.playerX)?saved.playerX:5;
      reverseGameState.playerY=Number.isFinite(saved.playerY)?saved.playerY:5;
      currentReverseLevel=Number.isFinite(saved.currentLevel)?saved.currentLevel:0;
    }
  }catch(e){}
}

function saveReverseState(){
  localStorage.setItem(REVERSE_STORAGE_KEY,JSON.stringify({
    lives:reverseGameState.lives,
    lastResetDay:reverseGameState.lastResetDay,
    cleared:reverseGameState.cleared,
    playerX:reverseGameState.playerX,
    playerY:reverseGameState.playerY,
    currentLevel:currentReverseLevel
  }));
}

function applyDailyRefresh(){
  var today=todayKey();
  if(reverseGameState.lastResetDay!==today){
    reverseGameState.lastResetDay=today;
    if(reverseGameState.lives<52)reverseGameState.lives+=1;
    if(!reverseGameState.cleared[currentReverseLevel]){
      reverseGameState.playerX=5;reverseGameState.playerY=5;
    }
    saveReverseState();
  }
}

function buildReverseObstacles(){
  gameArena.querySelectorAll(".game-obstacle").forEach(function(el){el.remove();});
  var lv=getCurrentRevLevel();
  lv.obstacles.forEach(function(obs){
    var div=document.createElement("div");
    div.className="game-obstacle";
    div.style.left=(obs.l/100*gameArena.clientWidth)+"px";
    div.style.top=(obs.t/100*gameArena.clientHeight)+"px";
    div.style.width=(obs.w/100*gameArena.clientWidth)+"px";
    div.style.height=(obs.h/100*gameArena.clientHeight)+"px";
    gameArena.appendChild(div);
  });
  // Init moving obstacles
  movingObsData=[];
  lv.moving.forEach(function(m){
    movingObsData.push({l:m.l,t:m.t,w:m.w,h:m.h,dir:m.dir,speed:m.speed,axis:m.axis,minL:m.minL||0,maxL:m.maxL||100,minT:m.minT||0,maxT:m.maxT||100,el:null});
  });
  movingObsData.forEach(function(md){
    var div=document.createElement("div");
    div.className="game-obstacle moving";
    div.style.left=(md.l/100*gameArena.clientWidth)+"px";
    div.style.top=(md.t/100*gameArena.clientHeight)+"px";
    div.style.width=(md.w/100*gameArena.clientWidth)+"px";
    div.style.height=(md.h/100*gameArena.clientHeight)+"px";
    gameArena.appendChild(div);
    md.el=div;
  });
}

function updateMovingObstacles(){
  if(!reverseActive)return;
  var aw=gameArena.clientWidth,ah=gameArena.clientHeight;
  movingObsData.forEach(function(md){
    if(md.axis==="y"){
      md.t+=md.dir*md.speed;
      if(md.t>=md.maxT||md.t<=md.minT)md.dir*=-1;
    }else{
      md.l+=md.dir*md.speed;
      if(md.l>=md.maxL||md.l<=md.minL)md.dir*=-1;
    }
    if(md.el){
      md.el.style.left=(md.l/100*aw)+"px";
      md.el.style.top=(md.t/100*ah)+"px";
    }
  });
  // Check collision with moving obstacles
  var px=reverseGameState.playerX/100*aw;
  var py=reverseGameState.playerY/100*ah;
  var pw=30,ph=30;
  for(var i=0;i<movingObsData.length;i++){
    var mo=movingObsData[i];
    var ox=mo.l/100*aw,oy=mo.t/100*ah;
    var ow=mo.w/100*aw,oh=mo.h/100*ah;
    if(px<ox+ow&&px+pw>ox&&py<oy+oh&&py+ph>oy){
      hitPlayerReverse();return;
    }
  }
}

function setReversePlayerPos(){
  gamePlayer.style.left=(reverseGameState.playerX/100*gameArena.clientWidth)+"px";
  gamePlayer.style.top=(reverseGameState.playerY/100*gameArena.clientHeight)+"px";
}

function checkReverseCollision(px,py){
  var pw=30,ph=30,aw=gameArena.clientWidth,ah=gameArena.clientHeight;
  if(px<0||py<0||px+pw>aw||py+ph>ah)return true;
  var lv=getCurrentRevLevel();
  for(var i=0;i<lv.obstacles.length;i++){
    var o=lv.obstacles[i];
    var ox=o.l/100*aw,oy=o.t/100*ah;
    var ow=o.w/100*aw,oh=o.h/100*ah;
    if(px<ox+ow&&px+pw>ox&&py<oy+oh&&py+ph>oy)return true;
  }
  return false;
}

function checkReverseWin(){
  var aw=gameArena.clientWidth,ah=gameArena.clientHeight;
  var gl=aw-68,gt=ah-68;
  var px=reverseGameState.playerX/100*aw;
  var py=reverseGameState.playerY/100*ah;
  return px+30>gl&&px<gl+56&&py+30>gt&&py<gt+56;
}

function hitPlayerReverse(){
  reverseGameState.lives-=1;
  reverseGameState.playerX=5;
  reverseGameState.playerY=5;
  setReversePlayerPos();
  gameLivesEl.textContent=reverseGameState.lives;
  gamePlayer.classList.add("hit");
  setTimeout(function(){gamePlayer.classList.remove("hit");},300);
  saveReverseState();
  if(reverseGameState.lives<=0){
    reverseActive=false;
    reverseGameState.lives=0;
    clearInterval(reverseTimerId);
    clearInterval(movingObsTimer);
    reverseTimerId=null;movingObsTimer=null;
    gameStatusEl.textContent="生命耗尽，明天再来";
    gameStartBtn.disabled=false;
    gameStartBtn.textContent="明天再挑战";
    saveReverseState();
  }
}

function reverseMovePlayer(intendedDx,intendedDy){
  if(!reverseActive||reverseGameState.cleared[currentReverseLevel])return;
  var dx=-intendedDx,dy=-intendedDy;
  var step=12;
  var aw=gameArena.clientWidth,ah=gameArena.clientHeight;
  var np=reverseGameState.playerX/100*aw+dx*step;
  var nq=reverseGameState.playerY/100*ah+dy*step;
  if(checkReverseCollision(np,nq)){
    hitPlayerReverse();
    return;
  }
  reverseGameState.playerX=np/aw*100;
  reverseGameState.playerY=nq/ah*100;
  setReversePlayerPos();
  gamePlayer.classList.remove("hit");
  if(checkReverseWin()){
    reverseGameState.cleared[currentReverseLevel]=true;
    reverseActive=false;
    clearInterval(reverseTimerId);
    clearInterval(movingObsTimer);
    reverseTimerId=null;movingObsTimer=null;
    gameStatusEl.textContent="通关成功！";
    gameStatusEl.style.color="var(--rose)";
    gameStartBtn.textContent="已通关";
    gameStartBtn.disabled=true;
    if(currentReverseLevel<4){
      updateLevelButtons();
    }
    if(currentReverseLevel===4){
      unlockNextPage(true);
    }
    saveReverseState();
    if(typeof launchHeartRain==="function")launchHeartRain(20);
  }
  saveReverseState();
}

function startReverseLevelTimer(){
  var lv=getCurrentRevLevel();
  if(lv.timeLimit>0){
    reverseGameState.timeLeft=lv.timeLimit;
    if(gameTimerEl){
      gameTimerEl.textContent=lv.timeLimit+"s";
      gameTimerEl.classList.remove("urgent");
    }
    reverseTimerId=setInterval(function(){
      if(!reverseActive){clearInterval(reverseTimerId);reverseTimerId=null;return;}
      reverseGameState.timeLeft--;
      if(gameTimerEl){
        gameTimerEl.textContent=reverseGameState.timeLeft+"s";
        if(reverseGameState.timeLeft<=15)gameTimerEl.classList.add("urgent");
      }
      if(reverseGameState.timeLeft<=0){
        clearInterval(reverseTimerId);reverseTimerId=null;
        hitPlayerReverse();
        if(reverseGameState.lives>0){
          reverseActive=false;
          gameStatusEl.textContent="时间耗尽！";
          gameStartBtn.disabled=false;
          gameStartBtn.textContent="重新挑战";
        }
      }
    },1000);
  }
}

function startReverseGame(){
  if(reverseGameState.lives<=0){
    gameStatusEl.textContent="生命不足，明天再来";return;
  }
  if(reverseGameState.cleared[currentReverseLevel]){
    gameStatusEl.textContent="已通关！";return;
  }
  reverseActive=true;
  reverseGameState.playerX=5;
  reverseGameState.playerY=5;
  setReversePlayerPos();
  gameStatusEl.textContent="挑战中...方向全反！";
  gameStatusEl.style.color="var(--muted)";
  gameStartBtn.disabled=true;
  gameStartBtn.textContent="挑战中...";
  saveReverseState();
  // Start moving obstacles
  startReverseLevelTimer();
  movingObsTimer=setInterval(updateMovingObstacles,50);
}

function updateLevelButtons(){
  var btns=document.querySelectorAll(".rev-level-btn");
  btns.forEach(function(btn,i){
    btn.classList.remove("active","cleared","locked");
    if(i===currentReverseLevel)btn.classList.add("active");
    if(reverseGameState.cleared[i])btn.classList.add("cleared");
    if(i>0&&!reverseGameState.cleared[i-1])btn.classList.add("locked");
  });
}

function selectReverseLevel(index){
  if(index===currentReverseLevel)return;
  if(index>0&&!reverseGameState.cleared[index-1]){
    alert("请先通关上一关！");return;
  }
  if(reverseActive){
    reverseActive=false;
    clearInterval(reverseTimerId);
    clearInterval(movingObsTimer);
    reverseTimerId=null;movingObsTimer=null;
  }
  currentReverseLevel=index;
  reverseGameState.playerX=5;
  reverseGameState.playerY=5;
  reverseGameState.timeLeft=0;
  gameStartBtn.disabled=false;
  gameStartBtn.textContent="开始挑战";
  if(gameTimerEl)gameTimerEl.textContent="--";
  gameArena.className="game-arena level-"+(index+1);
  buildReverseObstacles();
  setReversePlayerPos();
  updateLevelButtons();
  if(reverseGameState.cleared[currentReverseLevel]){
    gameStatusEl.textContent="已通关";
    gameStatusEl.style.color="var(--rose)";
    gameStartBtn.disabled=true;
    gameStartBtn.textContent="已通关";
  }else{
    gameStatusEl.textContent="准备开始";
    gameStatusEl.style.color="var(--muted)";
  }
  saveReverseState();
}

function renderReverseGame(){
  gameLivesEl.textContent=reverseGameState.lives;
  gameArena.className="game-arena level-"+(currentReverseLevel+1);
  buildReverseObstacles();
  setReversePlayerPos();
  updateLevelButtons();
  if(reverseGameState.cleared[currentReverseLevel]){
    gameStatusEl.textContent="已通关";
    gameStatusEl.style.color="var(--rose)";
    gameStartBtn.disabled=true;
    gameStartBtn.textContent="已通关";
    if(currentReverseLevel===4)unlockNextPage();
  }else if(reverseGameState.lives<=0){
    gameStatusEl.textContent="生命耗尽";
    gameStartBtn.disabled=true;
    gameStartBtn.textContent="明天再来";
  }else{
    gameStatusEl.textContent="准备开始";
  }
  if(gameTimerEl)gameTimerEl.textContent="--";
}

function unlockNextPage(shouldScroll){
  nextPageCard.classList.remove("locked");
  nextPageCard.classList.add("unlocked");
  nextPageCard.querySelector("strong").textContent="已解锁！向下滚动进入推箱子挑战";
  nextPageCard.querySelector("p").textContent="恭喜通关全部5关，第二个挑战已经开启。";
  var soko=document.querySelector("#sokoban");
  if(soko)soko.setAttribute("aria-hidden","false");
  if(shouldScroll){
    setTimeout(function(){
      var s2=document.querySelector("#sokoban");
      if(s2)s2.scrollIntoView({behavior:"smooth"});
    },800);
  }
}

// Event listeners
if(gameStartBtn)gameStartBtn.addEventListener("click",startReverseGame);

document.querySelectorAll(".game-controls button").forEach(function(btn){
  btn.addEventListener("click",function(){
    var d=btn.dataset.move;
    if(d==="up")reverseMovePlayer(0,-1);
    if(d==="down")reverseMovePlayer(0,1);
    if(d==="left")reverseMovePlayer(-1,0);
    if(d==="right")reverseMovePlayer(1,0);
  });
});

document.addEventListener("keydown",function(e){
  var sec=document.querySelector("#reverseGame");
  if(!sec||!reverseActive)return;
  var r=sec.getBoundingClientRect();
  if(r.top>=window.innerHeight||r.bottom<=0)return;
  if(e.key==="ArrowUp"){e.preventDefault();reverseMovePlayer(0,-1);}
  if(e.key==="ArrowDown"){e.preventDefault();reverseMovePlayer(0,1);}
  if(e.key==="ArrowLeft"){e.preventDefault();reverseMovePlayer(-1,0);}
  if(e.key==="ArrowRight"){e.preventDefault();reverseMovePlayer(1,0);}
});

window.addEventListener("resize",function(){
  buildReverseObstacles();
  setReversePlayerPos();
});

// Level select buttons
document.querySelectorAll(".rev-level-btn").forEach(function(btn){
  btn.addEventListener("click",function(){
    var lvl=parseInt(btn.dataset.level);
    selectReverseLevel(lvl);
  });
});


// ===== 推箱子游戏 - 10关升级版 =====
var sokobanBoard=document.querySelector("#sokobanBoard");
var sokobanSteps=document.querySelector("#sokobanSteps");
var sokobanPushes=document.querySelector("#sokobanPushes");
var sokobanStatus=document.querySelector("#sokobanStatus");
var sokobanHint=document.querySelector("#sokobanHint");
var sokobanHintBtn=document.querySelector("#sokobanHintBtn");
var sokobanWin=document.querySelector("#sokobanWin");
var sokobanWinSteps=document.querySelector("#sokobanWinSteps");
var sokobanReset=document.querySelector("#sokobanReset");
var sokobanSection=document.querySelector("#sokoban");
var sokobanUndoBtn=document.querySelector("#sokobanUndo");

var SOKOBAN_LEVELS=[
  {width:7,height:7,
   walls:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[0,1],[6,1],[0,2],[6,2],[0,3],[6,3],[0,4],[6,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]],
   targets:[[2,2],[4,2],[3,4]],boxes:[[2,3],[3,3],[4,3]],player:[3,1],
   hints:["先推角落的箱子，用小人绕到箱子侧面推。"]},
  {width:7,height:7,
   walls:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[0,1],[3,1],[6,1],[0,2],[3,2],[6,2],[0,3],[6,3],[0,4],[3,4],[6,4],[0,5],[3,5],[6,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
   targets:[[1,2],[5,2],[2,5],[4,5]],boxes:[[1,4],[2,3],[4,3],[5,4]],player:[3,5],
   hints:["先解决底部的两个，从中间通道推上去。"]},
  {width:8,height:8,
   walls:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[0,1],[4,1],[7,1],[0,2],[4,2],[7,2],[0,3],[4,3],[7,3],[0,4],[4,4],[7,4],[0,5],[4,5],[7,5],[0,6],[4,6],[7,6],[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]],
   targets:[[2,2],[5,2],[2,5],[5,5]],boxes:[[1,3],[3,3],[4,3],[6,3]],player:[3,6],
   hints:["中间立柱是最大障碍，需要绕大圈。"]},
  {width:7,height:7,
   walls:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[0,1],[6,1],[0,2],[2,2],[4,2],[6,2],[0,3],[2,3],[4,3],[6,3],[0,4],[2,4],[4,4],[6,4],[0,5],[6,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
   targets:[[1,3],[5,3],[3,1],[3,5]],boxes:[[2,3],[4,3],[3,2],[3,4]],player:[3,3],
   hints:["十字关卡，先在侧边移动把箱子推到边缘。"]},
  {width:8,height:8,
   walls:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[0,1],[7,1],[0,2],[7,2],[0,3],[7,3],[0,4],[7,4],[0,5],[7,5],[0,6],[7,6],[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[2,2],[2,3],[2,4],[5,2],[5,3],[5,4]],
   targets:[[3,2],[4,2],[3,5],[4,5]],boxes:[[3,4],[4,4],[3,3],[4,3]],player:[1,4],
   hints:["两侧有柱子的对称关卡，从上方或下方绕行。"]},
  {width:9,height:7,
   walls:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[0,1],[8,1],[0,2],[4,2],[8,2],[0,3],[4,3],[8,3],[0,4],[4,4],[8,4],[0,5],[8,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]],
   targets:[[2,2],[6,2],[2,4],[6,4]],boxes:[[2,3],[3,2],[5,2],[6,3]],player:[4,5],
   hints:["长条形关卡，利用中间通道来回移动。"]},
  {width:8,height:8,
   walls:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[0,1],[7,1],[0,2],[3,2],[4,2],[7,2],[0,3],[3,3],[4,3],[7,3],[0,4],[3,4],[4,4],[7,4],[0,5],[3,5],[4,5],[7,5],[0,6],[7,6],[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]],
   targets:[[1,2],[6,2],[1,6],[6,6]],boxes:[[1,4],[2,3],[5,3],[6,4]],player:[3,5],
   hints:["中间两列柱子，箱子需要逐个推入角落。"]},
  {width:9,height:9,
   walls:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[0,1],[4,1],[8,1],[0,2],[4,2],[8,2],[0,3],[1,3],[2,3],[3,3],[5,3],[6,3],[7,3],[8,3],[0,4],[4,4],[8,4],[0,5],[1,5],[2,5],[3,5],[5,5],[6,5],[7,5],[8,5],[0,6],[4,6],[8,6],[0,7],[4,7],[8,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8]],
   targets:[[2,2],[6,2],[2,6],[6,6],[4,4]],boxes:[[2,3],[3,4],[5,4],[6,3],[4,5]],player:[4,7],
   hints:["5个箱子+中心目标，最具挑战！先处理四角的箱子。"]},
  {width:10,height:7,
   walls:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[0,1],[9,1],[0,2],[5,2],[9,2],[0,3],[5,3],[9,3],[0,4],[5,4],[9,4],[0,5],[9,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6]],
   targets:[[2,2],[8,2],[2,4],[8,4]],boxes:[[2,3],[4,3],[6,3],[8,3]],player:[5,5],
   hints:["宽度更大的关卡，利用开阔空间迂回。"]},
  {width:9,height:9,
   walls:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[0,1],[8,1],[0,2],[4,2],[8,2],[0,3],[3,3],[4,3],[5,3],[8,3],[0,4],[2,4],[6,4],[8,4],[0,5],[2,5],[6,5],[8,5],[0,6],[2,6],[3,6],[5,6],[6,6],[8,6],[0,7],[4,7],[8,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8]],
   targets:[[2,2],[6,2],[2,6],[6,6],[4,4]],boxes:[[2,4],[3,5],[5,5],[6,4],[4,3]],player:[4,7],
   hints:["终极关卡！中心有菱形障碍群，需要极高的规划。"]}
];

var currentSokoLevel=0;
var sokobanPlayer={x:3,y:1};
var sokobanBoxes=[];
var sokobanStepCount=0;
var sokobanPushCount=0;
var sokobanWon=false;
var hintClickCount=0;
var allSokoCleared=false;
var sokoClearedLevels=[false,false,false,false,false,false,false,false,false,false];
var sokoHistory=[]; // undo stack

function getCurrentLevel(){return SOKOBAN_LEVELS[currentSokoLevel];}
function isSokobanWall(x,y){return getCurrentLevel().walls.some(function(w){return w[0]===x&&w[1]===y;});}
function isSokobanTarget(x,y){return getCurrentLevel().targets.some(function(t){return t[0]===x&&t[1]===y;});}
function getBoxIndex(x,y){return sokobanBoxes.findIndex(function(b){return b[0]===x&&b[1]===y;});}

function renderSokoban(){
  if(!sokobanBoard)return;
  var lv=getCurrentLevel();
  sokobanBoard.innerHTML="";
  sokobanBoard.style.gridTemplateColumns="repeat("+lv.width+", 42px)";
  sokobanBoard.style.gridTemplateRows="repeat("+lv.height+", 42px)";
  for(var y=0;y<lv.height;y++){
    for(var x=0;x<lv.width;x++){
      var cell=document.createElement("div");
      cell.className="sokoban-cell";
      if(isSokobanWall(x,y))cell.classList.add("wall");
      if(isSokobanTarget(x,y))cell.classList.add("target");
      if(sokobanPlayer.x===x&&sokobanPlayer.y===y)cell.classList.add("player");
      var bi=getBoxIndex(x,y);
      if(bi!==-1)cell.classList.add(isSokobanTarget(x,y)?"box-on-target":"box");
      sokobanBoard.appendChild(cell);
    }
  }
  if(sokobanSteps)sokobanSteps.textContent=sokobanStepCount;
  if(sokobanPushes)sokobanPushes.textContent=sokobanPushCount;
}

function loadSokoLevel(index){
  currentSokoLevel=index;
  var lv=getCurrentLevel();
  sokobanPlayer={x:lv.player[0],y:lv.player[1]};
  sokobanBoxes=lv.boxes.map(function(b){return[b[0],b[1]];});
  sokobanStepCount=0;
  sokobanPushCount=0;
  sokobanWon=false;
  hintClickCount=0;
  sokoHistory=[];
  if(sokobanStatus){sokobanStatus.textContent="第"+(index+1)+"关 准备开始";sokobanStatus.style.color="var(--muted)";}
  if(sokobanWin)sokobanWin.classList.remove("show");
  if(sokobanHint)sokobanHint.classList.remove("show");
  if(sokobanHintBtn){
    sokobanHintBtn.textContent="求助（点3次获得提示）";
    sokobanHintBtn.disabled=false;
    sokobanHintBtn.style.opacity="";
    sokobanHintBtn.style.background="";
    sokobanHintBtn.style.cursor="";
  }
  updateSokoLevelButtons();
  renderSokoban();
}

function checkSokobanWin(){
  var allOnTarget=getCurrentLevel().targets.every(function(t){
    return sokobanBoxes.some(function(b){return b[0]===t[0]&&b[1]===t[1];});
  });
  if(allOnTarget&&!sokobanWon){
    sokobanWon=true;
    sokoClearedLevels[currentSokoLevel]=true;
    if(currentSokoLevel<SOKOBAN_LEVELS.length-1){
      sokobanStatus.textContent="第"+(currentSokoLevel+1)+"关通关！进入下一关...";
      sokobanStatus.style.color="var(--rose)";
      sokobanWinSteps.textContent=sokobanStepCount;
      sokobanWin.classList.add("show");
      if(typeof launchHeartRain==="function")launchHeartRain(15);
      setTimeout(function(){loadSokoLevel(currentSokoLevel+1);},1500);
    }else{
      allSokoCleared=true;
      sokobanStatus.textContent="全部通关！你是推箱子大师！";
      sokobanStatus.style.color="var(--rose)";
      sokobanWinSteps.textContent=sokobanStepCount;
      sokobanWin.classList.add("show");
      sokobanWin.querySelector("span").textContent="10关全部通关！你简直是推箱子天才！";
      if(typeof launchHeartRain==="function")launchHeartRain(50);
    }
  }
  return allOnTarget;
}

function moveSokobanPlayer(dx,dy){
  if(sokobanWon)return;
  var nx=sokobanPlayer.x+dx,ny=sokobanPlayer.y+dy;
  if(isSokobanWall(nx,ny))return;
  // Save state for undo
  sokoHistory.push({
    px:sokobanPlayer.x,py:sokobanPlayer.y,
    boxes:sokobanBoxes.map(function(b){return[b[0],b[1]];}),
    steps:sokobanStepCount,pushes:sokobanPushCount
  });
  if(sokoHistory.length>200)sokoHistory.shift();
  var bi=getBoxIndex(nx,ny);
  if(bi!==-1){
    var bnx=nx+dx,bny=ny+dy;
    if(isSokobanWall(bnx,bny)){sokoHistory.pop();return;}
    if(getBoxIndex(bnx,bny)!==-1){sokoHistory.pop();return;}
    sokobanBoxes[bi]=[bnx,bny];
    sokobanPushCount++;
    if(sokobanStatus)sokobanStatus.textContent="第"+(currentSokoLevel+1)+"关 推箱子中...";
  }
  sokobanPlayer.x=nx;
  sokobanPlayer.y=ny;
  sokobanStepCount++;
  renderSokoban();
  var won=getCurrentLevel().targets.every(function(t){
    return sokobanBoxes.some(function(b){return b[0]===t[0]&&b[1]===t[1];});
  });
  if(sokobanStatus){
    sokobanStatus.textContent=won?"通关成功！":("第"+(currentSokoLevel+1)+"关 移动中...");
    if(!won)sokobanStatus.style.color="var(--muted)";
  }
  checkSokobanWin();
}

function undoSokoban(){
  if(sokoHistory.length===0)return;
  var prev=sokoHistory.pop();
  sokobanPlayer.x=prev.px;
  sokobanPlayer.y=prev.py;
  sokobanBoxes=prev.boxes;
  sokobanStepCount=prev.steps;
  sokobanPushCount=prev.pushes;
  renderSokoban();
}

function resetSokoban(){loadSokoLevel(currentSokoLevel);}

function updateSokoLevelButtons(){
  var btns=document.querySelectorAll(".soko-level-btn");
  btns.forEach(function(btn,i){
    btn.classList.remove("active","cleared","locked");
    if(i===currentSokoLevel)btn.classList.add("active");
    if(sokoClearedLevels[i])btn.classList.add("cleared");
    if(i>0&&!sokoClearedLevels[i-1])btn.classList.add("locked");
  });
}

if(sokobanReset)sokobanReset.addEventListener("click",resetSokoban);
if(sokobanUndoBtn)sokobanUndoBtn.addEventListener("click",undoSokoban);

if(sokobanHintBtn){
  sokobanHintBtn.addEventListener("click",function(){
    hintClickCount++;
    var remaining=3-hintClickCount;
    if(remaining>0){
      sokobanHintBtn.textContent="求助（还差"+remaining+"次获得提示）";
      if(remaining===2)sokobanHintBtn.style.background="var(--gold)";
      if(remaining===1)sokobanHintBtn.style.background="var(--rose)";
    }else{
      if(sokobanHint){
        var tips=getCurrentLevel().hints;
        sokobanHint.querySelector("p").textContent=tips[0]||"试试绕到箱子上方往下推吧！";
        sokobanHint.classList.add("show");
      }
      sokobanHintBtn.textContent="提示已显示";
      sokobanHintBtn.disabled=true;
      sokobanHintBtn.style.opacity="0.6";
      sokobanHintBtn.style.cursor="default";
    }
  });
}

document.querySelectorAll(".sokoban-controls button").forEach(function(btn){
  btn.addEventListener("click",function(){
    var d=btn.dataset.sokodir;
    if(d==="up")moveSokobanPlayer(0,-1);
    if(d==="down")moveSokobanPlayer(0,1);
    if(d==="left")moveSokobanPlayer(-1,0);
    if(d==="right")moveSokobanPlayer(1,0);
  });
});

document.addEventListener("keydown",function(e){
  var sec=document.querySelector("#sokoban");
  if(!sec||sec.getAttribute("aria-hidden")==="true")return;
  var r=sec.getBoundingClientRect();
  if(r.top>=window.innerHeight||r.bottom<=0)return;
  if(sokobanWon)return;
  if(e.key==="ArrowUp"){e.preventDefault();moveSokobanPlayer(0,-1);}
  if(e.key==="ArrowDown"){e.preventDefault();moveSokobanPlayer(0,1);}
  if(e.key==="ArrowLeft"){e.preventDefault();moveSokobanPlayer(-1,0);}
  if(e.key==="ArrowRight"){e.preventDefault();moveSokobanPlayer(1,0);}
  if(e.key==="z"&&e.ctrlKey){e.preventDefault();undoSokoban();}
});

// Level select
document.querySelectorAll(".soko-level-btn").forEach(function(btn){
  btn.addEventListener("click",function(){
    var lvl=parseInt(btn.dataset.level);
    if(lvl===currentSokoLevel)return;
    if(lvl>0&&!sokoClearedLevels[lvl-1]){
      alert("请先通关上一关！");return;
    }
    loadSokoLevel(lvl);
  });
});


// ===== Init Both Games =====
readReverseState();
applyDailyRefresh();
renderReverseGame();

if(reverseGameState.cleared[4]){
  if(sokobanSection)sokobanSection.setAttribute("aria-hidden","false");
  unlockNextPage(false);
}

loadSokoLevel(0);
// Add level buttons dynamically for soko
(function(){
  var sel=document.querySelector("#sokobanLevelSelect");
  if(sel){
    for(var i=0;i<10;i++){
      var btn=document.createElement("button");
      btn.type="button";
      btn.dataset.level=i;
      btn.className="soko-level-btn";
      if(i===0)btn.classList.add("active");
      btn.textContent=(i+1);
      sel.appendChild(btn);
      btn.addEventListener("click",function(){
        var lvl=parseInt(this.dataset.level);
        if(lvl===currentSokoLevel)return;
        if(lvl>0&&!sokoClearedLevels[lvl-1]){
          alert("请先通关上一关！");return;
        }
        document.querySelectorAll(".soko-level-btn").forEach(function(b){b.classList.remove("active");});
        this.classList.add("active");
        loadSokoLevel(lvl);
      });
    }
  }
})();

// Add level buttons for reverse game
(function(){
  var sel=document.querySelector("#reverseLevelSelect");
  if(sel){
    for(var i=0;i<5;i++){
      var btn=document.createElement("button");
      btn.type="button";
      btn.dataset.level=i;
      btn.className="rev-level-btn";
      if(i===0)btn.classList.add("active");
      btn.textContent=(i+1);
      sel.appendChild(btn);
      btn.addEventListener("click",function(){
        var lvl=parseInt(this.dataset.level);
        selectReverseLevel(lvl);
      });
    }
  }
})();
