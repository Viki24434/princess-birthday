
import {
  GROUND_Y,
  PLAYER_HEIGHT
} from "../constants.js";

import {
  enemyTemplates,
  movingPlatformTemplates,
  FLAG,
  partner
} from "../levels/level1.js";

import { createMovingPlatforms } from "../systems/movingPlatforms.js";

export function createGame() {
  return {

    player: {
    x: 55,
    y: GROUND_Y - PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    onGround: true,
    onLadder: false,
    facing: "kanan",
    holdingHands: false,
    isFlagSliding: false,
    supportingPlatformId: null
    },

    partner: {
    ...partner,
    vx: 0,
    facing: "kiri",
    holdingHands: false
    },
    
    // Tahapan animasi kemenangan
    finishTimer: 0,

    // Partikel kembang api
    fireworks: [],
    fireworkClock: 0,

    checkpoint: 55,
    failureType: null,
    secretFound: false,
    movingPlatforms: createMovingPlatforms(movingPlatformTemplates),
    collected: new Set(),
    warned: false,
    coupleOpacity: 1,

    enemies: enemyTemplates.map((enemy) => ({
      ...enemy,
      defeated: false,
      defeatTimer: 0
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
  player.supportingPlatformId = null;
}
