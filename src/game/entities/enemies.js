
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
    enemy.x += enemy.speed * enemy.dir * delta;

    // Berbalik ketika mencapai batas kiri
    if (enemy.x <= enemy.minX) {
      enemy.x = enemy.minX;
      enemy.dir = 1;
    }

    // Berbalik ketika mencapai batas kanan
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
