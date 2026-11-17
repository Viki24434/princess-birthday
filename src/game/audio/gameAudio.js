
const STORAGE_KEY = "adventure-sound-enabled";

let audioContext = null;
let masterGain = null;

let musicTimer = null;
let musicStep = 0;
let musicWanted = false;

// Default suara aktif
let soundEnabled = true;

try {
  soundEnabled =
    localStorage.getItem(STORAGE_KEY) !== "false";
} catch {
  soundEnabled = true;
}

// =====================================
// MEMBUAT AUDIO CONTEXT
// =====================================

function getAudioContext() {
  if (audioContext) return audioContext;

  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  audioContext = new AudioContextClass();

  masterGain = audioContext.createGain();
  masterGain.gain.value =
    soundEnabled ? 0.55 : 0;

  masterGain.connect(audioContext.destination);

  return audioContext;
}

// Browser mengharuskan audio dibuka
// melalui interaksi pengguna.
export function unlockGameAudio() {
  const context = getAudioContext();

  if (!context) return;

  if (context.state === "suspended") {
    context.resume().catch(() => {
      // Browser belum mengizinkan audio
    });
  }
}

// =====================================
// PENGATURAN SUARA
// =====================================

export function getGameSoundEnabled() {
  return soundEnabled;
}

export function setGameSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);

  try {
    localStorage.setItem(
      STORAGE_KEY,
      String(soundEnabled)
    );
  } catch {
    // Tetap bisa dipakai tanpa storage
  }

  if (masterGain) {
    masterGain.gain.value =
      soundEnabled ? 0.55 : 0;
  }

  if (soundEnabled) {
    unlockGameAudio();

    if (musicWanted) {
      beginMusicLoop();
    }
  } else {
    clearMusicLoop();
  }
}

// =====================================
// MEMAINKAN NADA
// =====================================

function playTone(
  frequency,
  duration = 0.15,
  delay = 0,
  type = "sine",
  volume = 0.15
) {
  if (!soundEnabled) return;

  const context = getAudioContext();

  if (
    !context ||
    context.state !== "running"
  ) {
    return;
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  const startTime =
    context.currentTime + Math.max(0, delay);

  const endTime =
    startTime + Math.max(0.02, duration);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(
    frequency,
    startTime
  );

  gain.gain.setValueAtTime(
    0.0001,
    startTime
  );

  gain.gain.exponentialRampToValueAtTime(
    Math.max(0.001, volume),
    startTime + 0.015
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    endTime
  );

  oscillator.connect(gain);
  gain.connect(masterGain);

  oscillator.start(startTime);
  oscillator.stop(endTime + 0.01);

  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
}

// =====================================
// EFEK SUARA GAME
// =====================================

export function playGameSound(type) {
  if (!soundEnabled) return;

  switch (type) {
    case "jump":
      playTone(420, 0.08, 0, "sine", 0.15);
      playTone(620, 0.11, 0.06, "sine", 0.12);
      break;

    case "heart":
      playTone(660, 0.12, 0, "sine", 0.14);
      playTone(880, 0.16, 0.09, "sine", 0.13);
      break;

    case "checkpoint":
      playTone(523, 0.15, 0, "triangle", 0.13);
      playTone(659, 0.15, 0.12, "triangle", 0.13);
      playTone(784, 0.25, 0.24, "sine", 0.15);
      break;

    case "fall":
      playTone(380, 0.17, 0, "triangle", 0.16);
      playTone(250, 0.22, 0.13, "triangle", 0.12);
      break;

    case "hit":
      playTone(180, 0.10, 0, "sawtooth", 0.12);
      playTone(130, 0.15, 0.07, "triangle", 0.13);
      break;

    case "flag":
      playTone(523, 0.15, 0, "sine", 0.12);
      playTone(659, 0.15, 0.14, "sine", 0.12);
      playTone(784, 0.22, 0.28, "sine", 0.14);
      break;

    case "firework":
      playTone(
        900 + Math.random() * 300,
        0.11,
        0,
        "triangle",
        0.09
      );
      playTone(
        1200 + Math.random() * 300,
        0.19,
        0.06,
        "sine",
        0.08
      );
      break;

    case "win":
      playTone(523, 0.22, 0, "triangle", 0.16);
      playTone(659, 0.22, 0.18, "triangle", 0.16);
      playTone(784, 0.22, 0.36, "triangle", 0.16);
      playTone(1047, 0.55, 0.54, "sine", 0.20);
      break;

    default:
      break;
  }
}

// =====================================
// MUSIK LATAR — MELODI ORIGINAL
// =====================================

const melody = [
  523.25, 659.25, 783.99, 659.25,
  587.33, 698.46, 880.00, 698.46,
  659.25, 783.99, 987.77, 783.99,
  587.33, 659.25, 783.99, 523.25
];

function playMusicStep() {
  const frequency = melody[
    musicStep % melody.length
  ];

  playTone(
    frequency,
    0.30,
    0,
    "sine",
    0.055
  );

  // Nada rendah lembut setiap empat ketukan
  if (musicStep % 4 === 0) {
    playTone(
      frequency / 4,
      0.65,
      0,
      "triangle",
      0.035
    );
  }

  musicStep += 1;
}

function clearMusicLoop() {
  if (musicTimer !== null) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

function beginMusicLoop() {
  if (
    musicTimer !== null ||
    !soundEnabled ||
    typeof window === "undefined"
  ) {
    return;
  }

  playMusicStep();

  musicTimer = window.setInterval(
    playMusicStep,
    370
  );
}

// =====================================
// MULAI / HENTIKAN MUSIK
// =====================================

export function startGameMusic() {
  musicWanted = true;

  unlockGameAudio();
  beginMusicLoop();
}

export function stopGameMusic() {
  musicWanted = false;
  clearMusicLoop();
}
