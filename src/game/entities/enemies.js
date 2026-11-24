
import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT
} from "../constants.js";

import { overlaps } from "../engine/collision.js";

export const STOMP_BOUNCE = -9.5;
export const DEFEAT_DURATION = 18;

// ====================================
// MENGGERAKKAN MOB
// ====================================

export function updateEnemies(enemies, delta) {
  for (const enemy of enemies) {

    if (enemy.defeated) {
      enemy.defeatTimer = (enemy.defeatTimer ?? 0) + delta;
      continue;
    }

    // Pastikan arah mob valid
    if (enemy.dir !== 1 && enemy.dir !== -1) {
      enemy.dir = 1;
    }

    // Pulihkan posisi jika sebelumnya NaN
    if (!Number.isFinite(enemy.x)) {
      enemy.x = enemy.minX;
    }

    enemy.previousX = enemy.x;
    enemy.previousY = enemy.y;

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

function axisTimes(start, size, target, targetSize, movement) {
  if (movement === 0) {
    return start + size > target && start < target + targetSize
      ? { entry: -Infinity, exit: Infinity } : null;
  }
  const first = (target - start - size) / movement;
  const second = (target + targetSize - start) / movement;
  return { entry: Math.min(first, second), exit: Math.max(first, second) };
}

function getContact(player, previous, enemy) {
  const before = { x: previous.x, y: previous.y, w: PLAYER_WIDTH, h: PLAYER_HEIGHT };
  const oldEnemy = { ...enemy, x: enemy.previousX ?? enemy.x, y: enemy.previousY ?? enemy.y };
  if (overlaps(before, oldEnemy)) return { enemy, time: 0, fromAbove: false };

  const dx = player.x - previous.x - (enemy.x - oldEnemy.x);
  const dy = player.y - previous.y - (enemy.y - oldEnemy.y);
  const horizontal = axisTimes(before.x, before.w, oldEnemy.x, enemy.w, dx);
  const vertical = axisTimes(before.y, before.h, oldEnemy.y, enemy.h, dy);
  if (!horizontal || !vertical) return null;
  const time = Math.max(horizontal.entry, vertical.entry);
  const exit = Math.min(horizontal.exit, vertical.exit);
  if (time < 0 || time > 1 || time >= exit) return null;
  return {
    enemy, time,
    fromAbove: dy > 0 && vertical.entry >= horizontal.entry
      && before.y + before.h <= oldEnemy.y + 0.001 && !player.onLadder
  };
}

export function resolveEnemyContact(player, enemies, previousPlayer) {
  const contacts = enemies.filter(enemy => !enemy.defeated)
    .map(enemy => getContact(player, previousPlayer, enemy))
    .filter(Boolean).sort((a, b) => a.time - b.time);
  if (!contacts.length) return { hit: false, stomped: 0 };

  // Selesaikan kontak pertama; pantulan mencegah pemain menabrak mob di bawahnya.
  const first = contacts.filter(contact => Math.abs(contact.time - contacts[0].time) < 0.00001);
  if (first.some(contact => !contact.fromAbove || contact.enemy.kind !== "slime")) {
    return { hit: true, stomped: 0 };
  }

  for (const { enemy } of first) {
    enemy.defeated = true;
    enemy.defeatTimer = 0;
  }
  player.y = Math.min(...first.map(contact => contact.enemy.y)) - PLAYER_HEIGHT;
  player.vy = STOMP_BOUNCE;
  player.onGround = false;
  player.onLadder = false;
  player.supportingPlatformId = null;
  return { hit: false, stomped: first.length };
}
