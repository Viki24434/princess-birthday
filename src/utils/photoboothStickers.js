const stickerNames = ["bow", "sparkle", "cake", "gift", "flower"];
const imageCache = new Map();

const frameStickers = {
  princess: ["bow", "sparkle", "flower", "gift"],
  "love-strip": ["bow", "flower", "cake", "gift"],
  scrapbook: ["flower", "bow", "gift", "flower"],
  royal: ["sparkle", "flower", "cake", "sparkle"],
  "birthday-doodle": ["bow", "sparkle", "cake", "gift"]
};

export function getFrameStickerNames(frameId) {
  return frameStickers[frameId] || frameStickers.princess;
}

export function getStickerSource(name) {
  return `${import.meta.env.BASE_URL}photobooth/decorations/${name}.png`;
}

function loadSticker(name) {
  if (!imageCache.has(name)) {
    const request = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Hiasan ${name}.png belum bisa dimuat. Coba lagi, yaa.`));
      image.src = getStickerSource(name);
    }).catch(error => {
      imageCache.delete(name);
      throw error;
    });

    imageCache.set(name, request);
  }

  return imageCache.get(name);
}

export async function loadFrameStickers() {
  const images = await Promise.all(stickerNames.map(loadSticker));
  return Object.fromEntries(stickerNames.map((name, index) => [name, images[index]]));
}

// Pertahankan proporsi PNG; area transparan tidak berubah menjadi kotak warna.
export function drawPngSticker(ctx, image, { x, y, width, height, rotation = 0 }) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  const w = sourceWidth * scale;
  const h = sourceHeight * scale;

  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(rotation * Math.PI / 180);
  ctx.drawImage(image, -w / 2, -h / 2, w, h);
  ctx.restore();
}

export function getPhotoStickerLayout(frameId, photoSlots) {
  const names = getFrameStickerNames(frameId);
  const layout = [];

  photoSlots.forEach((slot, slotIndex) => {
    const positions = [
      { x: slot.x - 48, y: slot.y - 40, width: 110, height: 92, rotation: -12 },
      { x: slot.x + slot.w - 62, y: slot.y - 36, width: 110, height: 92, rotation: 12 },
      { x: slot.x - 48, y: slot.y + slot.h - 60, width: 110, height: 100, rotation: -8 },
      { x: slot.x + slot.w - 62, y: slot.y + slot.h - 60, width: 110, height: 100, rotation: 8 }
    ];

    positions.forEach((position, index) => {
      // Dua sudut di sela foto cukup; empat ornamen pada setiap foto
      // akan bertumpuk pada celah strip yang sempit.
      if (index === 1 && slotIndex !== 0) return;
      if (index === 2 && slotIndex !== photoSlots.length - 1) return;
      layout.push({ name: names[index], ...position });
    });
  });

  return layout;
}

export function drawPhotoPngStickers(ctx, images, frameId, photoSlots) {
  for (const placement of getPhotoStickerLayout(frameId, photoSlots)) {
    drawPngSticker(ctx, images[placement.name], placement);
  }
}
