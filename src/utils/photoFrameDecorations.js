
function heart(ctx, x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 30, size / 30);

  ctx.beginPath();
  ctx.moveTo(0, 13);
  ctx.bezierCurveTo(-25, -3, -15, -16, 0, -5);
  ctx.bezierCurveTo(15, -16, 25, -3, 0, 13);

  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function sparkle(ctx, x, y, radius, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.quadraticCurveTo(3, -3, radius, 0);
  ctx.quadraticCurveTo(3, 3, 0, radius);
  ctx.quadraticCurveTo(-3, 3, -radius, 0);
  ctx.quadraticCurveTo(-3, -3, 0, -radius);
  ctx.fill();

  ctx.restore();
}

function bow(ctx, x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);

  const s = size / 50;
  ctx.scale(s, s);

  // Pita yang menjuntai
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-3, 5);
  ctx.lineTo(-17, 39);
  ctx.lineTo(-5, 32);
  ctx.lineTo(2, 10);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(3, 5);
  ctx.lineTo(18, 39);
  ctx.lineTo(6, 32);
  ctx.lineTo(-2, 10);
  ctx.fill();

  // Sayap pita kiri
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-15, -18, -32, -17, -30, 0);
  ctx.bezierCurveTo(-29, 18, -12, 14, 0, 0);
  ctx.fill();

  // Sayap pita kanan
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(15, -18, 32, -17, 30, 0);
  ctx.bezierCurveTo(29, 18, 12, 14, 0, 0);
  ctx.fill();

  // Detail lipatan
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-24, -4);
  ctx.lineTo(-6, 1);
  ctx.moveTo(24, -4);
  ctx.lineTo(6, 1);
  ctx.stroke();

  // Simpul pita
  ctx.fillStyle = "#FFF0F7";
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function flower(ctx, x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);

  const petalLength = size * 0.34;

  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 6);

    ctx.beginPath();
    ctx.ellipse(
      0,
      -petalLength,
      size * 0.18,
      size * 0.30,
      0,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = "#F4CF76";
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.17, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function crown(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 60, size / 60);

  ctx.fillStyle = "#E8B96B";
  ctx.strokeStyle = "#A87C3D";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(-28, 8);
  ctx.lineTo(-30, -20);
  ctx.lineTo(-13, -6);
  ctx.lineTo(0, -27);
  ctx.lineTo(13, -6);
  ctx.lineTo(30, -20);
  ctx.lineTo(28, 8);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#FFF3BF";
  ctx.fillRect(-28, 9, 56, 8);

  for (const point of [
    [-30, -20],
    [0, -27],
    [30, -20]
  ]) {
    ctx.fillStyle = "#FFE9F2";
    ctx.beginPath();
    ctx.arc(point[0], point[1], 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#D7719E";
  ctx.beginPath();
  ctx.arc(0, -2, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function tape(ctx, x, y, width, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.fillStyle = "rgba(238, 202, 142, 0.82)";
  ctx.fillRect(-width / 2, -13, width, 26);

  ctx.strokeStyle = "rgba(148, 108, 66, 0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(-width / 2, -13, width, 26);

  for (let i = -width / 2 + 8; i < width / 2; i += 12) {
    ctx.strokeStyle = "rgba(255,255,255,0.38)";
    ctx.beginPath();
    ctx.moveTo(i, -11);
    ctx.lineTo(i + 7, 11);
    ctx.stroke();
  }

  ctx.restore();
}

function swirl(ctx, x, y, direction, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(direction, 1);

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(0, 42);
  ctx.bezierCurveTo(25, 15, 28, -18, 7, -30);
  ctx.bezierCurveTo(-10, -40, -15, -15, 1, -12);
  ctx.bezierCurveTo(12, -10, 12, -22, 6, -22);
  ctx.stroke();

  // Daun ornamen
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.ellipse(18, 10, 7, 14, 0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(20, -8, 6, 12, -0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function pearls(ctx, x, top, bottom) {
  for (let y = top; y < bottom; y += 36) {
    ctx.fillStyle = "#FFFDF8";
    ctx.strokeStyle = "#D7A6BC";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

function filmHoles(ctx, x, top, bottom) {
  ctx.fillStyle = "#7D455E";

  for (let y = top; y < bottom - 16; y += 45) {
    ctx.beginPath();
    ctx.roundRect(x - 8, y, 16, 25, 4);
    ctx.fill();
  }
}

// ====================================
// ORNAMEN UTAMA UNTUK SETIAP FRAME
// ====================================

export function drawFrameDecorations(
  ctx,
  frameId,
  slots,
  canvasWidth,
  canvasHeight
) {
  if (!slots.length) return;

  ctx.save();

  // Dekorasi di bagian atas dan bawah
  if (frameId === "princess") {
    crown(ctx, 90, 105, 53);
    crown(ctx, canvasWidth - 90, 105, 53);

    sparkle(ctx, 450, 55, 13, "#EAB7CA");
    sparkle(ctx, 450, canvasHeight - 65, 13, "#EAB7CA");
  }

  if (frameId === "love-strip") {
    heart(ctx, 82, 110, 43, "#E887AC");
    heart(ctx, canvasWidth - 82, 110, 43, "#E887AC");

    sparkle(ctx, 450, 57, 13, "#F4B6D0");
  }

  if (frameId === "scrapbook") {
    flower(ctx, 95, 106, 46, "#E5A0AD");
    flower(ctx, canvasWidth - 95, 106, 46, "#E8C3A4");

    sparkle(ctx, 450, 59, 10, "#C69B7B");
  }

  if (frameId === "royal") {
    swirl(ctx, 86, 110, 1, "#C39C53");
    swirl(ctx, canvasWidth - 86, 110, -1, "#C39C53");

    sparkle(ctx, 450, 62, 15, "#D4B66B");
    sparkle(
      ctx,
      450,
      canvasHeight - 66,
      15,
      "#D4B66B"
    );
  }

  // Dekorasi di sisi setiap foto
  for (const slot of slots) {
    const left = slot.x - 41;
    const right = slot.x + slot.w + 41;
    const middle = slot.y + slot.h / 2;

    if (frameId === "princess") {
      pearls(ctx, left, slot.y + 125, slot.y + slot.h - 90);
      pearls(ctx, right, slot.y + 125, slot.y + slot.h - 90);

      bow(ctx, left, slot.y + 67, 64, "#E783AF");
      bow(ctx, right, slot.y + slot.h - 83, 64, "#E783AF");

      heart(ctx, left, middle, 27, "#EAA0BF");
      heart(ctx, right, middle, 27, "#EAA0BF");
    }

    if (frameId === "love-strip") {
      filmHoles(
        ctx,
        left,
        slot.y + 48,
        slot.y + slot.h - 48
      );

      filmHoles(
        ctx,
        right,
        slot.y + 48,
        slot.y + slot.h - 48
      );

      heart(ctx, left, middle - 40, 31, "#E779A6");
      heart(ctx, right, middle + 40, 31, "#E779A6");

      sparkle(ctx, left, slot.y + 23, 12, "#F6BDD3");
      sparkle(ctx, right, slot.y + 23, 12, "#F6BDD3");
    }

    if (frameId === "scrapbook") {
      // Seolah foto ditempel ke halaman
      tape(ctx, slot.x + 74, slot.y - 12, 105, -0.2);
      tape(
        ctx,
        slot.x + slot.w - 74,
        slot.y + slot.h + 12,
        105,
        0.2
      );

      flower(ctx, left, middle - 45, 51, "#E7A3AE");
      flower(ctx, right, middle + 45, 51, "#D5B68A");

      heart(ctx, right, slot.y + 80, 25, "#C99486");
      sparkle(ctx, left, slot.y + slot.h - 75, 14, "#C99486");
    }

    if (frameId === "royal") {
      swirl(ctx, left, slot.y + 100, 1, "#C6A35C");
      swirl(ctx, right, slot.y + 100, -1, "#C6A35C");

      swirl(ctx, left, slot.y + slot.h - 90, -1, "#C6A35C");
      swirl(ctx, right, slot.y + slot.h - 90, 1, "#C6A35C");

      sparkle(ctx, left, middle, 17, "#D4AF62");
      sparkle(ctx, right, middle, 17, "#D4AF62");
    }
  }

  ctx.restore();
}
