
import { GROUND_Y } from "../constants";
import { CHECKPOINTS } from "../levels/level1";

const POLE_HEIGHT = 76;
const MESSAGE_DURATION = 2200;

// ====================================
// GAMBAR SATU CHECKPOINT
// ====================================

function drawCheckpoint(ctx, checkpoint, active, time) {
  const x = checkpoint.x;
  const groundY = GROUND_Y;

  const topY = groundY - POLE_HEIGHT;
  const pulse = Math.sin(time / 230);

  ctx.save();

  // Cahaya saat checkpoint aktif
  if (active) {
    const glowRadius = 22 + pulse * 3;

    const gradient = ctx.createRadialGradient(
      x,
      topY + 13,
      3,
      x,
      topY + 13,
      glowRadius
    );

    gradient.addColorStop(
      0,
      "rgba(255, 181, 211, 0.45)"
    );

    gradient.addColorStop(
      1,
      "rgba(255, 181, 211, 0)"
    );

    ctx.fillStyle = gradient;
    ctx.beginPath();

    ctx.arc(
      x,
      topY + 13,
      glowRadius,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  // Tiang bendera
  ctx.strokeStyle = active
    ? "#D78BAA"
    : "#A89BA7";

  ctx.lineWidth = 4;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(x, groundY);
  ctx.lineTo(x, topY);
  ctx.stroke();

  // Bendera
  ctx.fillStyle = active
    ? "#F17BAC"
    : "#C9BCC5";

  ctx.beginPath();

  ctx.moveTo(x, topY + 4);
  ctx.lineTo(x + 38, topY + 9);
  ctx.lineTo(x + 29, topY + 23);
  ctx.lineTo(x + 38, topY + 37);
  ctx.lineTo(x, topY + 33);

  ctx.closePath();
  ctx.fill();

  // Simbol hati
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 23px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("♥", x + 18, topY + 21);

  // Bulatan di puncak tiang
  ctx.fillStyle = active
    ? "#FFD166"
    : "#DDD3DD";

  ctx.beginPath();
  ctx.arc(x, topY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Kilauan kecil
  if (active) {
    const sparkleAlpha = 0.5 + (pulse + 1) * 0.25;

    ctx.globalAlpha = sparkleAlpha;
    ctx.fillStyle = "#FFD166";

    for (let i = 0; i < 4; i++) {
      const angle =
        (Math.PI * 2 * i) / 4 + time / 1500;

      const radius = 29;

      const sx =
        x + 16 + Math.cos(angle) * radius;

      const sy =
        topY + 17 + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

// ====================================
// PESAN KETIKA CHECKPOINT AKTIF
// ====================================

function drawCheckpointMessage(ctx, celebration, time) {
  if (!celebration) return;

  const elapsed = time - celebration.startedAt;

  if (
    elapsed < 0 ||
    elapsed >= MESSAGE_DURATION
  ) {
    return;
  }

  const progress = elapsed / MESSAGE_DURATION;

  // Fade in di awal dan fade out di akhir
  const fadeIn = Math.min(1, elapsed / 250);
  const fadeOut = Math.min(
    1,
    (MESSAGE_DURATION - elapsed) / 400
  );

  const opacity = Math.min(fadeIn, fadeOut);

  const x = celebration.x + 15;
  const y = GROUND_Y - 120 - progress * 15;

  ctx.save();

  ctx.globalAlpha = opacity;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 15px sans-serif";

  // Garis putih di belakang tulisan
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#FFFFFF";

  ctx.strokeText(
    celebration.message,
    x,
    y
  );

  ctx.fillStyle = "#BA648D";

  ctx.fillText(
    celebration.message,
    x,
    y
  );

  ctx.restore();
}

// ====================================
// RENDER SEMUA CHECKPOINT
// ====================================

export function drawCheckpoints(ctx, game, time) {
  for (const checkpoint of CHECKPOINTS) {
    const active =
      (game.checkpoint ?? 0) >=
      checkpoint.respawnX;

    drawCheckpoint(
      ctx,
      checkpoint,
      active,
      time
    );
  }

  drawCheckpointMessage(
    ctx,
    game.checkpointCelebration,
    time
  );
}
