
import {
  HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  REQUIRED_HEARTS
} from "../constants";

import {
  heartItems,
  FLAG
} from "../levels/level1";

import { overlaps } from "../engine/collision";
import { isPlayerHit } from "../entities/enemies";

// ====================================
// CHECKPOINT
// ====================================


export function updateCheckpoint(game) {
  const x = game.player.x;

  // Setelah berhasil melewati tangga balok
  if (x > 2850) {
    game.checkpoint = 2850;
  }

  // Setelah melewati bagian mob terakhir
  else if (x > 2150) {
    game.checkpoint = 2100;
  }

  // Checkpoint tengah level
  else if (x > 1600) {
    game.checkpoint = 1560;
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
  return game.collected.size !== previousCount;
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
