
import {
  GROUND_Y,
  PLAYER_HEIGHT
} from "../constants";

import {
  FLAG,
  CASTLE_DOOR_X
} from "../levels/level1";

// Memulai animasi akhir level
export function beginFinishSequence(game) {
  game.finishStep = "slide";

  game.player.vx = 0;
  game.player.vy = 0;
}

// Mengembalikan true saat animasi selesai
export function updateFinishSequence(game, delta) {
  const player = game.player;

  // ====================================
  // TAHAP 1: BENDERA TURUN
  // ====================================

  if (game.finishStep === "slide") {
    game.flagY = Math.min(
      FLAG.bottom - 50,
      game.flagY + 3.6 * delta
    );

    player.x = FLAG.x + 7;
    player.vx = 0;
    player.vy = 0;
    player.onLadder = false;
    player.facing = "kanan";

    player.y = Math.min(
      GROUND_Y - PLAYER_HEIGHT,
      player.y + 4.2 * delta
    );

    const flagDown =
      game.flagY >= FLAG.bottom - 50;

    const playerDown =
      player.y >= GROUND_Y - PLAYER_HEIGHT;

    if (flagDown && playerDown) {
      player.onGround = true;
      game.finishStep = "walk";
    }

    return false;
  }

  // ====================================
  // TAHAP 2: JALAN MENUJU KASTIL
  // ====================================

  if (game.finishStep === "walk") {
    player.x = Math.min(
      CASTLE_DOOR_X,
      player.x + 2.8 * delta
    );

    player.y = GROUND_Y - PLAYER_HEIGHT;
    player.vx = 2.8;
    player.vy = 0;
    player.onGround = true;
    player.facing = "kanan";

    if (player.x >= CASTLE_DOOR_X) {
      player.vx = 0;
      game.finishStep = "done";
      return true;
    }
  }

  return game.finishStep === "done";
}
