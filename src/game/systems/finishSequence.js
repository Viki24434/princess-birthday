
import {
  GROUND_Y,
  PLAYER_WIDTH,
  PLAYER_HEIGHT
} from "../constants";

import {
  FLAG,
  FINISH_WALK_X,
  CASTLE_X,
  CASTLE_STAIRS
} from "../levels/level1";

import {
  spawnFirework,
  updateFireworks
} from "../effects/fireworks";

const GROUND_PLAYER_Y = GROUND_Y - PLAYER_HEIGHT;

const PAIR_GAP = 42;
const TOGETHER_SPEED = 2.4;

const MEET_DURATION = 45;
const CELEBRATION_DURATION = 260;

// =====================================
// POSISI KARAKTER DI TANGGA KASTIL
// =====================================

function getCastleStairY(x) {
  const {
    startX,
    endX,
    steps,
    stepHeight
  } = CASTLE_STAIRS;

  const progress = Math.max(
    0,
    Math.min(1, (x - startX) / (endX - startX))
  );

  const currentStep = Math.min(
    steps,
    Math.floor(progress * steps + 0.000001)
  );

  return GROUND_PLAYER_Y - currentStep * stepHeight;
}

// =====================================
// MEMULAI ANIMASI AKHIR
// =====================================

export function beginFinishSequence(game) {
  const player = game.player;

  game.finishStep = "slide";
  game.finishTimer = 0;

  player.x = FLAG.x - PLAYER_WIDTH - 5;
  player.facing = "kanan";
  player.isFlagSliding = true;

  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.onLadder = false;

  game.partner.vx = 0;
}

// =====================================
// UPDATE SELURUH ANIMASI AKHIR
// =====================================

export function updateFinishSequence(game, delta) {
  const player = game.player;
  const partner = game.partner;

  // 1. MELUNCUR DARI TIANG BENDERA
  if (game.finishStep === "slide") {
    game.flagY = Math.min(
      FLAG.bottom - 50,
      game.flagY + 3.6 * delta
    );

    player.x = FLAG.x - PLAYER_WIDTH - 5;
    player.facing = "kanan";
    player.isFlagSliding = true;

    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    player.onLadder = false;

    player.y = Math.min(
      GROUND_PLAYER_Y,
      player.y + 4.2 * delta
    );

    const flagDown =
      game.flagY >= FLAG.bottom - 50;

    const playerDown =
      player.y >= GROUND_PLAYER_Y;

    if (flagDown && playerDown) {
      player.isFlagSliding = false;
      player.onGround = true;
      game.finishStep = "walk";
    }

    return false;
  }

  // 2. BERJALAN MENDEKATI COWOK
  if (game.finishStep === "walk") {
    player.x = Math.min(
      FINISH_WALK_X,
      player.x + 2.8 * delta
    );

    player.y = GROUND_PLAYER_Y;
    player.vx = 2.8;
    player.vy = 0;
    player.onGround = true;
    player.facing = "kanan";

    if (player.x >= FINISH_WALK_X) {
      player.vx = 0;

      game.finishStep = "meet";
      game.finishTimer = 0;
    }

    return false;
  }

  // 3. MEREKA BERTEMU
  if (game.finishStep === "meet") {
    game.finishTimer += delta;

    player.vx = 0;
    partner.vx = 0;

    if (game.finishTimer >= MEET_DURATION) {
      game.finishStep = "together";
    }

    return false;
  }

  // 4. BERJALAN DAN NAIK KASTIL BERSAMA
  if (game.finishStep === "together") {
    player.x = Math.min(
      CASTLE_STAIRS.endX,
      player.x + TOGETHER_SPEED * delta
    );

    // Cowok berada sedikit di depan cewek
    partner.x = player.x + PAIR_GAP;

    // Keduanya naik melalui tangga yang sama
    player.y = getCastleStairY(player.x);
    partner.y = getCastleStairY(partner.x);

    player.vx = TOGETHER_SPEED;
    partner.vx = TOGETHER_SPEED;

    player.vy = 0;
    partner.vy = 0;

    player.onGround = true;
    player.onLadder = false;
    player.facing = "kanan";

    if (player.x >= CASTLE_STAIRS.endX) {
      player.vx = 0;
      partner.vx = 0;

      game.finishStep = "celebrate";
      game.finishTimer = 0;
      game.fireworkClock = 0;

      // Kembang api pembuka
      spawnFirework(
        game.fireworks,
        CASTLE_X + 90,
        55
      );
    }

    return false;
  }

  // 5. KEMBANG API DI ATAS KASTIL
  if (game.finishStep === "celebrate") {
    game.finishTimer += delta;
    game.fireworkClock += delta;

    updateFireworks(game.fireworks, delta);

    // Ledakan baru setiap beberapa frame
    if (game.fireworkClock >= 24) {
      game.fireworkClock = 0;

      const x =
        CASTLE_X - 75 + Math.random() * 270;

      const y =
        20 + Math.random() * 90;

      spawnFirework(game.fireworks, x, y);
    }

    // Setelah beberapa detik, tampilkan
    // halaman kemenangan
    if (game.finishTimer >= CELEBRATION_DURATION) {
      game.finishStep = "done";
      return true;
    }

    return false;
  }

  return game.finishStep === "done";
}
