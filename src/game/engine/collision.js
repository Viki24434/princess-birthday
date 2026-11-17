
import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT
} from "../constants";

import {
  platforms,
  END_STAIRS,
  ladders
} from "../levels/level1";

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
  previousBottom
) {
  player.onGround = false;

  const allPlatforms = [
    ...platforms,
    ...END_STAIRS
  ];

  for (const platform of allPlatforms) {
    const crossingTop =
      previousBottom <= platform.y + 6 &&
      player.y + PLAYER_HEIGHT >= platform.y;

    const horizontallyInside =
      player.x + PLAYER_WIDTH > platform.x &&
      player.x < platform.x + platform.w;

    if (
      player.vy >= 0 &&
      crossingTop &&
      horizontallyInside
    ) {
      player.y = platform.y - PLAYER_HEIGHT;
      player.vy = 0;
      player.onGround = true;
    }
  }
}
