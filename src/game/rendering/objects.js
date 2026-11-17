
import { heartItems } from "../levels/level1";

// =====================================
// BENTUK HATI
// =====================================

export function drawHeart(
  ctx,
  x,
  y,
  size = 20,
  color = "#E774A4"
) {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(size / 20, size / 20);

  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.bezierCurveTo(-18, -2, -9, -15, 0, -7);
  ctx.bezierCurveTo(9, -15, 18, -2, 0, 8);

  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

// =====================================
// HATI YANG DIKUMPULKAN
// =====================================

export function drawCollectibles(ctx, game, time) {
  heartItems.forEach((heart, index) => {
    if (game.collected.has(index)) {
      return;
    }

    const floatY =
      Math.sin(time / 350 + index) * 4;

    drawHeart(
      ctx,
      heart.x,
      heart.y + floatY,
      24,
      "#E774A4"
    );
  });
}

// =====================================
// MOB BERGERAK
// =====================================

export function drawEnemies(ctx, enemies) {
  enemies.forEach((enemy) => {
    const x = enemy.x;
    const y = enemy.y;

    // Tubuh
    ctx.fillStyle = "#A889BD";
    ctx.beginPath();
    ctx.ellipse(
      x + 15,
      y + 16,
      15,
      12,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Mata
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x + 7, y + 12, 5, 5);
    ctx.fillRect(x + 18, y + 12, 5, 5);

    // Pupil
    ctx.fillStyle = "#6F547E";
    ctx.fillRect(x + 9, y + 14, 2, 3);
    ctx.fillRect(x + 20, y + 14, 2, 3);

    // Kaki
    ctx.fillRect(x + 5, y + 26, 6, 2);
    ctx.fillRect(x + 19, y + 26, 6, 2);
  });
}
