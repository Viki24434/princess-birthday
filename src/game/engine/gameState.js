
import {
  GROUND_Y,
  PLAYER_HEIGHT
} from "../constants";

import {
  enemyTemplates,
  FLAG,
  partner
} from "../levels/level1";

export function createGame() {
  return {

    // Posisi cowok yang dapat dianimasikan
    partner: {
    ...partner,
    vx: 0
    },

    // Tahapan animasi kemenangan
    finishTimer: 0,

    // Partikel kembang api
    fireworks: [],
    fireworkClock: 0,

    player: {
      x: 55,
      y: GROUND_Y - PLAYER_HEIGHT,
      vx: 0,
      vy: 0,
      onGround: true,
      onLadder: false,
      facing: "kanan"
    },

    checkpoint: 55,
    collected: new Set(),
    warned: false,

    enemies: enemyTemplates.map((enemy) => ({
      ...enemy
    })),

    flagY: FLAG.top + 15,
    finishStep: null
  };
}

// Mengembalikan karakter ke checkpoint terakhir.
// Hati yang sudah dikumpulkan tetap tersimpan.
export function respawnPlayer(game) {
  const player = game.player;

  player.x = game.checkpoint;
  player.y = GROUND_Y - PLAYER_HEIGHT;
  player.vx = 0;
  player.vy = 0;
  player.onGround = true;
  player.onLadder = false;
}
