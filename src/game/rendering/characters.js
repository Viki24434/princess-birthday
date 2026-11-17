
import { partner } from "../levels/level1";

// ====================================
// PENGATURAN UKURAN KEPALA
// ====================================

const HEAD_SIZE = {
  cowok: {
    width: 34,
    height: 34,
    offsetX: -2,
    offsetY: -18
  },
  cewek: {
    width: 36,
    height: 36,
    offsetX: -3,
    offsetY: -14
  }
};

function drawHead(ctx, image, x, y, config) {
  const headX = x + config.offsetX;
  const headY = y + config.offsetY;

  if (image?.complete && image.naturalWidth > 0) {
    ctx.drawImage(
      image,
      headX,
      headY,
      config.width,
      config.height
    );
    return;
  }

  // Kepala sementara ketika PNG belum dimuat
  ctx.fillStyle = "#F4D5C5";
  ctx.beginPath();
  ctx.arc(x + 15, y + 5, 14, 0, Math.PI * 2);
  ctx.fill();
}

// ====================================
// COWOK — KARAKTER YANG DIMAINKAN
// ====================================

export function drawPlayer(ctx, player, time, sprites) {
  const x = player.x;
  const y = player.y;

  const isFlagSliding = player.isFlagSliding === true;
  const isClimbing = player.onLadder;

  const isWalking =
    Math.abs(player.vx) > 0.1 &&
    player.onGround;

  const isJumping =
    !player.onGround &&
    !isClimbing &&
    !isFlagSliding;

  const walkFrame = Math.sin(time / 105);

  const legOffset = isClimbing
    ? Math.sin(time / 150) * 4
    : isWalking
      ? walkFrame * 5
      : 0;

  const armOffset = isClimbing
    ? Math.sin(time / 150) * 5
    : isWalking
      ? walkFrame * 4
      : 0;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // =========================
  // KAKI
  // =========================

  ctx.strokeStyle = "#D8B79F";
  ctx.lineWidth = 6;
  ctx.beginPath();

  if (isJumping) {
    ctx.moveTo(x + 11, y + 29);
    ctx.lineTo(x + 7, y + 37);

    ctx.moveTo(x + 21, y + 29);
    ctx.lineTo(x + 25, y + 37);
  } else {
    ctx.moveTo(x + 11, y + 29);
    ctx.lineTo(x + 11 + legOffset, y + 39);

    ctx.moveTo(x + 21, y + 29);
    ctx.lineTo(x + 21 - legOffset, y + 39);
  }

  ctx.stroke();

  // Sepatu hitam
  ctx.fillStyle = "#36313B";

  ctx.fillRect(x + 5 + legOffset, y + 37, 12, 5);
  ctx.fillRect(x + 17 - legOffset, y + 37, 12, 5);

    // =========================
    // LEHER COWOK
    // =========================

    ctx.fillStyle = "#D8B79F";

    ctx.beginPath();
    ctx.roundRect(
    x + 13,
    y + 11,
    6,
    12,
    2
    );
    ctx.fill();


  // =========================
  // BADAN BAJU HITAM
  // =========================

  ctx.fillStyle = "#302B35";
  ctx.beginPath();
  ctx.roundRect(x + 5, y + 16, 22, 19, 5);
  ctx.fill();

  // Detail kerah
  ctx.fillStyle = "#514855";
  ctx.beginPath();
  ctx.moveTo(x + 11, y + 17);
  ctx.lineTo(x + 16, y + 22);
  ctx.lineTo(x + 21, y + 17);
  ctx.fill();

  // =========================
  // TANGAN
  // =========================

  ctx.strokeStyle = "#302B35";
  ctx.lineWidth = 6;
  ctx.beginPath();

  if (isFlagSliding) {
    // Memegang tiang bendera
    ctx.moveTo(x + 7, y + 20);
    ctx.lineTo(x + 4, y + 29);

    ctx.moveTo(x + 25, y + 20);
    ctx.lineTo(x + 35, y + 17);

  } else if (player.holdingHands) {
    // Tangan kanan menggandeng cewek
    ctx.moveTo(x + 7, y + 20);
    ctx.lineTo(x + 4, y + 29);

    ctx.moveTo(x + 25, y + 20);
    ctx.lineTo(x + 30, y + 27);

  } else if (isJumping) {
    ctx.moveTo(x + 7, y + 20);
    ctx.lineTo(x + 2, y + 12);

    ctx.moveTo(x + 25, y + 20);
    ctx.lineTo(x + 30, y + 12);

  } else if (isClimbing) {
    ctx.moveTo(x + 7, y + 20);
    ctx.lineTo(x + 5, y + 12 + armOffset);

    ctx.moveTo(x + 25, y + 20);
    ctx.lineTo(x + 27, y + 12 - armOffset);

  } else {
    ctx.moveTo(x + 7, y + 20);
    ctx.lineTo(x + 4, y + 29 + armOffset);

    ctx.moveTo(x + 25, y + 20);
    ctx.lineTo(x + 28, y + 29 - armOffset);
  }

  ctx.stroke();

  // Tangan yang menyentuh bendera
  if (isFlagSliding) {
    ctx.fillStyle = "#D8B79F";
    ctx.beginPath();
    ctx.arc(x + 35, y + 17, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // =========================
  // KEPALA COWOK
  // =========================

  const head =
    player.facing === "depan"
      ? sprites.cowokSenang
      : player.facing === "kiri"
        ? sprites.cowokKiri
        : sprites.cowokKanan;

  drawHead(ctx, head, x, y, HEAD_SIZE.cowok);

  ctx.restore();
}

// ====================================
// CEWEK — MENUNGGU DI KASTIL
// ====================================

export function drawPartner(
  ctx,
  time,
  sprites,
  character = partner
) {
  const x = character.x;
  const y = character.y;

  const isWalking = Math.abs(character.vx ?? 0) > 0.1;

  const legSwing = isWalking
    ? Math.sin(time / 105) * 4
    : 0;

  const armSwing = isWalking
    ? Math.sin(time / 105) * 4
    : 0;

  const wave = Math.sin(time / 240) * 5;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // =========================
  // KAKI
  // =========================

  ctx.fillStyle = "#F2D8C8";

  ctx.fillRect(x + 7 + legSwing, y + 29, 6, 11);
  ctx.fillRect(x + 18 - legSwing, y + 29, 6, 11);

  // Sepatu putih
  ctx.fillStyle = "#FFFFFF";

  ctx.fillRect(x + 4 + legSwing, y + 38, 11, 5);
  ctx.fillRect(x + 17 - legSwing, y + 38, 11, 5);

  // =========================
  // BADAN BAJU PINK
  // =========================

  ctx.fillStyle = "#F1A3C3";
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 15, 24, 20, 5);
  ctx.fill();

  // Detail baju
  ctx.fillStyle = "#FFE4EE";
  ctx.fillRect(x + 14, y + 19, 4, 5);

  // =========================
  // TANGAN
  // =========================

  ctx.strokeStyle = "#F1A3C3";
  ctx.lineWidth = 6;
  ctx.beginPath();

  if (character.holdingHands) {
    // Tangan kiri menggandeng cowok
    ctx.moveTo(x + 6, y + 19);
    ctx.lineTo(x + 1, y + 27);

    // Tangan kanan santai
    ctx.moveTo(x + 25, y + 19);
    ctx.lineTo(x + 29, y + 29);

  } else if (isWalking) {
    ctx.moveTo(x + 6, y + 19);
    ctx.lineTo(x + 2, y + 29 + armSwing);

    ctx.moveTo(x + 25, y + 19);
    ctx.lineTo(x + 29, y + 29 - armSwing);

  } else {
    // Melambaikan tangan saat menunggu
    ctx.moveTo(x + 6, y + 19);
    ctx.lineTo(x + 2, y + 30);

    ctx.moveTo(x + 25, y + 19);
    ctx.lineTo(x + 32 + wave, y + 7);
  }

  ctx.stroke();

  // =========================
  // KEPALA CEWEK
  // =========================

  const head =
    character.facing === "kanan"
      ? sprites.cewekKanan
      : character.facing === "kiri"
        ? sprites.cewekKiri
        : sprites.cewekSenang;

  drawHead(ctx, head, x, y, HEAD_SIZE.cewek);

  ctx.restore();
}

// ====================================
// EFEK BERPEGANGAN TANGAN
// ====================================

export function drawHoldingHands(ctx, player, character) {
  if (
    !player.holdingHands ||
    !character.holdingHands
  ) {
    return;
  }

  const hand1X = player.x + 30;
  const hand1Y = player.y + 27;

  const hand2X = character.x + 1;
  const hand2Y = character.y + 27;

  ctx.save();

  ctx.lineCap = "round";
  ctx.strokeStyle = "#F2D8C8";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(hand1X, hand1Y);
  ctx.lineTo(hand2X, hand2Y);
  ctx.stroke();

  // Titik kedua tangan bertemu
  ctx.beginPath();
  ctx.arc(
    (hand1X + hand2X) / 2,
    (hand1Y + hand2Y) / 2,
    3,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "#F2D8C8";
  ctx.fill();

  ctx.restore();
}
