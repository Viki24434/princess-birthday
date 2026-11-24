
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

  const cloudOffset = cameraX * 0.18;
  const firstCloud = Math.floor(cloudOffset / 180) - 1;
  const lastCloud = Math.ceil((cloudOffset + viewportWidth) / 180) + 1;

  for (let i = firstCloud; i <= lastCloud; i++) {
    const x = i * 180 - cloudOffset + 30;
    const y = 65 + ((i % 3 + 3) % 3) * 24;

    drawCloud(ctx, x, y);
  }

  // Bukit belakang — efek parallax
  ctx.fillStyle = "#F4C9DB";

  const hillOffset = cameraX * 0.35;
  const firstHill = Math.floor(hillOffset / 300) - 1;
  const lastHill = Math.ceil((hillOffset + viewportWidth) / 300) + 1;

  for (let i = firstHill; i <= lastHill; i++) {
    const x = i * 300 - hillOffset;

    ctx.beginPath();
    ctx.ellipse(
      x, 390,
      185, 100,
      0, 0, Math.PI * 2
    );
    ctx.fill();
  }
}
