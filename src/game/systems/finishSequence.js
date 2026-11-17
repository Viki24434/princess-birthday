
import {
  GROUND_Y,
  PLAYER_WIDTH,
  PLAYER_HEIGHT
} from "../constants";

import {
  FLAG,
  FINISH_WALK_X,
  CASTLE_X,
  CASTLE_DOOR_X
} from "../levels/level1";

import {
  spawnFirework,
  updateFireworks
} from "../effects/fireworks";

import { playGameSound, stopGameMusic } from "../audio/gameAudio";

const GROUND_PLAYER_Y = GROUND_Y - PLAYER_HEIGHT;

const PAIR_GAP = 36;
const WALK_SPEED = 2.4;

const MEET_DURATION = 45;
const ENTER_DURATION = 50;
const APPEAR_DURATION = 65;
const CELEBRATION_DURATION = 260;

// Titik saat pasangan masuk ke pintu
const DOOR_TARGET_X = CASTLE_DOOR_X - 14;

// Posisi di balkon atas kastil
const BALCONY_PLAYER_X = CASTLE_X + 70;
const BALCONY_PLAYER_Y = 170 - PLAYER_HEIGHT;

function moveTowards(current, target, speed) {
  return current < target
    ? Math.min(current + speed, target)
    : Math.max(current - speed, target);
}

function startStep(game, step) {
  game.finishStep = step;
  game.finishTimer = 0;
}

function setHoldingHands(game, holding) {
  game.player.holdingHands = holding;
  game.partner.holdingHands = holding;
}

function stopPair(game) {
  game.player.vx = 0;
  game.partner.vx = 0;
}

export function beginFinishSequence(game) {
  const player = game.player;

  startStep(game, "slide");

  playGameSound("flag");

  game.coupleOpacity = 1;
  setHoldingHands(game, false);

  player.x = FLAG.x - PLAYER_WIDTH - 5;
  player.facing = "kanan";
  player.isFlagSliding = true;

  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.onLadder = false;

  game.partner.vx = 0;
}

export function updateFinishSequence(game, delta) {
  const player = game.player;
  const partner = game.partner;

  // ==================================
  // 1. TURUN DARI TIANG BENDERA
  // ==================================

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

      startStep(game, "walk");
    }

    return false;
  }

  // ==================================
  // 2. CEWEK MENDEKATI COWOK
  // ==================================

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
      startStep(game, "meet");
    }

    return false;
  }

  // ==================================
  // 3. SALING MENDEKAT
  // ==================================

  if (game.finishStep === "meet") {
    game.finishTimer += delta;

    stopPair(game);

    // Cowok mendekat sedikit agar
    // posisi tangan keduanya sesuai.
    partner.x = moveTowards(
      partner.x,
      player.x + PAIR_GAP,
      1.5 * delta
    );

    if (game.finishTimer >= MEET_DURATION) {
      setHoldingHands(game, true);
      startStep(game, "together");
    }

    return false;
  }

  // ==================================
  // 4. BERJALAN BERSAMA KE PINTU
  // ==================================

  if (game.finishStep === "together") {
    player.x = Math.min(
      DOOR_TARGET_X,
      player.x + WALK_SPEED * delta
    );

    partner.x = player.x + PAIR_GAP;

    player.y = GROUND_PLAYER_Y;
    partner.y = GROUND_PLAYER_Y;

    player.vx = WALK_SPEED;
    partner.vx = WALK_SPEED;

    player.vy = 0;
    partner.vy = 0;

    player.onGround = true;
    player.onLadder = false;
    player.facing = "kanan";
    partner.facing = "kanan";

    if (player.x >= DOOR_TARGET_X) {
      stopPair(game);
      startStep(game, "enter");
    }

    return false;
  }

  // ==================================
  // 5. MASUK PINTU — FADE OUT
  // ==================================

  if (game.finishStep === "enter") {
    game.finishTimer += delta;

    const progress = Math.min(
      game.finishTimer / ENTER_DURATION,
      1
    );

    // Sedikit maju ke dalam pintu
    player.x = DOOR_TARGET_X + progress * 12;
    partner.x = player.x + PAIR_GAP;

    player.y = GROUND_PLAYER_Y;
    partner.y = GROUND_PLAYER_Y;

    player.vx = 1;
    partner.vx = 1;

    // Perlahan menghilang
    game.coupleOpacity = 1 - progress;

    if (progress >= 1) {
      stopPair(game);

      // Pindah posisi saat tidak terlihat
      player.x = BALCONY_PLAYER_X;
      partner.x = BALCONY_PLAYER_X + PAIR_GAP;

      // Awalnya sedikit di bawah balkon
      player.y = BALCONY_PLAYER_Y + 24;
      partner.y = BALCONY_PLAYER_Y + 24;

      player.facing = "depan";
      partner.facing = "depan";

      startStep(game, "appear");
    }

    return false;
  }

  // ==================================
  // 6. MUNCUL DI BALKON — FADE IN
  // ==================================

  if (game.finishStep === "appear") {
    game.finishTimer += delta;

    const progress = Math.min(
      game.finishTimer / APPEAR_DURATION,
      1
    );

    // Gerakan naik lebih lembut
    const eased = 1 - Math.pow(1 - progress, 3);

    player.y =
      BALCONY_PLAYER_Y + 24 * (1 - eased);

    partner.y =
      BALCONY_PLAYER_Y + 24 * (1 - eased);

    game.coupleOpacity = eased;

    stopPair(game);

    if (progress >= 1) {
      game.coupleOpacity = 1;

      player.y = BALCONY_PLAYER_Y;
      partner.y = BALCONY_PLAYER_Y;

      startStep(game, "celebrate");
      game.fireworkClock = 0;

      spawnFirework(
        game.fireworks,
        CASTLE_X + 90,
        55
      );
      player.facing = "depan";
      partner.facing = "depan";
    }

    return false;
  }

  // ==================================
  // 7. KEMBANG API DAN PERAYAAN
  // ==================================

  if (game.finishStep === "celebrate") {
    game.finishTimer += delta;
    game.fireworkClock += delta;

    stopPair(game);
    setHoldingHands(game, true);

    updateFireworks(game.fireworks, delta);

    if (game.fireworkClock >= 24) {
      game.fireworkClock = 0;

      spawnFirework(
        game.fireworks,
        CASTLE_X - 75 + Math.random() * 270,
        20 + Math.random() * 90
      );
    }

    if (
      game.finishTimer >= CELEBRATION_DURATION
    ) {
      playGameSound("win");
      stopGameMusic();

      startStep(game, "done");
      return true;
    }

    return false;
  }

  return game.finishStep === "done";
}
