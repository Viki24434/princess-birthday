import {
  drawFrameDecorations
} from "./photoFrameDecorations";

const themes = {
  princess: {
    background: "#FFF1F7",
    accent: "#C46692",
    border: "#F1A8C7",
    soft: "#FFE3EF",
    title: "Putri Cantik ♡",
    subtitle: "Hari ini kamu lucu banget, sayang",
    symbol: "♛"
  },
  "love-strip": {
    background: "#FBE0EA",
    accent: "#B55682",
    border: "#E397B8",
    soft: "#FFF1F6",
    title: "Foto Kita ♡",
    subtitle: "Senyum dulu, sayang",
    symbol: "♡"
  },
  scrapbook: {
    background: "#FFF6EA",
    accent: "#A67A67",
    border: "#DDBB9D",
    soft: "#FFFDF8",
    title: "Kenangan Manis ♡",
    subtitle: "Disimpan buat dikenang terus",
    symbol: "✿"
  },
  royal: {
    background: "#FFF7F8",
    accent: "#AA8243",
    border: "#D9BC7B",
    soft: "#FFFDF7",
    title: "Hari Spesial Kamu ♡",
    subtitle: "Sedikit kenangan dari aku",
    symbol: "✦"
  }
};

function roundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - r,
    y + height
  );
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle) {
  roundRectPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function strokeRoundedRect(ctx, x, y, width, height, radius, strokeStyle, lineWidth) {
  roundRectPath(ctx, x, y, width, height, radius);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawCover(ctx, image, x, y, width, height) {
  const sourceWidth =
    image.videoWidth || image.naturalWidth || image.width;

  const sourceHeight =
    image.videoHeight || image.naturalHeight || image.height;

  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = width / height;

  let sx = 0;
  let sy = 0;
  let sw = sourceWidth;
  let sh = sourceHeight;

  if (sourceRatio > targetRatio) {
    sw = sourceHeight * targetRatio;
    sx = (sourceWidth - sw) / 2;
  } else {
    sh = sourceWidth / targetRatio;
    sy = (sourceHeight - sh) / 2;
  }

  ctx.drawImage(
    image,
    sx, sy, sw, sh,
    x, y, width, height
  );
}

function drawClippedImage(ctx, image, x, y, width, height, radius) {
  ctx.save();
  roundRectPath(ctx, x, y, width, height, radius);
  ctx.clip();
  drawCover(ctx, image, x, y, width, height);
  ctx.restore();
}

function drawHeart(ctx, x, y, size, color) {
  const topCurveHeight = size * 0.3;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + topCurveHeight);
  ctx.bezierCurveTo(
    x, y,
    x - size / 2, y,
    x - size / 2, y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x - size / 2,
    y + (size + topCurveHeight) / 2,
    x,
    y + (size + topCurveHeight) / 1.25,
    x,
    y + size
  );
  ctx.bezierCurveTo(
    x,
    y + (size + topCurveHeight) / 1.25,
    x + size / 2,
    y + (size + topCurveHeight) / 2,
    x + size / 2,
    y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x + size / 2,
    y,
    x,
    y,
    x,
    y + topCurveHeight
  );
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawSparkle(ctx, x, y, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x, y + size);
  ctx.moveTo(x - size, y);
  ctx.lineTo(x + size, y);
  ctx.moveTo(x - size * 0.65, y - size * 0.65);
  ctx.lineTo(x + size * 0.65, y + size * 0.65);
  ctx.moveTo(x + size * 0.65, y - size * 0.65);
  ctx.lineTo(x - size * 0.65, y + size * 0.65);
  ctx.stroke();

  ctx.restore();
}

function drawTape(ctx, x, y, width, height, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.fillStyle = "rgba(255, 250, 210, 0.78)";
  ctx.strokeStyle = "rgba(205, 185, 115, 0.45)";
  ctx.lineWidth = 1.5;

  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.strokeRect(-width / 2, -height / 2, width, height);

  ctx.restore();
}

function drawThemeBackground(ctx, canvas, themeId, theme) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, theme.background);
  gradient.addColorStop(1, theme.soft);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (themeId === "princess") {
    drawHeart(ctx, 90, 90, 26, "#F1B7CE");
    drawHeart(ctx, canvas.width - 110, 88, 26, "#F1B7CE");
    drawSparkle(ctx, 160, 132, 10, "#E8A2BF");
    drawSparkle(ctx, canvas.width - 160, 132, 10, "#E8A2BF");
  }

  if (themeId === "love-strip") {
    drawHeart(ctx, 85, 92, 24, "#E89AB8");
    drawHeart(ctx, canvas.width - 105, 92, 24, "#E89AB8");
    drawHeart(ctx, canvas.width / 2, canvas.height - 110, 18, "#E89AB8");
  }

  if (themeId === "scrapbook") {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#CDAE93";
    ctx.lineWidth = 2;

    for (let y = 150; y < canvas.height - 100; y += 70) {
      ctx.beginPath();
      ctx.moveTo(80, y);
      ctx.lineTo(canvas.width - 80, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  if (themeId === "royal") {
    drawSparkle(ctx, 105, 95, 12, "#D1B168");
    drawSparkle(ctx, canvas.width - 115, 95, 12, "#D1B168");
    drawSparkle(ctx, canvas.width / 2, 78, 9, "#D1B168");
  }
}

function drawThemeFrame(ctx, canvas, themeId, theme) {
  strokeRoundedRect(
    ctx,
    30,
    30,
    canvas.width - 60,
    canvas.height - 60,
    28,
    theme.border,
    10
  );

  strokeRoundedRect(
    ctx,
    52,
    52,
    canvas.width - 104,
    canvas.height - 104,
    20,
    theme.accent,
    2.5
  );

  if (themeId === "princess") {
    ctx.fillStyle = theme.accent;
    ctx.font = "bold 34px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("♛", canvas.width / 2, 92);
  }

  if (themeId === "love-strip") {
    drawHeart(ctx, canvas.width / 2, 54, 20, theme.accent);
  }

  if (themeId === "scrapbook") {
    drawTape(ctx, 150, 90, 90, 28, -0.16);
    drawTape(ctx, canvas.width - 150, 90, 90, 28, 0.16);
  }

  if (themeId === "royal") {
    ctx.fillStyle = theme.accent;
    ctx.font = "bold 20px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("✦  ✦  ✦", canvas.width / 2, 90);
  }
}

function drawHeader(ctx, canvas, theme) {
  ctx.textAlign = "center";
  ctx.fillStyle = theme.accent;

  ctx.font = "bold 42px Georgia";
  ctx.fillText(theme.title, canvas.width / 2, 135);

  ctx.font = "24px Georgia";
  ctx.fillText(theme.subtitle, canvas.width / 2, 176);
}

function drawFooter(ctx, canvas, theme, photoCount) {
  const footerY = canvas.height - 110;

  ctx.fillStyle = theme.accent;
  ctx.textAlign = "center";

  ctx.font = "30px Georgia";
  ctx.fillText("Dibuat khusus buat kamu ♡", canvas.width / 2, footerY);

  ctx.font = "22px Georgia";
  ctx.fillText(
    photoCount > 1
      ? "Empat senyum manis dalam satu kenangan"
      : "Satu senyum manis buat hari spesialmu",
    canvas.width / 2,
    footerY + 38
  );
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(
      new Error("Ada foto yang gagal dimuat.")
    );

    image.src = src;
  });
}

