

export const platforms = [
  // =====================================
  // TANAH UTAMA — JANGAN HAPUS JURANG
  // =====================================

  { x: 0,    y: 330, w: 480, h: 70 },
  { x: 560,  y: 330, w: 420, h: 70 },
  { x: 1070, y: 330, w: 360, h: 70 },
  { x: 1530, y: 330, w: 450, h: 70 },
  { x: 2080, y: 330, w: 370, h: 70 },
  { x: 2530, y: 330, w: 970, h: 70 },

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
  { x: 2250, y: 160, w: 165, h: 16 }
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
  }
];


// Tangga balok sebelum bendera
export const END_STAIRS = [
  { x: 2550, y: 298, w: 54, h: 32 },
  { x: 2604, y: 266, w: 54, h: 64 },
  { x: 2658, y: 234, w: 54, h: 96 },
  { x: 2712, y: 202, w: 54, h: 128 },
  { x: 2766, y: 170, w: 54, h: 160 }
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
  { x: 2730, y: 200 }
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
  }
];


// Tiang bendera — diberi jarak dari tangga
export const FLAG = {
  x: 3010,
  top: 90,
  bottom: 330
};

// Posisi kastil
export const CASTLE_X = 3260;

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
  x: 3140,
  y: 288,
  w: 28,
  h: 42
};

// Posisi cewek berhenti setelah bendera turun
// Berjarak sedikit dari karakter cowok
export const FINISH_WALK_X = 3098;

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
  }
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
    x: 2850,
    respawnX: 2850,
    message: "Akhirnya kastilnya udah dekat! ♡"
  }
];
