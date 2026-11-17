
const WIDTH = 900;
const HEIGHT = 2700;

// TRUE = tampilkan garis petunjuk tempat PNG.
// Nanti setelah gambarnya ada, ubah ke false.
const SHOW_PNG_GUIDES = true;

const FRAME_COLORS = {
  "birthday-doodle": {
    background: "#181319",
    text: "#FFF3F8",
    accent: "#DDB9CD",
    border: "#D9A8BF"
  },
  princess: {
    background: "#FFF0F6",
    text: "#A44E77",
    accent: "#CE7FA5",
    border: "#EFA6C4"
  },
  "love-strip": {
    background: "#F8D7E4",
    text: "#983D68",
    accent: "#BD648F",
    border: "#DA89AE"
  },
  scrapbook: {
    background: "#FFF6E9",
    text: "#856253",
    accent: "#B28A70",
    border: "#D9B99A"
  },
  royal: {
    background: "#FFF4F5",
    text: "#96733A",
    accent: "#C49E60",
    border: "#D2B16E"
  }
};

// Posisi dekorasi PNG untuk nanti.
export const threeShotDecorationSlots = {
  topLeft: {
    x: 95,
    y: 1860,
    width: 160,
    height: 125,
    name: "bow.png"
  },
  topRight: {
    x: 645,
    y: 1860,
    width: 160,
    height: 125,
    name: "sparkle.png"
  },
  bottomLeft: {
    x: 95,
    y: 2345,
    width: 175,
    height: 185,
    name: "cake.png"
  },
  bottomRight: {
    x: 630,
    y: 2345,
    width: 175,
    height: 185,
    name: "gift.png"
  }
};

function drawCover(ctx, image, x, y, width, height) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;

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
    sx,
    sy,
    sw,
    sh,
    x,
    y,
    width,
    height
  );
}

function drawGuide(ctx, slot, color) {
  ctx.save();

  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 9]);

  ctx.strokeRect(
    slot.x,
    slot.y,
    slot.width,
    slot.height
  );

  ctx.setLineDash([]);
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = color;
  ctx.textAlign = "center";

  ctx.font = "22px Arial";
  ctx.fillText(
    "PNG",
    slot.x + slot.width / 2,
    slot.y + slot.height / 2 - 5
  );

  ctx.font = "17px Arial";
  ctx.fillText(
    slot.name,
    slot.x + slot.width / 2,
    slot.y + slot.height / 2 + 25
  );

  ctx.restore();
}

export function composeThreeShot(images, themeId) {
  if (images.length !== 3) {
    throw new Error("Layout 3-shot membutuhkan 3 foto.");
  }

  const theme =
    FRAME_COLORS[themeId] ||
    FRAME_COLORS["birthday-doodle"];

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Gagal membuat frame 3-shot.");
  }

  // Background
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Bingkai luar
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, WIDTH - 60, HEIGHT - 60);

  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(46, 46, WIDTH - 92, HEIGHT - 92);

  // Header
  ctx.textAlign = "center";
  ctx.fillStyle = theme.text;
  ctx.font = "italic 40px Georgia";
  ctx.fillText("♡ Birthday Booth ♡", WIDTH / 2, 104);

  // Tiga foto
  const photo = {
    x: 100,
    y: 145,
    width: 700,
    height: 510,
    gap: 24
  };

  images.forEach((image, index) => {
    const y = photo.y + index * (
      photo.height + photo.gap
    );

    // Border putih di belakang foto
    ctx.fillStyle = "#FFFDFB";
    ctx.fillRect(
      photo.x - 8,
      y - 8,
      photo.width + 16,
      photo.height + 16
    );

    drawCover(
      ctx,
      image,
      photo.x,
      y,
      photo.width,
      photo.height
    );
  });

  // Garis pemisah footer
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(110, 1810);
  ctx.lineTo(790, 1810);
  ctx.stroke();

  // Judul footer
  ctx.fillStyle = theme.text;
  ctx.textAlign = "center";
  ctx.font = "italic bold 55px Georgia";
  ctx.fillText(
    "Happy Birthday, Sayang ♡",
    WIDTH / 2,
    2145,
    760
  );

  // Subjudul footer
  ctx.font = "29px Georgia";
  ctx.fillText(
    "Made with love, just for you",
    WIDTH / 2,
    2215,
    760
  );

  // Tempat dekorasi PNG (belum ada gambar)
  if (SHOW_PNG_GUIDES) {
    Object.values(threeShotDecorationSlots).forEach(
      slot => drawGuide(ctx, slot, theme.accent)
    );
  }

  // Tulisan kecil paling bawah
  ctx.fillStyle = theme.accent;
  ctx.font = "25px Georgia";
  ctx.fillText(
    "A little memory of your special day",
    WIDTH / 2,
    2590,
    760
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Gagal menyimpan foto 3-shot."));
      }
    }, "image/png");
  });
}
