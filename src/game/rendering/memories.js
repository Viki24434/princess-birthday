
import { WIDTH } from "../constants";
import { backgroundMemorySpots } from "../levels/level1";
import { resolveAssetUrl } from "../../utils/customContent";

const photoCache = new Map();

const FRAME_WIDTH = 122;
const FRAME_HEIGHT = 126;

function getPhoto(path) {
  if (!path) return null;

  if (photoCache.has(path)) {
    return photoCache.get(path);
  }

  const image = new Image();

  const asset = {
    image,
    loaded: false,
    failed: false
  };

  photoCache.set(path, asset);

  image.onload = () => {
    asset.loaded = true;
  };

  image.onerror = () => {
    asset.failed = true;
    console.warn("Foto kenangan tidak ditemukan:", path);
  };

  image.src = resolveAssetUrl(path);

  return asset;
}

// Foto selalu memenuhi kotak tanpa gepeng
function drawImageCover(ctx, image, x, y, width, height) {
  const imageWidth = image.naturalWidth;
  const imageHeight = image.naturalHeight;

  const scale = Math.max(
    width / imageWidth,
    height / imageHeight
  );

  const sourceWidth = width / scale;
  const sourceHeight = height / scale;

  const sourceX = (imageWidth - sourceWidth) / 2;
  const sourceY = (imageHeight - sourceHeight) / 2;

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height
  );
}

function drawPolaroid(ctx, memory) {
  const photo = getPhoto(memory.image);

  ctx.save();

  ctx.translate(memory.x, memory.y);
  ctx.rotate(memory.rotation ?? 0);

  // Sedikit transparan agar terasa menyatu
  // dengan background game
  ctx.globalAlpha = 0.92;

  // Kertas Polaroid
  ctx.shadowColor = "rgba(122, 67, 95, 0.22)";
  ctx.shadowBlur = 13;
  ctx.shadowOffsetY = 5;

  ctx.fillStyle = "#FFFDFD";
  ctx.beginPath();
  ctx.roundRect(
    0,
    0,
    FRAME_WIDTH,
    FRAME_HEIGHT,
    5
  );
  ctx.fill();

  // Matikan bayangan untuk isi foto
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  const photoX = 8;
  const photoY = 8;
  const photoWidth = FRAME_WIDTH - 16;
  const photoHeight = 88;

  ctx.save();

  ctx.beginPath();
  ctx.roundRect(
    photoX,
    photoY,
    photoWidth,
    photoHeight,
    3
  );
  ctx.clip();

  if (photo?.loaded) {
    drawImageCover(
      ctx,
      photo.image,
      photoX,
      photoY,
      photoWidth,
      photoHeight
    );
  } else {
    // Tampilan sementara jika foto belum ada
    ctx.fillStyle = "#F8DCE9";
    ctx.fillRect(
      photoX,
      photoY,
      photoWidth,
      photoHeight
    );

    ctx.fillStyle = "#C580A0";
    ctx.font = "27px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("♡", FRAME_WIDTH / 2, 62);
  }

  ctx.restore();

  // Tulisan di bawah foto
  ctx.fillStyle = "#9A5A78";
  ctx.font = "12px cursive";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    memory.text ?? "",
    FRAME_WIDTH / 2,
    111,
    FRAME_WIDTH - 12
  );

  ctx.restore();
}

// Foto ikut berpindah ketika kamera bergerak
export function drawBackgroundMemories(ctx, cameraX, viewportWidth = WIDTH, memories = []) {
  for (const [index, spot] of backgroundMemorySpots.entries()) {
    const content = memories[index];
    if (!content) continue;
    const memory = { ...spot, image: content.image, text: content.text || "" };
    const screenX = memory.x - cameraX;

    // Jangan menggambar foto yang jauh
    // di luar layar
    if (
      screenX < -160 ||
      screenX > viewportWidth + 160
    ) {
      continue;
    }

    drawPolaroid(ctx, memory);
  }
}
