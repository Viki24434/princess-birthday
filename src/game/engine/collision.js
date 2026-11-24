
import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT
} from "../constants.js";

import {
  platforms,
  END_STAIRS,
  ladders
} from "../levels/level1.js";

// Mengecek apakah dua objek saling bersentuhan
export function overlaps(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// Mencari tangga yang bisa dinaiki pemain

export function getLadderForPlayer(player) {
  const centerX = player.x + PLAYER_WIDTH / 2;
  const feetY = player.y + PLAYER_HEIGHT;

  const horizontalTolerance = 12;
  const topTolerance = 14;

  return ladders.find((ladder) => {
    const left = ladder.x - horizontalTolerance;
    const right =
      ladder.x + ladder.w + horizontalTolerance;

    const top = ladder.y - topTolerance;
    const bottom = ladder.y + ladder.h + 4;

    const alignedHorizontally =
      centerX >= left && centerX <= right;

    // Kaki boleh tepat di atas ujung tangga.
    // Tidak harus masuk dulu ke area tangga.
    const alignedVertically =
      feetY >= top && player.y <= bottom;

    return alignedHorizontally && alignedVertically;
  }) ?? null;
}


// Menghalangi pemain menembus tangga balok
// dari samping.
export function resolveStairCollision(
  player,
  previousX,
  previousBottom
) {
  for (const stair of END_STAIRS) {
    const verticalOverlap =
      player.y + PLAYER_HEIGHT > stair.y + 2 &&
      player.y < stair.y + stair.h;

    const landingFromAbove =
      previousBottom <= stair.y + 6 &&
      player.vy >= 0;

    if (!verticalOverlap || landingFromAbove) {
      continue;
    }

    // Menabrak dari kiri
    if (
      player.vx > 0 &&
      previousX + PLAYER_WIDTH <= stair.x + 2 &&
      player.x + PLAYER_WIDTH > stair.x
    ) {
      player.x = stair.x - PLAYER_WIDTH;
      player.vx = 0;
    }

    // Menabrak dari kanan
    if (
      player.vx < 0 &&
      previousX >= stair.x + stair.w - 2 &&
      player.x < stair.x + stair.w
    ) {
      player.x = stair.x + stair.w;
      player.vx = 0;
    }
  }
}

// Mengatur pendaratan pemain di permukaan
// tanah, platform, dan tangga balok.
export function resolvePlatformCollision(
  player,
  previousBottom,
  movingPlatforms = []
) {
  const previousSupport = player.supportingPlatformId;
  const currentBottom = player.y + PLAYER_HEIGHT;
  player.onGround = false;
  player.supportingPlatformId = null;

  const allPlatforms = [
    ...platforms,
    ...END_STAIRS,
    ...movingPlatforms
  ];

  let landing = null;

  for (const platform of allPlatforms) {
    // Pemain yang sudah dibawa platform memakai posisi atas terbaru.
    // Pendaratan baru memakai posisi platform sebelum dan sesudah bergerak.
    const previousTop = platform.id && platform.id !== previousSupport
      ? platform.previousY : platform.y;
    const relativeFall = currentBottom - previousBottom - (platform.y - previousTop);
    const crossingTop = previousBottom <= previousTop + 6 && currentBottom >= platform.y;

    const horizontallyInside =
      player.x + PLAYER_WIDTH > platform.x &&
      player.x < platform.x + platform.w;

    if (
      relativeFall >= -0.001 &&
      crossingTop &&
      horizontallyInside
    ) {
      if (!landing || platform.y < landing.y) landing = platform;
    }
  }

  if (landing) {
    player.y = landing.y - PLAYER_HEIGHT;
    player.vy = 0;
    player.onGround = true;
    player.supportingPlatformId = landing.id ?? null;
  }
}
