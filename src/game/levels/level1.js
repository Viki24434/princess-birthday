

const groundPlatforms = [
  // =====================================
  // TANAH UTAMA — JANGAN HAPUS JURANG
  // =====================================

  { x: 0,    y: 330, w: 480, h: 70 },
  { x: 560,  y: 330, w: 420, h: 70 },
  { x: 1070, y: 330, w: 360, h: 70 },
  { x: 1530, y: 330, w: 450, h: 70 },
  { x: 2080, y: 330, w: 370, h: 70 },
  { x: 2530, y: 330, w: 360, h: 70 },
  { x: 3010, y: 330, w: 310, h: 70 },
  { x: 3460, y: 330, w: 220, h: 70 },
  { x: 3770, y: 330, w: 390, h: 70 },
  { x: 4290, y: 330, w: 300, h: 70 },
  { x: 4700, y: 330, w: 500, h: 70 },
  { x: 5350, y: 330, w: 1150, h: 70 }
];

// Jurang mengikuti data tanah yang juga dipakai untuk collision.
export const gaps = groundPlatforms.slice(1).map((platform, index) => {
  const previous = groundPlatforms[index];
  const x = previous.x + previous.w;
  return { x, w: platform.x - x };
});

export const platforms = [
  ...groundPlatforms,

  // =====================================
  // PLATFORM TENGAH
  // =====================================

  // Area awal — latihan melompat
  { x: 220,  y: 260, w: 140, h: 16 },

  // Area 2
  { x: 720,  y: 245, w: 140, h: 16 },

  // Area 3
  { x: 1180, y: 235, w: 150, h: 16 },

  // Area 4
  { x: 1660, y: 245, w: 150, h: 16 },

  // Area 5
  { x: 2190, y: 250, w: 140, h: 16 },

  // =====================================
  // JALUR ATAS PERTAMA
  // =====================================

  // Platform atas setelah tangga
  { x: 715,  y: 158, w: 200, h: 16 },

  // Jembatan di atas jurang
  { x: 915,  y: 158, w: 230, h: 16 },

  // Platform setelah jembatan
  { x: 1145, y: 158, w: 205, h: 16 },

  // =====================================
  // JALUR ATAS KEDUA
  // =====================================

  // Platform awal
  { x: 1640, y: 160, w: 195, h: 16 },

  // Jembatan panjang, dijaga mob
  { x: 1835, y: 160, w: 245, h: 16 },

  // Platform lanjutan
  { x: 2080, y: 160, w: 170, h: 16 },

  // Platform terakhir sebelum turun
  { x: 2250, y: 160, w: 165, h: 16 },

  // Taman bertingkat: naik lewat pot bunga, lalu turun ke pintu jembatan.
  { x: 2590, y: 278, w: 100, h: 20, kind: "garden" },
  { x: 2740, y: 230, w: 100, h: 20, kind: "garden" },
  { x: 2895, y: 184, w: 110, h: 20, kind: "garden" },
  { x: 3060, y: 240, w: 130, h: 20, kind: "garden" },

  // Jembatan gantung terputus: tiap bentang punya tinggi dan jarak berbeda.
  { x: 3250, y: 172, w: 170, h: 16, kind: "bridge" },
  { x: 3480, y: 205, w: 155, h: 16, kind: "bridge" },
  { x: 3695, y: 164, w: 165, h: 16, kind: "bridge" },
  { x: 3930, y: 225, w: 155, h: 16, kind: "bridge" },

  // Halaman paviliun: pijakan pendek naik, dua menara, lalu turun ke kastil.
  { x: 4280, y: 268, w: 115, h: 20, kind: "garden" },
  { x: 4445, y: 204, w: 115, h: 20, kind: "garden" },
  { x: 4610, y: 140, w: 130, h: 22, kind: "pavilion" },
  { x: 4820, y: 205, w: 140, h: 22, kind: "pavilion" },
  { x: 5040, y: 258, w: 115, h: 20, kind: "garden" }
];



