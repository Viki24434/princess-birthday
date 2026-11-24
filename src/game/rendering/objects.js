
import { heartItems } from "../levels/level1";
import { DEFEAT_DURATION } from "../entities/enemies";

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


function drawDefeatedEnemy(ctx, enemy) {
  const progress = (enemy.defeatTimer ?? 0) / DEFEAT_DURATION;
  if (progress >= 1) return;
  ctx.save();
  ctx.globalAlpha *= 1 - progress;
  ctx.fillStyle = "#8DB99C";
  ctx.beginPath();
  ctx.ellipse(enemy.x + enemy.w / 2, enemy.y + enemy.h - 3, enemy.w / 2 + 2, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#E4BC61";
  for (const direction of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(enemy.x + enemy.w / 2 + direction * (9 + progress * 10), enemy.y + 8 - progress * 12, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function drawEnemies(ctx, enemies, time = 0) {
  enemies.forEach((enemy) => {
    if (enemy.defeated) {
      drawDefeatedEnemy(ctx, enemy);
      return;
    }
    const x = enemy.x;
    const y = enemy.y;
    const w = enemy.w;
    const h = enemy.h;

    // Setiap mob punya fase animasi berbeda
    const phase = enemy.minX * 0.03;

    // Gerakan kaki
    const walk = Math.sin(time / 115 + phase);

    // Badan sedikit memantul
    const bounce =
      Math.abs(Math.sin(time / 170 + phase)) * 2;

    // Badan sedikit berubah bentuk
    const squash =
      Math.sin(time / 170 + phase) * 0.035;

    // Berkedip sesekali
    const blinking =
      (time + enemy.minX * 7) % 2800 < 120;

    const stompable = enemy.kind === "slime";

    ctx.save();

    // ====================================
    // BAYANGAN DI BAWAH MOB
    // ====================================

    ctx.fillStyle = "rgba(89, 55, 99, 0.18)";

    ctx.beginPath();
    ctx.ellipse(
      x + w / 2,
      y + h,
      11 - bounce,
      3,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // ====================================
    // TRANSFORMASI ANIMASI
    // ====================================

    ctx.translate(
      x + w / 2,
      y - bounce
    );

    ctx.scale(
      1 + squash,
      1 - squash
    );

    // ====================================
    // KAKI BERJALAN
    // ====================================

    ctx.fillStyle = stompable ? "#679C7C" : "#78608B";

    ctx.beginPath();
    ctx.roundRect(
      -10 + walk * 2,
      h - 6,
      8,
      7,
      3
    );
    ctx.fill();

    ctx.beginPath();
    ctx.roundRect(
      3 - walk * 2,
      h - 6,
      8,
      7,
      3
    );
    ctx.fill();

    // ====================================
    // TUBUH MONSTER
    // ====================================

    ctx.fillStyle = stompable ? (y < 200 ? "#86B99C" : "#9AC7A6") : "#A187BB";

    ctx.beginPath();

    ctx.ellipse(
      0,
      h / 2 + 2,
      w / 2,
      h / 2 - 2,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // Kilau kecil pada badan
    ctx.fillStyle = "rgba(255,255,255,0.17)";

    ctx.beginPath();
    ctx.ellipse(
      -5,
      9,
      5,
      3,
      -0.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // ====================================
    // MATA BERKEDIP
    // ====================================

    if (blinking) {
      // Mata tertutup
      ctx.strokeStyle = "#554164";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(-9, 14);
      ctx.lineTo(-4, 14);

      ctx.moveTo(4, 14);
      ctx.lineTo(9, 14);
      ctx.stroke();

    } else {
      // Mata putih
      ctx.fillStyle = "#FFFFFF";

      ctx.beginPath();
      ctx.roundRect(-10, 11, 7, 7, 2);
      ctx.roundRect(3, 11, 7, 7, 2);
      ctx.fill();

      // Pupil mengikuti arah jalan
      const lookX = enemy.dir === -1
        ? -1
        : 1;

      ctx.fillStyle = "#50405F";

      ctx.fillRect(
        -8 + lookX,
        13,
        3,
        4
      );

      ctx.fillRect(
        5 + lookX,
        13,
        3,
        4
      );
    }

    // ====================================
    // MULUT KECIL
    // ====================================

    ctx.strokeStyle = stompable ? "#4E755D" : "#684B7B";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.arc(
      0,
      20,
      3,
      0.1,
      Math.PI - 0.1
    );
    ctx.stroke();

    // ====================================
    // PIPI MONSTER
    // ====================================

    ctx.fillStyle = "#E8A7C6";

    ctx.beginPath();
    ctx.arc(-11, 20, 2.5, 0, Math.PI * 2);
    ctx.arc(11, 20, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // ====================================
    // Duri terlihat pada mob yang tidak boleh diinjak.
    // ====================================

    if (!stompable) {
      ctx.fillStyle = "#E8DDEF";
      ctx.strokeStyle = "#78608B";
      ctx.lineWidth = 1.5;
      for (const spikeX of [-9, 0, 9]) {
        ctx.beginPath();
        ctx.moveTo(spikeX - 4, 8);
        ctx.lineTo(spikeX, 0);
        ctx.lineTo(spikeX + 4, 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    ctx.restore();
  });
}
