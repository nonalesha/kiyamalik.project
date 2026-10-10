
let currentStep = 1;
let researcherName = "Azqya";
let researcherTitle = "Kepala Bagian Menyayangimu Sepenuh Hati";
let targetName = "Malik";

let audioContext = null;
let melodyInterval = null;
let isAudioPlaying = false;

let canvas = null;
let ctx = null;
let isDrawing = false;
let canvasHasContent = false;

document.addEventListener("DOMContentLoaded", () => {
  initCanvas();
  goToStep(1);

 const readerInput = document.getElementById("readerNameInput");

if (readerInput) {
  readerInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      validateReader();
    }
  });
}

  window.addEventListener("resize", resizeCanvas);
});


function goToStep(stepNumber) {
  if (stepNumber < 1 || stepNumber > 4) return;

  const targetStep = document.getElementById(`step-${stepNumber}`);
  
  console.log("HTML yang terbaca:", document.URL);
console.log("Elemen step:", targetStep);
console.log("Jumlah section:", document.querySelectorAll(".step-content").length);

  // Cegah error jika elemen tidak ditemukan
  if (!targetStep) {
    console.error(
      `Elemen step-${stepNumber} tidak ditemukan di index.html`
    );
    return;
  }

  currentStep = stepNumber;

  document.querySelectorAll(".step-content").forEach(section => {
    section.classList.add("hidden");
  });

  targetStep.classList.remove("hidden");

  for (let i = 1; i <= 4; i++) {
    const button = document.getElementById(`nav-step-${i}`);

    if (button) {
      button.classList.toggle("active", i === stepNumber);
    }
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (stepNumber === 4) {
    requestAnimationFrame(resizeCanvas);
  }
}

function validateReader() {
  const input = document.getElementById("readerNameInput")
    .value.trim();

  if (!input) {
    alert("Mohon masukkan nama kamu terlebih dahulu!");
    return;
  }

  targetName = input;
  updateTargetNames(targetName);

  document.getElementById("modalReaderName").textContent = input;
  document.getElementById("authSuccessModal").classList.remove("hidden");

  createFloatingHearts(5);
}

function closeAuthModal() {
  document.getElementById("authSuccessModal").classList.add("hidden");
  goToStep(2);
}

function updateTargetNames(name) {
  document.querySelectorAll(".target-name").forEach(element => {
    element.textContent = name;
  });
}

function dodgeButton() {
  const button = document.getElementById("btnGak");
  const area = document.getElementById("dodgeArea");

  const maxX = Math.max(0, area.clientWidth - button.offsetWidth);
  const maxY = Math.max(0, area.clientHeight - button.offsetHeight);

  button.style.position = "absolute";
  button.style.left = `${Math.random() * maxX}px`;
  button.style.top = `${Math.random() * maxY}px`;

  const messages = [
    "Yakin gak?",
    "Eits, gak bisa!",
    "Pikir lagi!",
    "Tombolnya error hihi",
    "Harus YA dong!"
  ];

  button.textContent =
    messages[Math.floor(Math.random() * messages.length)];
}

function answerKangen() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#6b1d2f", "#e29578", "#ff4d6d", "#ffffff"]
    });
  }

  createFloatingHearts(12);
  alert("Awww! Hipotesis kangen terbukti 100% valid! ♥");
}

function updateSlider(value) {
  document.getElementById("sliderValue").textContent = `${value}%`;

  const feedback = document.getElementById("sliderFeedback");

  if (value > 500) {
    feedback.textContent =
      "OVERLOAD! Kelucuan merusak sistem pertahanan hati!";
  } else if (value > 200) {
    feedback.textContent =
      "Sangat tinggi di atas rata-rata populasi dunia.";
  } else {
    feedback.textContent =
      "Skala standar tercapai (maksimal tak terhingga).";
  }
}

function initCanvas() {
  canvas = document.getElementById("signatureCanvas");
  if (!canvas) return;

  ctx = canvas.getContext("2d");

  canvas.addEventListener("pointerdown", startDrawing);
  canvas.addEventListener("pointermove", draw);
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);
  canvas.addEventListener("pointerleave", stopDrawing);

  resizeCanvas();
}

