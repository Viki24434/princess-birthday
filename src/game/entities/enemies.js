
import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT
} from "../constants";

import { overlaps } from "../engine/collision";

// ====================================
// MENGGERAKKAN MOB
// ====================================

export function updateEnemies(enemies, delta) {
  for (const enemy of enemies) {

    // Pastikan arah mob valid
    if (enemy.dir !== 1 && enemy.dir !== -1) {
      enemy.dir = 1;
    }

    // Pulihkan posisi jika sebelumnya NaN
    if (!Number.isFinite(enemy.x)) {
      enemy.x = enemy.minX;
    }

    // Bergerak horizontal saja.
    // Posisi Y tetap sesuai platform.
    enemy.x += enemy.speed * enemy.dir * delta;

    // Berbalik di batas kiri
    if (enemy.x <= enemy.minX) {
      enemy.x = enemy.minX;
      enemy.dir = 1;
    }

    // Berbalik di batas kanan
    if (enemy.x >= enemy.maxX) {
      enemy.x = enemy.maxX;
      enemy.dir = -1;
    }
  }
}

// ====================================
// TABRAKAN PEMAIN DENGAN MOB
// ====================================

export function isPlayerHit(player, enemies) {
  const playerBox = {
    x: player.x,
    y: player.y,
    w: PLAYER_WIDTH,
    h: PLAYER_HEIGHT
  };

  return enemies.some((enemy) => {
    return overlaps(playerBox, enemy);
  });
}
