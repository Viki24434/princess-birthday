
import { GROUND_Y } from "../constants";

import {
  platforms,
  ladders,
  END_STAIRS,
  gaps,
  CASTLE_X
} from "../levels/level1";

import { drawHeart } from "./objects";

// =====================================
// TANAH DAN PLATFORM
// =====================================

function drawGardenPlatform(ctx, platform) {
  const { x, y, w, h } = platform;
  ctx.fillStyle = "#D1ADA1";
  ctx.fillRect(x + 6, y + 6, w - 12, h);
  ctx.fillStyle = "#FFF0D5";
  ctx.fillRect(x, y, w, 10);
  ctx.fillStyle = "#93B6A0";
  ctx.fillRect(x + 3, y, w - 6, 5);

  // Daun menjuntai di bawah pot bunga tanpa menutup permukaan pijakan.
  for (let leafX = x + 14; leafX < x + w - 6; leafX += 23) {
    ctx.strokeStyle = "#719D83";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leafX, y + h - 2);
    ctx.quadraticCurveTo(leafX - 7, y + h + 12, leafX + 3, y + h + 18);
    ctx.stroke();
    ctx.fillStyle = "#A1C7A7";
    ctx.beginPath();
    ctx.ellipse(leafX - 2, y + h + 8, 5, 3, -0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const flowerX of [x + 12, x + w - 12]) {
    ctx.fillStyle = "#ED9CB7";
    ctx.beginPath();
    ctx.arc(flowerX, y - 5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFE6A8";
    ctx.beginPath();
    ctx.arc(flowerX, y - 5, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBridgePlatform(ctx, platform) {
  const { x, y, w, h } = platform;
  // Pagar tali berada di belakang pemain; celah antarbentang tetap terbuka.
  ctx.strokeStyle = "#B59473";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 7, y - 27);
  ctx.quadraticCurveTo(x + w / 2, y - 7, x + w - 7, y - 27);
  ctx.stroke();
  for (const postX of [x + 5, x + w - 10]) {
    ctx.fillStyle = "#B59473";
    ctx.fillRect(postX, y - 30, 5, 34);
    ctx.fillStyle = "#FFE7B1";
    ctx.beginPath();
    ctx.arc(postX + 2.5, y - 30, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#B8967C";
  ctx.fillRect(x, y + 5, w, h - 5);
  for (let plankX = x; plankX < x + w; plankX += 18) {
    ctx.fillStyle = "#EAD0A9";
    ctx.fillRect(plankX, y, Math.min(16, x + w - plankX), 9);
  }
  for (let ribbonX = x + 20, index = 0; ribbonX < x + w - 10; ribbonX += 30, index++) {
    ctx.fillStyle = index % 2 ? "#ACB8D8" : "#E6A5BE";
    ctx.beginPath();
    ctx.moveTo(ribbonX, y + h);
    ctx.lineTo(ribbonX + 14, y + h);
    ctx.lineTo(ribbonX + 7, y + h + 16);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPavilionPlatform(ctx, platform) {
  const { x, y, w, h } = platform;
  // Kolom tipis dan lengkungan terbuka menyisakan jalan di bawah paviliun.
  ctx.fillStyle = "#C3B3D3";
  for (const columnX of [x + 10, x + w - 22]) {
    ctx.fillRect(columnX, y + h, 12, GROUND_Y - y - h);
    ctx.fillStyle = "#EFE4F1";
    ctx.fillRect(columnX + 3, y + h, 4, GROUND_Y - y - h);
    ctx.fillStyle = "#C3B3D3";
  }
  ctx.strokeStyle = "#C3B3D3";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(x + 16, y + h + 55);
  ctx.quadraticCurveTo(x + w / 2, y + h - 14, x + w - 16, y + h + 55);
  ctx.stroke();
  ctx.fillStyle = "#B59BC5";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#F4E4F0";
  ctx.fillRect(x - 4, y, w + 8, 7);
  ctx.fillStyle = "#E1C080";
  ctx.fillRect(x + 4, y + h - 5, w - 8, 3);
  for (let tileX = x + 14; tileX < x + w - 5; tileX += 24) {
    ctx.fillStyle = "#E5CCDF";
    ctx.fillRect(tileX, y + 11, 10, 5);
  }
}

function drawPlatforms(ctx) {
  for (const platform of platforms) {
    if (platform.kind === "garden") {
      drawGardenPlatform(ctx, platform);
      continue;
    }
    if (platform.kind === "bridge") {
      drawBridgePlatform(ctx, platform);
      continue;
    }
    if (platform.kind === "pavilion") {
      drawPavilionPlatform(ctx, platform);
      continue;
    }

    const palette = platform.x < 2530 ? ["#D9A9B8", "#F9D4E0"]
      : platform.x < 3250 ? ["#B6C5B2", "#DDE9CC"]
        : platform.x < 4290 ? ["#CFB89D", "#F3DFC3"]
          : ["#BDB0CE", "#E9DDF1"];
    ctx.fillStyle = palette[0];
    ctx.fillRect(
      platform.x,
      platform.y,
      platform.w,
      platform.h
    );

    // Permukaan
    ctx.fillStyle = palette[1];
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
  for (let x = 90; x < CASTLE_X - 160; x += 170) {
    if (!platforms.some(platform => platform.y === GROUND_Y && x >= platform.x + 8 && x < platform.x + platform.w - 8)) continue;
    if (END_STAIRS.some(stair => x >= stair.x && x <= stair.x + stair.w)) continue;
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
