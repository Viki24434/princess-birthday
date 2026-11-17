
import { GROUND_Y } from "../constants";

import {
  platforms,
  ladders,
  END_STAIRS
} from "../levels/level1";

import { drawHeart } from "./objects";

// =====================================
// TANAH DAN PLATFORM
// =====================================

function drawPlatforms(ctx) {
  for (const platform of platforms) {
    ctx.fillStyle = "#D9A9B8";
    ctx.fillRect(
      platform.x,
      platform.y,
      platform.w,
      platform.h
    );

    // Permukaan
    ctx.fillStyle = "#F9D4E0";
    ctx.fillRect(
      platform.x,
      platform.y,
      platform.w,
      10
    );

    // Detail
    ctx.fillStyle = "#FFFFFF";

    for (
      let x = platform.x + 12;
      x < platform.x + platform.w - 5;
      x += 37
    ) {
      ctx.fillRect(
        x,
        platform.y + 5,
        12,
        3
      );
    }
  }
}

// =====================================
// JURANG
// =====================================

function drawGaps(ctx) {
  const gaps = [
    { x: 480, w: 80 },
    { x: 980, w: 90 },
    { x: 1430, w: 100 },
    { x: 1980, w: 100 },
    { x: 2450, w: 80 }
  ];

  gaps.forEach((gap) => {
    ctx.fillStyle = "#7C5468";
    ctx.fillRect(gap.x, GROUND_Y, gap.w, 70);

    ctx.fillStyle = "#5E3B4B";
    ctx.fillRect(
      gap.x + 8,
      GROUND_Y,
      gap.w - 16,
      70
    );
  });
}

// =====================================
// BUNGA DEKORASI DI TANAH
// =====================================

function drawGroundFlowers(ctx) {
  for (let x = 90; x < 3100; x += 170) {
    ctx.strokeStyle = "#92B99B";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(x, GROUND_Y);
    ctx.lineTo(x, GROUND_Y - 18);
    ctx.stroke();

    drawHeart(
      ctx,
      x,
      GROUND_Y - 23,
      12,
      "#FFFFFF"
    );
  }
}

// =====================================
// TANGGA KAYU
// =====================================

function drawLadder(ctx, ladder) {
  ctx.fillStyle = "#E8C895";
  ctx.fillRect(
    ladder.x,
    ladder.y,
    ladder.w,
    ladder.h
  );

  ctx.fillStyle = "#C79E63";
  ctx.fillRect(
    ladder.x + 4,
    ladder.y,
    5,
    ladder.h
  );

  ctx.fillRect(
    ladder.x + ladder.w - 9,
    ladder.y,
    5,
    ladder.h
  );

  for (
    let y = ladder.y + 10;
    y < ladder.y + ladder.h - 4;
    y += 14
  ) {
    ctx.fillRect(
      ladder.x + 5,
      y,
      ladder.w - 10,
      4
    );
  }
}

// =====================================
// TANGGA BALOK MENUJU BENDERA
// =====================================

function drawEndStairs(ctx) {
  END_STAIRS.forEach((block) => {
    for (
      let y = block.y;
      y < GROUND_Y;
      y += 32
    ) {
      // Balok utama
      ctx.fillStyle = "#D795AF";
      ctx.fillRect(
        block.x,
        y,
        block.w,
        32
      );

      // Garis antarbalok
      ctx.strokeStyle = "#A85F80";
      ctx.lineWidth = 2;

      ctx.strokeRect(
        block.x + 1,
        y + 1,
        block.w - 2,
        30
      );

      // Highlight
      ctx.fillStyle = "#F9D8E5";
      ctx.fillRect(
        block.x + 5,
        y + 5,
        block.w - 10,
        4
      );

      // Detail balok
      ctx.fillStyle = "#EAB6CB";
      ctx.fillRect(block.x + 10, y + 17, 12, 5);
      ctx.fillRect(block.x + 32, y + 17, 9, 5);
    }
  });
}

// =====================================
// RENDER SEMUA TANAH
// =====================================

export function drawTerrain(ctx) {
  drawPlatforms(ctx);
  drawEndStairs(ctx);
  drawGaps(ctx);
  drawGroundFlowers(ctx);

  ladders.forEach((ladder) => {
    drawLadder(ctx, ladder);
  });
}
