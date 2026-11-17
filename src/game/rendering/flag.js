
import { FLAG } from "../levels/level1";

export function drawFlagPole(ctx, game) {
  ctx.save();

  // Dasar tiang
  ctx.fillStyle = "#C6A16A";
  ctx.fillRect(
    FLAG.x - 13,
    318,
    26,
    12
  );

  // Tiang putih
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(
    FLAG.x - 4,
    FLAG.top,
    8,
    FLAG.bottom - FLAG.top
  );

  // Bayangan
  ctx.fillStyle = "#E1C9D3";
  ctx.fillRect(
    FLAG.x + 1,
    FLAG.top,
    3,
    FLAG.bottom - FLAG.top
  );

  // Bola di atas tiang
  ctx.beginPath();
  ctx.arc(
    FLAG.x,
    FLAG.top,
    10,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = "#E8C77C";
  ctx.fill();

  // Posisi bendera mengikuti animasi game
  const flagY = game.flagY ?? FLAG.top + 15;

  // Bendera pink
  ctx.fillStyle = "#E88DB3";
  ctx.beginPath();

  ctx.moveTo(FLAG.x - 4, flagY);
  ctx.lineTo(FLAG.x - 54, flagY);
  ctx.lineTo(FLAG.x - 43, flagY + 19);
  ctx.lineTo(FLAG.x - 54, flagY + 38);
  ctx.lineTo(FLAG.x - 4, flagY + 38);

  ctx.closePath();
  ctx.fill();

  // Simbol hati
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "23px Georgia";
  ctx.textAlign = "center";

  ctx.fillText(
    "♡",
    FLAG.x - 29,
    flagY + 27
  );

  ctx.restore();
}