function resizeCanvas() {
  if (!canvas || !ctx) return;

  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const oldCanvas = document.createElement("canvas");
  oldCanvas.width = canvas.width;
  oldCanvas.height = canvas.height;

  if (canvasHasContent) {
    oldCanvas.getContext("2d").drawImage(canvas, 0, 0);
  }

  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#6b1d2f";

  if (canvasHasContent && oldCanvas.width && oldCanvas.height) {
    ctx.drawImage(
      oldCanvas,
      0, 0, oldCanvas.width, oldCanvas.height,
      0, 0, rect.width, rect.height
    );
  }
}

function startDrawing(event) {
  if (!ctx) return;

  isDrawing = true;
  canvas.setPointerCapture?.(event.pointerId);

  document.getElementById("canvasPlaceholder").style.display = "none";

  const rect = canvas.getBoundingClientRect();
  ctx.beginPath();
  ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
}

function draw(event) {
  if (!isDrawing || !ctx) return;

  const rect = canvas.getBoundingClientRect();

  ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
  ctx.stroke();

  canvasHasContent = true;
}

function stopDrawing() {
  isDrawing = false;
}

function clearCanvas() {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasHasContent = false;

  document.getElementById("canvasPlaceholder").style.display = "grid";
}

function openCustomizeModal() {
  document.getElementById("customModal").classList.remove("hidden");
}

function closeCustomizeModal() {
  document.getElementById("customModal").classList.add("hidden");
}

function saveCustomizations() {
  researcherName =
    document.getElementById("editResearcherName").value.trim()
    || "Melvian";

  researcherTitle =
    document.getElementById("editResearcherTitle").value.trim()
    || "Kepala Bagian Menyayangimu Sepenuh Hati";

  targetName =
    document.getElementById("editTargetName").value.trim()
    || "Kamu";

  const newTitle =
    document.getElementById("editThesisTitle").value.trim();

  document.getElementById("displayResearcherName").textContent =
    researcherName;

  document.getElementById("displayResearcherName2").textContent =
    researcherName;

  document.getElementById("displayResearcherName3").textContent =
    researcherName;

  document.getElementById("displaySignature1").textContent =
    researcherName;

  document.getElementById("displayResearcherTitle").textContent =
    `Jabatan: ${researcherTitle}`;

  if (newTitle) {
    document.getElementById("displayThesisTitle").textContent =
      newTitle;
  }

  updateTargetNames(targetName);
  closeCustomizeModal();

  alert("Data berhasil diperbarui!");
}

function triggerLoveCelebration() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.55 },
      colors: ["#6b1d2f", "#e29578", "#ff4d6d", "#ffffff"]
    });
  }

  createFloatingHearts(20);
}

function createFloatingHearts(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");

      heart.className = "floating-heart";
      heart.textContent = "♥";
      heart.style.left = `${Math.random() * 90 + 5}%`;
      heart.style.fontSize = `${16 + Math.random() * 18}px`;
      heart.style.animationDuration = `${3 + Math.random() * 2}s`;

      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 5200);
    }, i * 150);
  }
}

function toggleAudio() {
  if (!isAudioPlaying) {
    startRomanticMelody();
  } else {
    stopRomanticMelody();
  }
}

function startRomanticMelody() {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      alert("Browser kamu belum mendukung Web Audio.");
      return;
    }

    audioContext = new AudioContextClass();

    const notes = [261.63, 329.63, 392, 440, 523.25, 659.25];
    let noteIndex = 0;

    const playNote = () => {
      if (!audioContext || audioContext.state === "closed") return;

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      const now = audioContext.currentTime;

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        notes[noteIndex % notes.length],
        now
      );

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + 1.15);

      noteIndex = (noteIndex + 1) % notes.length;
    };

    audioContext.resume().then(() => {
      playNote();
      melodyInterval = setInterval(playNote, 800);
    });

    isAudioPlaying = true;
    document.getElementById("musicText").textContent = "Audio: On";
    document.getElementById("musicIcon").className =
      "fa-solid fa-volume-high";
  } catch (error) {
    console.error("Audio error:", error);
    alert("Audio tidak dapat diputar pada browser ini.");
  }
}

function stopRomanticMelody() {
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  isAudioPlaying = false;

  document.getElementById("musicText").textContent = "Audio Romantis";
  document.getElementById("musicIcon").className = "fa-solid fa-music";
}