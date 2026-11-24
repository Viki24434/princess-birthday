import { SECRET_AREA } from "../levels/level1";
import { drawHeart } from "./objects";

export function drawMovingPlatforms(ctx, platforms) {
  for (const platform of platforms) {
    const vertical = platform.startY !== platform.targetY;
    ctx.save();
    ctx.strokeStyle = "#C2AC8C";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.moveTo(platform.startX + platform.w / 2, platform.startY + 8);
    ctx.lineTo(platform.targetX + platform.w / 2, platform.targetY + 8);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#C6A364";
    for (const [x, y] of [[platform.startX, platform.startY], [platform.targetX, platform.targetY]]) {
      ctx.beginPath();
      ctx.arc(x + platform.w / 2, y + 8, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = vertical ? "#9DB9A3" : "#C598AE";
    ctx.beginPath();
    ctx.roundRect(platform.x, platform.y, platform.w, platform.h, 5);
    ctx.fill();
    ctx.fillStyle = "#FFF0C5";
    ctx.fillRect(platform.x + 3, platform.y, platform.w - 6, 5);
    ctx.strokeStyle = "#FFF9EB";
    ctx.lineWidth = 2;
    const center = platform.x + platform.w / 2;
    ctx.beginPath();
    if (vertical) {
      ctx.moveTo(center - 4, platform.y + 10);
      ctx.lineTo(center, platform.y + 7);
      ctx.lineTo(center + 4, platform.y + 10);
      ctx.moveTo(center - 4, platform.y + 12);
      ctx.lineTo(center, platform.y + 15);
      ctx.lineTo(center + 4, platform.y + 12);
    } else {
      ctx.moveTo(center - 5, platform.y + 7);
      ctx.lineTo(center - 9, platform.y + 10);
      ctx.lineTo(center - 5, platform.y + 13);
      ctx.moveTo(center + 5, platform.y + 7);
      ctx.lineTo(center + 9, platform.y + 10);
      ctx.lineTo(center + 5, platform.y + 13);
    }
    ctx.stroke();
    ctx.restore();
  }
}

export function drawSecretArea(ctx, game, time) {
  const { x, y } = SECRET_AREA.heart;
  ctx.save();
  ctx.strokeStyle = "#98B69C";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 65, 102);
  ctx.lineTo(x - 65, 63);
  ctx.quadraticCurveTo(x, 2, x + 65, 63);
  ctx.lineTo(x + 65, 102);
  ctx.stroke();
  for (const offset of [-59, -36, 36, 59]) {
    ctx.fillStyle = offset % 2 ? "#E8B1C7" : "#F1D58E";
    ctx.beginPath();
    ctx.arc(x + offset, 48 + Math.abs(offset) * 0.24, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!game.secretFound) {
    const floatY = y + Math.sin(time / 420) * 3;
    const glow = ctx.createRadialGradient(x, floatY, 4, x, floatY, 30);
    glow.addColorStop(0, "#FFE4A6AA");
    glow.addColorStop(1, "#FFE4A600");
    ctx.fillStyle = glow;
    ctx.fillRect(x - 30, floatY - 30, 60, 60);
    drawHeart(ctx, x, floatY, 25, "#DEAD47");
    ctx.fillStyle = "#FFE3A0";
    for (const [sparkX, sparkY] of [[4190, 198], [4220, 151], [4250, 119]]) {
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    drawHeart(ctx, x, y, 13, "#ABC4A5");
  }
  ctx.restore();
}
