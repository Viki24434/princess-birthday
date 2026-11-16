
const themes = {
  princess: {
    background: "#FFF0F6",
    accent: "#B96A8D",
    border: "#EFA6C4",
    title: "Putri Cantik ♡"
  },
  "love-strip": {
    background: "#F8D7E4",
    accent: "#A94F79",
    border: "#DA89AE",
    title: "Senyum Dulu, Sayang ♡"
  },
  scrapbook: {
    background: "#FFF6E9",
    accent: "#9E766B",
    border: "#D9B99A",
    title: "Kenangan Manis Kita ♡"
  },
  royal: {
    background: "#FFF4F5",
    accent: "#A88146",
    border: "#D2B16E",
    title: "Hari Spesial Kamu ♡"
  }
};


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
  canvas.height = isStrip ? 3700 : 1280;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Gagal membuat bingkai foto.");
  }

  // Warna dasar bingkai
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bingkai luar
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 10;
  ctx.strokeRect(
    35, 35,
    canvas.width - 70,
    canvas.height - 70
  );

  // Judul
  ctx.textAlign = "center";
  ctx.fillStyle = theme.accent;
  ctx.font = "bold 42px Georgia";
  ctx.fillText(theme.title, 450, 105);

  // Posisi foto
  const slot = isStrip
    ? { x: 110, y: 145, w: 680, h: 800, gap: 18 }
    : { x: 85, y: 170, w: 730, h: 910, gap: 0 };

  images.forEach((image, index) => {
    const x = slot.x;
    const y = slot.y + index * (slot.h + slot.gap);

    // Latar putih ala polaroid
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(
      x - 12,
      y - 12,
      slot.w + 24,
      slot.h + 24
    );

    drawCover(ctx, image, x, y, slot.w, slot.h);

    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, slot.w, slot.h);
  });

  // Dekorasi
  ctx.fillStyle = theme.accent;
  ctx.font = "44px Georgia";

  ctx.fillText("♡", 80, 110);
  ctx.fillText("♡", 820, 110);

  const footerY = canvas.height - 105;

  ctx.font = "30px Georgia";
  ctx.fillText(
    "Dibuat khusus buat kamu ♡",
    450,
    footerY
  );

  ctx.font = "23px Georgia";
  ctx.fillText(
    "Simpan foto ini, yaa sayang",
    450,
    footerY + 45
  );

  // Export PNG
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