export const ladders = [
  // Tangga menuju jalur atas pertama
  {
    x: 785,
    y: 158,
    w: 36,
    h: 172
  },

  // Tangga untuk naik / turun
  // di ujung jalur atas pertama
  {
    x: 1205,
    y: 158,
    w: 36,
    h: 172
  },

  // Tangga menuju jalur atas kedua
  {
    x: 1705,
    y: 160,
    w: 36,
    h: 170
  },

  // Tangga keluar dari jalur atas kedua
  {
    x: 2215,
    y: 160,
    w: 36,
    h: 170
  },
  { x: 3270, y: 172, w: 36, h: 158 },
  { x: 4000, y: 225, w: 36, h: 105 },
  { x: 4840, y: 205, w: 36, h: 125 }
];


// Tangga balok sebelum bendera
export const END_STAIRS = [
  { x: 5550, y: 298, w: 54, h: 32 },
  { x: 5604, y: 266, w: 54, h: 64 },
  { x: 5658, y: 234, w: 54, h: 96 },
  { x: 5712, y: 202, w: 54, h: 128 },
  { x: 5766, y: 170, w: 54, h: 160 }
];

// Hati yang dikumpulkan
export const heartItems = [
  { x: 130, y: 292 },
  { x: 290, y: 220 },
  { x: 615, y: 292 },
  { x: 780, y: 205 },
  { x: 1195, y: 180 },
  { x: 1705, y: 205 },
  { x: 2220, y: 210 },
  { x: 2635, y: 240 },
  { x: 2785, y: 192 },
  { x: 2945, y: 146 },
  { x: 3125, y: 202 },
  { x: 3310, y: 134 },
  { x: 3540, y: 167 },
  { x: 3775, y: 126 },
  { x: 4010, y: 187 },
  { x: 4340, y: 230 },
  { x: 4500, y: 166 },
  { x: 4670, y: 102 },
  { x: 4890, y: 167 },
  { x: 5100, y: 220 },
  { x: 5420, y: 292 },
  { x: 5730, y: 200 }
];


export const enemyTemplates = [
  // =====================================
  // MOB JALUR BAWAH
  // =====================================

  {
    x: 360,
    y: 302,
    w: 30,
    h: 28,
    minX: 250,
    maxX: 430,
    speed: 1.2,
    dir: 1
  },
  {
    x: 820,
    y: 302,
    w: 30,
    h: 28,
    minX: 650,
    maxX: 930,
    speed: 1.4,
    dir: -1
  },
  {
    x: 1260,
    y: 302,
    w: 30,
    h: 28,
    minX: 1130,
    maxX: 1380,
    speed: 1.3,
    dir: 1
  },
  {
    x: 1760,
    y: 302,
    w: 30,
    h: 28,
    minX: 1590,
    maxX: 1940,
    speed: 1.5,
    dir: -1
  },
  {
    x: 2290,
    y: 302,
    w: 30,
    h: 28,
    minX: 2140,
    maxX: 2410,
    speed: 1.2,
    dir: 1
  },

  // =====================================
  // MOB PENJAGA PLATFORM ATAS
  // =====================================

  // Penjaga jembatan pertama
  {
    x: 970,
    y: 130,
    w: 28,
    h: 28,
    minX: 945,
    maxX: 1100,
    speed: 1.1,
    dir: 1
  },

  // Penjaga jembatan kedua
  {
    x: 1890,
    y: 132,
    w: 28,
    h: 28,
    minX: 1860,
    maxX: 2020,
    speed: 1.2,
    dir: -1
  },

  // Penjaga platform terakhir
  {
    x: 2310,
    y: 132,
    w: 28,
    h: 28,
    minX: 2280,
    maxX: 2380,
    speed: 1.0,
    dir: 1
  },

  // Mob di taman lanjutan, dengan area aman setelah checkpoint.
  { x: 2760, y: 302, w: 30, h: 28, minX: 2710, maxX: 2820, speed: 1.3, dir: 1 },
  { x: 3180, y: 302, w: 30, h: 28, minX: 3130, maxX: 3260, speed: 1.4, dir: -1 },
  { x: 3540, y: 302, w: 30, h: 28, minX: 3500, maxX: 3610, speed: 1.1, dir: 1 },
  { x: 4010, y: 302, w: 30, h: 28, minX: 3910, maxX: 4100, speed: 1.2, dir: -1 },
  { x: 4450, y: 302, w: 30, h: 28, minX: 4380, maxX: 4520, speed: 1.3, dir: 1 },
  { x: 4990, y: 302, w: 30, h: 28, minX: 4860, maxX: 5130, speed: 1.4, dir: -1 },
  { x: 3540, y: 177, w: 28, h: 28, minX: 3500, maxX: 3570, speed: 1.1, dir: 1 },
  { x: 4880, y: 177, w: 28, h: 28, minX: 4850, maxX: 4910, speed: 1.2, dir: -1 }
];


