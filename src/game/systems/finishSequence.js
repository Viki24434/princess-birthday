
import {
  GROUND_Y,
  PLAYER_WIDTH,
  PLAYER_HEIGHT
} from "../constants";

import {
  FLAG,
  FINISH_WALK_X
} from "../levels/level1";

// =====================================
// MULAI ANIMASI BENDERA
// =====================================

export function beginFinishSequence(game) {
  const player = game.player;

  game.finishStep = "slide";

  // Posisikan karakter di sebelah KIRI tiang
  player.x = FLAG.x - PLAYER_WIDTH - 5;

  // Karakter menghadap ke arah tiang
  player.facing = "kanan";

  // Aktifkan pose memegang tiang
  player.isFlagSliding = true;

  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.onLadder = false;
}

// =====================================
// UPDATE ANIMASI AKHIR
// =====================================

export function updateFinishSequence(game, delta) {
  const player = game.player;

  // TAHAP 1 — MELUNCUR DI TIANG
  if (game.finishStep === "slide") {
    // Bendera turun
    game.flagY = Math.min(
      FLAG.bottom - 50,
      game.flagY + 3.6 * delta
    );

    // Karakter selalu di sisi kiri tiang
    player.x = FLAG.x - PLAYER_WIDTH - 5;
    player.facing = "kanan";
    player.isFlagSliding = true;

    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    player.onLadder = false;

    // Karakter meluncur ke tanah
    player.y = Math.min(
      GROUND_Y - PLAYER_HEIGHT,
      player.y + 4.2 * delta
    );

    const flagDown =
      game.flagY >= FLAG.bottom - 50;

    const playerDown =
      player.y >= GROUND_Y - PLAYER_HEIGHT;

    if (flagDown && playerDown) {
      // Lepaskan pegangan setelah sampai bawah
      player.isFlagSliding = false;
      player.onGround = true;

      game.finishStep = "walk";
    }

    return false;
  }

  // TAHAP 2 — JALAN MENUJU PASANGAN
  if (game.finishStep === "walk") {
    player.isFlagSliding = false;

    player.x = Math.min(
      FINISH_WALK_X,
      player.x + 2.8 * delta
    );

    player.y = GROUND_Y - PLAYER_HEIGHT;
    player.vx = 2.8;
    player.vy = 0;
    player.onGround = true;
    player.facing = "kanan";

    if (player.x >= FINISH_WALK_X) {
      player.vx = 0;
      game.finishStep = "done";

      return true;
    }
  }

  return game.finishStep === "done";
}