export function capturePhoto(video, mirror = false) {
  if (
    !video ||
    video.readyState < 2 ||
    !video.videoWidth
  ) {
    throw new Error(
      "Kameranya belum siap. Coba sebentar lagi, yaa."
    );
  }

  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 960;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Gagal menyiapkan gambar.");
  }

  if (mirror) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  drawCover(
    ctx,
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas.toDataURL("image/jpeg", 0.9);
}

export async function composeBirthdayPhoto(
  photoSources,
  themeId = "princess"
) {
  if (!photoSources.length) {
    throw new Error("Belum ada foto yang diambil.");
  }

  const images = await Promise.all(
    photoSources.map(loadImage)
  );

  const theme = themes[themeId] || themes.princess;
  const isStrip = images.length > 1;

  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = isStrip ? 3740 : 1320;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Gagal membuat bingkai foto.");
  }

  drawThemeBackground(ctx, canvas, themeId, theme);
  drawThemeFrame(ctx, canvas, themeId, theme);
  drawHeader(ctx, canvas, theme);

  const slot = isStrip
    ? { x: 120, y: 230, w: 660, h: 760, gap: 28 }
    : { x: 90, y: 230, w: 720, h: 860, gap: 0 };

  images.forEach((image, index) => {
    const x = slot.x;
    const y = slot.y + index * (slot.h + slot.gap);

    // panel foto
    drawRoundedRect(
      ctx,
      x - 18,
      y - 18,
      slot.w + 36,
      slot.h + 36,
      22,
      "#FFFFFF"
    );

    strokeRoundedRect(
      ctx,
      x - 18,
      y - 18,
      slot.w + 36,
      slot.h + 36,
      22,
      theme.border,
      4
    );

    drawClippedImage(
      ctx,
      image,
      x,
      y,
      slot.w,
      slot.h,
      16
    );

    strokeRoundedRect(
      ctx,
      x,
      y,
      slot.w,
      slot.h,
      16,
      "rgba(255,255,255,0.8)",
      2
    );

    if (themeId === "scrapbook") {
      drawTape(ctx, x + 68, y - 18, 70, 22, -0.18);
      drawTape(ctx, x + slot.w - 68, y - 18, 70, 22, 0.18);
    }

    if (themeId === "love-strip") {
      drawHeart(ctx, x + slot.w - 36, y + slot.h - 52, 16, "#F0A6C2");
    }

    if (themeId === "princess") {
      ctx.fillStyle = theme.accent;
      ctx.font = "bold 18px Georgia";
      ctx.textAlign = "left";
      ctx.fillText("♡", x + 16, y + 34);
    }

    if (themeId === "royal") {
      drawSparkle(ctx, x + slot.w - 28, y + 30, 8, "#D3B16C");
    }

    // nomor kecil jika 4 foto
    if (isStrip) {
      ctx.fillStyle = theme.accent;
      ctx.font = "bold 22px Georgia";
      ctx.textAlign = "right";
      ctx.fillText(`#${index + 1}`, x + slot.w - 10, y + slot.h + 55);
    }
  });

  const photoSlots = images.map((image, index) => ({
    x: slot.x,
    y: slot.y + index * (slot.h + slot.gap),
    w: slot.w,
    h: slot.h
  }));

  drawFrameDecorations(
    ctx,
    themeId,
    photoSlots,
    canvas.width,
    canvas.height
  );

  drawFooter(ctx, canvas, theme, images.length);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(
          new Error("Gagal menyimpan hasil foto.")
        );
      }
    }, "image/png");
  });
}