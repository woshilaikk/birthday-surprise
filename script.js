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
