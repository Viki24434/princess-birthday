import { WIDTH, HEIGHT, WORLD_WIDTH } from "../constants.js";

// Tinggi dunia tetap sama supaya tanah, platform atas, dan batas jatuh
// tidak berubah. Frame yang lebih tinggi memperbesar karakter di HP.
export function getGameViewport(displayWidth, displayHeight, pixelRatio = 1) {
  if (
    !Number.isFinite(displayWidth) || displayWidth <= 0 ||
    !Number.isFinite(displayHeight) || displayHeight <= 0
  ) {
    return null;
  }

  // Batasi resolusi agar layar retina tidak membebani HP berlebihan.
  const ratio = Number.isFinite(pixelRatio)
    ? Math.min(2, Math.max(1, pixelRatio))
    : 1;
  const pixelWidth = Math.max(1, Math.round(displayWidth * ratio));
  const pixelHeight = Math.max(1, Math.round(displayHeight * ratio));
  const scale = pixelHeight / HEIGHT;

  return {
    pixelWidth,
    pixelHeight,
    scale,
    width: pixelWidth / scale,
    height: HEIGHT
  };
}

export function getCameraX(playerX, viewportWidth = WIDTH) {
  // Sisakan ruang di depan pemain dengan proporsi kamera desktop semula.
  const anchor = viewportWidth * (230 / WIDTH);
  const limit = Math.max(0, WORLD_WIDTH - viewportWidth);
  return Math.max(0, Math.min(playerX - anchor, limit));
}
