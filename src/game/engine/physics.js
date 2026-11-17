
import {
  WORLD_WIDTH,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  JUMP_FORCE,
  GRAVITY,
  MAX_FALL_SPEED
} from "../constants";

import {
  getLadderForPlayer,
  resolveStairCollision,
  resolvePlatformCollision
} from "./collision";

// Membatasi angka supaya berada di
// dalam rentang minimum dan maksimum.
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ====================================
// GERAKAN PEMAIN
// ====================================

export function updatePlayer(
  player,
  controls,
  delta
) {
  // Gerak horizontal
  player.vx = controls.right
    ? PLAYER_SPEED
    : controls.left
      ? -PLAYER_SPEED
      : 0;

  // Menyimpan arah terakhir
  if (player.vx > 0) {
    player.facing = "kanan";
  } else if (player.vx < 0) {
    player.facing = "kiri";
  }

  // ====================================
  // SISTEM TANGGA
  // ====================================


    const ladder = getLadderForPlayer(player);

    const wantsLadder =
    ladder && (controls.up || controls.down);

    // ====================================
    // PANAH ATAS: LOMPAT / NAIK TANGGA
    // ====================================

    // Reset ketika tombol atas dilepaskan
    if (!controls.up) {
    controls.upJumpHandled = false;
    }

    // Proses sekali setiap tombol atas ditekan
    if (controls.up && !controls.upJumpHandled) {
    controls.upJumpHandled = true;

    // Jika tidak dekat tangga,
    // panah atas digunakan untuk melompat
    if (
        !ladder &&
        !player.onLadder &&
        player.onGround
    ) {
        controls.jump = true;
    }
    }


  if (wantsLadder && !player.onLadder) {
    player.onLadder = true;
    player.onGround = false;
    player.vy = 0;

    // Posisikan pemain di tengah tangga
    player.x =
      ladder.x +
      ladder.w / 2 -
      PLAYER_WIDTH / 2;
  }

  if (player.onLadder) {
    const activeLadder =
      getLadderForPlayer(player);

    if (!activeLadder) {
      player.onLadder = false;
    } else {
      player.vy = 0;

      // Naik tangga
      if (controls.up) {
        player.y -= 3.4 * delta;
      }

      // Turun tangga
      if (controls.down) {
        player.y += 3.4 * delta;
      }

      // Bergerak sedikit ke samping
      player.x += player.vx * 0.45 * delta;

      player.x = clamp(
        player.x,
        0,
        WORLD_WIDTH - PLAYER_WIDTH
      );

      const topLimit =
        activeLadder.y - PLAYER_HEIGHT + 6;

      const bottomLimit =
        activeLadder.y +
        activeLadder.h -
        PLAYER_HEIGHT;

      player.y = clamp(
        player.y,
        topLimit,
        bottomLimit
      );

      // Bisa melompat keluar dari tangga
      if (controls.jump) {
        player.onLadder = false;
        player.vy = -11;
      }
    }
  }

  // ====================================
  // LOMPAT DAN GRAVITASI
  // ====================================

  if (!player.onLadder) {
    if (controls.jump && player.onGround) {
      player.vy = JUMP_FORCE;
      player.onGround = false;
    }

    // Simpan posisi sebelumnya
    const previousX = player.x;

    const previousBottom =
      player.y + PLAYER_HEIGHT;

    // Gravitasi
    player.vy = Math.min(
      player.vy + GRAVITY * delta,
      MAX_FALL_SPEED
    );

    // Gerakkan pemain
    player.x += player.vx * delta;
    player.y += player.vy * delta;

    // Batas dunia
    player.x = clamp(
      player.x,
      0,
      WORLD_WIDTH - PLAYER_WIDTH
    );

    // Collision samping tangga balok
    resolveStairCollision(
      player,
      previousX,
      previousBottom
    );

    // Collision tanah dan platform
    resolvePlatformCollision(
      player,
      previousBottom
    );
  }

  // Lompat diproses sekali per tekanan
  controls.jump = false;
}
