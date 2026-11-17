
export const platforms = [
  // Tanah utama
  { x: 0, y: 330, w: 480, h: 70 },
  { x: 560, y: 330, w: 420, h: 70 },
  { x: 1070, y: 330, w: 360, h: 70 },
  { x: 1530, y: 330, w: 450, h: 70 },
  { x: 2080, y: 330, w: 370, h: 70 },
  { x: 2530, y: 330, w: 970, h: 70 },

  // Platform melayang
  { x: 220, y: 260, w: 140, h: 16 },
  { x: 720, y: 245, w: 140, h: 16 },
  { x: 1180, y: 220, w: 120, h: 16 },
  { x: 1660, y: 245, w: 150, h: 16 },
  { x: 2190, y: 250, w: 120, h: 16 }
];

// Tangga biasa
export const ladders = [
  { x: 772, y: 245, w: 36, h: 85 },
  { x: 1690, y: 245, w: 36, h: 85 }
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

// Mob yang bergerak bolak-balik
export const enemyTemplates = [
  {
    x: 360, y: 302, w: 30, h: 28,
    minX: 250, maxX: 430,
    speed: 1.2, dir: 1
  },
  {
    x: 820, y: 302, w: 30, h: 28,
    minX: 650, maxX: 930,
    speed: 1.4, dir: -1
  },
  {
    x: 1260, y: 302, w: 30, h: 28,
    minX: 1130, maxX: 1380,
    speed: 1.3, dir: 1
  },
  {
    x: 1760, y: 302, w: 30, h: 28,
    minX: 1590, maxX: 1940,
    speed: 1.5, dir: -1
  },
  {
    x: 2290, y: 302, w: 30, h: 28,
    minX: 2140, maxX: 2410,
    speed: 1.2, dir: 1
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
