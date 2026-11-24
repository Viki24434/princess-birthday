
import {
  WORLD_WIDTH,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  JUMP_FORCE,
  GRAVITY,
  MAX_FALL_SPEED
} from "../constants.js";

import {
  getLadderForPlayer,
  resolveStairCollision,
  resolvePlatformCollision
} from "./collision.js";
import { carryPlayerOnPlatform } from "../systems/movingPlatforms.js";

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
  delta,
  movingPlatforms = []
) {
  carryPlayerOnPlatform(player, movingPlatforms);
  // ====================================
  // 1. GERAK HORIZONTAL
  // ====================================

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
  // 2. DETEKSI TANGGA
  // ====================================

  // Cek posisi karakter sekarang
  let ladder = getLadderForPlayer(player);

  // FIX:
  // Saat berdiri tepat di atas tangga,
  // collision kadang belum mendeteksi
  // bagian tangga di bawah kaki.
  //
  // Kita cek sedikit lebih bawah
  // agar tombol ↓ langsung berfungsi.
  if (!ladder && controls.down) {
    const probePlayer = {
      ...player,
      y: player.y + 14
    };

    ladder = getLadderForPlayer(probePlayer);
  }

  const wantsUp = controls.up && !controls.down;
  const wantsDown = controls.down && !controls.up;
  const atLadderTop = !!ladder && player.y + PLAYER_HEIGHT <= ladder.y + 0.5;

  // Di puncak, pemain sudah berdiri di platform, bukan masih memanjat.
  if (atLadderTop && player.onLadder && !wantsDown) {
    player.y = ladder.y - PLAYER_HEIGHT;
    player.onLadder = false;
    player.onGround = true;
    player.vy = 0;
  }

  const wantsLadder = !!ladder && (wantsDown || (wantsUp && !atLadderTop));
  // Jangan menangkap tangga lagi selama pemain sedang melompat naik.
  const canGrabLadder = player.onGround || player.vy >= 0;

  // ====================================
  // 3. PANAH ATAS: LOMPAT / NAIK
  // ====================================

  // Reset ketika tombol ↑ dilepaskan
  if (!controls.up) {
    controls.upJumpHandled = false;
  }

  // Sekali untuk setiap tekanan ↑
  if (
    controls.up &&
    !controls.upJumpHandled
  ) {
    controls.upJumpHandled = true;

    // Di atas platform, termasuk ujung atas tangga, ↑ berarti melompat.
    if (
      !controls.down &&
      (!ladder || atLadderTop) &&
      !player.onLadder &&
      player.onGround
    ) {
      controls.jump = true;
    }
  }

  // ====================================
  // 4. MELOMPAT KELUAR DARI TANGGA
  // ====================================

  if (
    player.onLadder &&
    controls.jump
  ) {
    player.onLadder = false;
    player.onGround = false;
    player.vy = JUMP_FORCE;
  }

  // ====================================
  // 5. MASUK KE TANGGA
  // ====================================

  if (
    wantsLadder &&
    canGrabLadder &&
    !player.onLadder &&
    !controls.jump
  ) {
    const ladderBottom =
      ladder.y + ladder.h;

    const playerFeet =
      player.y + PLAYER_HEIGHT;

    const atLadderBottom =
      playerFeet >= ladderBottom - 0.5;

    // Dari bawah boleh naik.
    // Dari atas boleh langsung turun.
    //
    // Jangan masuk lagi ke tangga
    // kalau sudah sampai bawah
    // dan hanya menekan ↓.
    if (!atLadderBottom || controls.up) {
      player.onLadder = true;
      player.supportingPlatformId = null;
      player.onGround = false;

      player.vx = 0;
      player.vy = 0;

      // Sejajarkan dengan tangga
      player.x =
        ladder.x +
        (ladder.w - PLAYER_WIDTH) / 2;
    }
  }

  // ====================================
  // 6. PERGERAKAN DI TANGGA
  // ====================================

  if (player.onLadder) {
    const activeLadder =
      getLadderForPlayer(player) ||
      ladder;

    if (!activeLadder) {
      // Keluar jika tidak lagi
      // berada di sekitar tangga
      player.onLadder = false;
      player.onGround = false;

    } else {
      const climbSpeed = 3.4;

      const topLimit =
        activeLadder.y - PLAYER_HEIGHT;

      const bottomLimit =
        activeLadder.y +
        activeLadder.h -
        PLAYER_HEIGHT;

      // ====================================
      // KELUAR TANGGA DENGAN ← / →
      // ====================================

      const movingSideways =
        controls.left || controls.right;

      const movingVertically =
        controls.up || controls.down;

      if (
        movingSideways &&
        !movingVertically
      ) {
        player.onLadder = false;
        player.onGround = false;

      } else {
        // ====================================
        // TETAP DI TENGAH TANGGA
        // ====================================

        player.x =
          activeLadder.x +
          (activeLadder.w - PLAYER_WIDTH) / 2;

        player.vx = 0;
        player.vy = 0;
        player.onGround = false;

        // ====================================
        // NAIK
        // ====================================

        if (
          controls.up &&
          !controls.down
        ) {
          player.y -= climbSpeed * delta;
        }

        // ====================================
        // TURUN
        // ====================================

        else if (
          controls.down &&
          !controls.up
        ) {
          player.y += climbSpeed * delta;
        }

        // Batasi posisi atas dan bawah
        player.y = clamp(
          player.y,
          topLimit,
          bottomLimit
        );

        // Selesai memanjat tanpa melompat otomatis saat ↑ masih ditahan.
        if (!wantsDown && player.y <= topLimit + 0.5) {
          player.y = topLimit;
          player.vy = 0;
          player.onLadder = false;
          player.onGround = true;
        }

        // ====================================
        // SAMPAI DI BAWAH TANGGA
        // ====================================

        if (
          controls.down &&
          player.y >= bottomLimit - 0.5
        ) {
          player.y = bottomLimit;
          player.vy = 0;

          player.onLadder = false;
          player.onGround = true;
        }

        // ====================================
        // PENTING:
        // Lewati gravitasi dan collision
        // selama masih menggunakan tangga.
        // ====================================

        controls.jump = false;
        return;
      }
    }
  }

  // ====================================
  // 7. LOMPAT DAN GRAVITASI NORMAL
  // ====================================

  if (!player.onLadder) {
    // Melompat dari tanah / platform
    if (
      controls.jump &&
      player.onGround
    ) {
      player.vy = JUMP_FORCE;
      player.onGround = false;
    }

    // Simpan posisi sebelum bergerak
    const previousX = player.x;

    const previousBottom =
      player.y + PLAYER_HEIGHT;

    // Gravitasi
    player.vy = Math.min(
      player.vy + GRAVITY * delta,
      MAX_FALL_SPEED
    );

    // Gerakkan karakter
    player.x += player.vx * delta;
    player.y += player.vy * delta;

    // Batas dunia
    player.x = clamp(
      player.x,
      0,
      WORLD_WIDTH - PLAYER_WIDTH
    );

    // Collision tangga balok
    resolveStairCollision(
      player,
      previousX,
      previousBottom
    );

    // Collision tanah dan platform
    resolvePlatformCollision(
      player,
      previousBottom,
      movingPlatforms
    );
  }

  // ====================================
  // 8. RESET TOMBOL LOMPAT
  // ====================================

  controls.jump = false;
}

