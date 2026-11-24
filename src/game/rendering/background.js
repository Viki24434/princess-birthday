
import { WIDTH, HEIGHT } from "../constants";

function drawCloud(ctx, x, y) {
  ctx.beginPath();
  ctx.ellipse(x, y, 38, 17, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 18, y - 8, 24, 17, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 18, y - 5, 22, 14, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function drawBackground(ctx, cameraX, viewportWidth = WIDTH) {
  // Langit
  const sky = ctx.createLinearGradient(
    0, 0, 0, HEIGHT
  );

  sky.addColorStop(0, "#FBD8EB");
  sky.addColorStop(1, "#FFF8ED");

  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, viewportWidth, HEIGHT);

  // Awan bergerak lebih lambat daripada pemain
  ctx.fillStyle = "#FFFFFF";

  for (let i = 0; i < 10; i++) {
    const x = i * 180 - cameraX * 0.18 + 30;
    const y = 65 + (i % 3) * 24;

    drawCloud(ctx, x, y);
  }

  // Bukit belakang — efek parallax
  ctx.fillStyle = "#F4C9DB";

  for (let i = 0; i < 12; i++) {
    const x = i * 300 - cameraX * 0.35;

    ctx.beginPath();
    ctx.ellipse(
      x, 390,
      185, 100,
      0, 0, Math.PI * 2
    );
    ctx.fill();
  }
}