// Tiang bendera — diberi jarak dari tangga
export const FLAG = {
  x: 6010,
  top: 90,
  bottom: 330
};

// Posisi kastil
export const CASTLE_X = 6260;

export const CASTLE_STAIRS = {
  startX: CASTLE_X - 70,
  endX: CASTLE_X + 70,
  steps: 8,
  stepHeight: 20
};


export const CASTLE_DOOR_X = CASTLE_X + 70;

// Cowok menunggu di depan kastil
// Bukan lagi di balkon kastil
export const partner = {
  x: 6140,
  y: 288,
  w: 28,
  h: 42
};

// Posisi cewek berhenti setelah bendera turun
// Berjarak sedikit dari karakter cowok
export const FINISH_WALK_X = 6098;

export const backgroundMemories = [
  {
    x: 350,
    y: 55,
    image: "game/memories/kenangan-1.jpg",
    text: "Masih inget ini? ♡",
    rotation: -0.07
  },
  {
    x: 920,
    y: 70,
    image: "game/memories/kenangan-2.jpg",
    text: "Momen favoritku ♡",
    rotation: 0.05
  },
  {
    x: 1590,
    y: 60,
    image: "game/memories/main-bareng.jpg",
    text: "Waktu kita main ♡",
    rotation: -0.04
  },
  {
    x: 2250,
    y: 65,
    image: "game/memories/kenangan-3.jpg",
    text: "Sama kamu terus ♡",
    rotation: 0.06
  },
  { x: 2900, y: 55, image: "game/memories/kenangan-1.jpg", text: "Pelan-pelan, aku tunggu ♡", rotation: -0.04 },
  { x: 3540, y: 65, image: "game/memories/kenangan-2.jpg", text: "Masih banyak cerita kita ♡", rotation: 0.05 },
  { x: 4310, y: 55, image: "game/memories/main-bareng.jpg", text: "Terima kasih sudah sampai sini ♡", rotation: -0.05 },
  { x: 5100, y: 60, image: "game/memories/kenangan-3.jpg", text: "Sebentar lagi ketemu kamu ♡", rotation: 0.04 }
];


export const CHECKPOINTS = [
  {
    x: 1600,
    respawnX: 1560,
    message: "Yeay, makin dekat sama kamu! ♡"
  },
  {
    x: 2150,
    respawnX: 2100,
    message: "Semangat yaa, sayang! Dikit lagi ♡"
  },
  {
    x: 2660,
    respawnX: 2560,
    message: "Perjalanannya masih lanjut, kamu hebat! ♡"
  },
  { x: 3070, respawnX: 3040, message: "Jembatannya menunggu, pelan-pelan yaa ♡" },
  { x: 3830, respawnX: 3800, message: "Sudah jauh melangkah bareng kamu ♡" },
  { x: 4770, respawnX: 4730, message: "Lewati paviliun, lalu kita bertemu ♡" },
  {
    x: 5400,
    respawnX: 5380,
    message: "Istirahat dulu, setelah ini tangga kastil ♡"
  }
];
