
import {
  HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  REQUIRED_HEARTS
} from "../constants";

import {
  heartItems,
  FLAG,
  CHECKPOINTS
} from "../levels/level1";

import { overlaps } from "../engine/collision";
import { isPlayerHit } from "../entities/enemies";

import { playGameSound } from "../audio/gameAudio";

// ====================================
// CHECKPOINT
// ====================================

export function updateCheckpoint(game) {
  const playerX = game.player.x;

  for (const checkpoint of CHECKPOINTS) {
    // Belum melewati checkpoint ini
    if (playerX < checkpoint.x) {
      continue;
    }

    // Sudah pernah diaktifkan
    if (
      (game.checkpoint ?? 0) >=
      checkpoint.respawnX
    ) {
      continue;
    }

    // Simpan posisi respawn terbaru
    game.checkpoint = checkpoint.respawnX;

    playGameSound("checkpoint");

    // Efek visual saat checkpoint aktif
    game.checkpointCelebration = {
      x: checkpoint.x,
      message: checkpoint.message,
      startedAt: performance.now()
    };
  }
}


// ====================================
// JATUH KE JURANG
// ====================================

export function isPlayerInVoid(game) {
  return game.player.y > HEIGHT + 50;
}

// ====================================
// MENGUMPULKAN HATI
// ====================================

export function collectHearts(game) {
  const player = game.player;
  const previousCount = game.collected.size;

  heartItems.forEach((heart, index) => {
    if (game.collected.has(index)) {
      return;
    }

    const nearHeart =
      Math.abs(
        player.x + PLAYER_WIDTH / 2 - heart.x
      ) < 28 &&
      Math.abs(
        player.y + PLAYER_HEIGHT / 2 - heart.y
      ) < 34;

    if (nearHeart) {
      game.collected.add(index);
    }
  });

  // true jika jumlah hati bertambah
  const collectedHeart = game.collected.size !== previousCount;
  if (collectedHeart) {
    playGameSound("heart");
  }
  return collectedHeart;
}

// ====================================
// TABRAKAN DENGAN MOB
// ====================================

export function hasHitEnemy(game) {
  return isPlayerHit(
    game.player,
    game.enemies
  );
}

// ====================================
// MENYENTUH TIANG BENDERA
// ====================================

export function checkFlagContact(game) {
  const player = game.player;

  const playerBox = {
    x: player.x,
    y: player.y,
    w: PLAYER_WIDTH,
    h: PLAYER_HEIGHT
  };

  const flagHitbox = {
    x: FLAG.x - 10,
    y: FLAG.top,
    w: 24,
    h: FLAG.bottom - FLAG.top
  };

  if (!overlaps(playerBox, flagHitbox)) {
    game.warned = false;
    return "none";
  }

  if (game.collected.size >= REQUIRED_HEARTS) {
    return "finish";
  }

  if (!game.warned) {
    game.warned = true;
    return "missing-hearts";
  }

  return "none";
}
