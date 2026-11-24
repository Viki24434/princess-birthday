const STORAGE_KEY = "adventure-sound-enabled";
const AUDIO_BASE = `${import.meta.env.BASE_URL}game/audio/`;

// Ganti nama file atau volume di sini untuk memakai audio pilihan sendiri.
// MP3, WAV, dan OGG bisa dipakai selama formatnya didukung browser.
const MUSIC = { file: "background.mp3", volume: 0.22 };
const SOUNDS = {
  jump: { file: "jump.wav", volume: 0.55 },
  heart: { file: "heart.wav", volume: 0.65 },
  checkpoint: { file: "checkpoint.wav", volume: 0.55 },
  fall: { file: "fall.wav", volume: 0.5 },
  hit: { file: "hit.wav", volume: 0.55 },
  stomp: { file: "hit.wav", volume: 0.4 },
  flag: { file: "flag.wav", volume: 0.55 },
  firework: { file: "firework.wav", volume: 0.3 },
  win: { file: "win.wav", volume: 0.65 }
};

let audioContext = null;
let masterGain = null;
let musicSource = null;
let musicRequest = 0;
let musicWanted = false;
let soundEnabled = true;

const pendingBuffers = new Map();
const loadedBuffers = new Map();
const activeEffects = new Set();

try {
  soundEnabled = localStorage.getItem(STORAGE_KEY) !== "false";
} catch {
  // Suara tetap bisa dipakai tanpa localStorage.
}

function getAudioContext() {
  if (audioContext) return audioContext;
  if (typeof window === "undefined") return null;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  audioContext = new AudioContextClass();
  masterGain = audioContext.createGain();
  masterGain.gain.value = soundEnabled ? 0.55 : 0;
  masterGain.connect(audioContext.destination);
  return audioContext;
}

function loadBuffer(file) {
  if (loadedBuffers.has(file)) {
    return Promise.resolve(loadedBuffers.get(file));
  }

  if (!pendingBuffers.has(file)) {
    const request = fetch(`${AUDIO_BASE}${file}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${file}`);
        }
        return response.arrayBuffer();
      })
      .then(bytes => audioContext.decodeAudioData(bytes))
      .then(buffer => {
        loadedBuffers.set(file, buffer);
        pendingBuffers.delete(file);
        return buffer;
      })
      .catch(error => {
        pendingBuffers.delete(file);
        throw error;
      });

    pendingBuffers.set(file, request);
  }

  return pendingBuffers.get(file);
}

// AudioContext hanya memutar isi file, tanpa membuat nada oscillator.
function createSource(buffer, volume, loop = false) {
  const source = audioContext.createBufferSource();
  const gain = audioContext.createGain();
  source.buffer = buffer;
  source.loop = loop;
  gain.gain.value = volume;
  source.connect(gain);
  gain.connect(masterGain);
  source.onended = () => {
    source.disconnect();
    gain.disconnect();
    activeEffects.delete(source);
  };
  source.start();
  return source;
}

// Dipanggil dari klik Mulai / Lanjut / tombol suara agar diizinkan browser.
export function unlockGameAudio() {
  if (!soundEnabled) return Promise.resolve(false);

  const context = getAudioContext();
  if (!context) return Promise.resolve(false);

  for (const { file } of [MUSIC, ...Object.values(SOUNDS)]) {
    void loadBuffer(file).catch(error => {
      console.warn("Audio game belum bisa dimuat:", file, error);
    });
  }

  const resume = context.state === "running"
    ? Promise.resolve()
    : context.resume();

  return resume.then(() => context.state === "running").catch(() => false);
}

export function getGameSoundEnabled() {
  return soundEnabled;
}

function stopMusicSource() {
  // Batalkan juga permintaan musik yang masih menunggu download/decode.
  musicRequest += 1;
  if (musicSource) {
    musicSource.stop();
    musicSource = null;
  }
}

function stopEffects() {
  for (const source of activeEffects) {
    source.stop();
  }
  activeEffects.clear();
}

export function setGameSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);

  try {
    localStorage.setItem(STORAGE_KEY, String(soundEnabled));
  } catch {
    // Tetap bisa dipakai tanpa storage.
  }

  if (masterGain) {
    masterGain.gain.value = soundEnabled ? 0.55 : 0;
  }

  if (!soundEnabled) {
    stopMusicSource();
    stopEffects();
    return;
  }

  if (musicWanted) {
    startGameMusic();
  } else {
    void unlockGameAudio();
  }
}

export function playGameSound(type) {
  const sound = SOUNDS[type];
  if (!soundEnabled || !sound || audioContext?.state !== "running") return;

  const buffer = loadedBuffers.get(sound.file);
  // Jangan menumpuk efek yang terlambat ketika file masih dimuat.
  if (!buffer) return;

  activeEffects.add(createSource(buffer, sound.volume));
}

export function startGameMusic() {
  musicWanted = true;
  const request = ++musicRequest;

  void unlockGameAudio().then(async ready => {
    if (!ready || !musicWanted || request !== musicRequest || musicSource) return;

    try {
      const buffer = await loadBuffer(MUSIC.file);
      if (!soundEnabled || !musicWanted || request !== musicRequest || musicSource) return;

      musicSource = createSource(buffer, MUSIC.volume, true);
    } catch (error) {
      console.warn("Musik game belum bisa diputar:", error);
    }
  });
}

export function stopGameMusic() {
  musicWanted = false;
  stopMusicSource();
}

// Saat keluar dari game, hentikan juga efek yang masih berbunyi.
export function stopGameAudio() {
  stopGameMusic();
  stopEffects();
}
