
import { partner } from "../levels/level1";

function drawHead(ctx, image, x, y, width, height) {
  if (
    image &&
    image.complete &&
    image.naturalWidth > 0
  ) {
    ctx.drawImage(image, x, y, width, height);
    return true;
  }

  return false;
}

// ========================================
// KARAKTER CEWEK — PEMAIN
// ========================================

export function drawPlayer(ctx, player, time, sprites) {
  const x = player.x;
  const y = player.y;

  const isWalking =
    Math.abs(player.vx) > 0.1 &&
    player.onGround;

    const isFlagSliding =
    player.isFlagSliding === true;

  const isClimbing = player.onLadder;

    const isJumping =
    !player.onGround &&
    !player.onLadder &&
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

  // Kaki
  ctx.strokeStyle = "#F2D8C8";
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

  // Sepatu
  ctx.fillStyle = "#FFFFFF";

  ctx.fillRect(
    x + 5 + legOffset,
    y + 37,
    12,
    5
  );

  ctx.fillRect(
    x + 17 - legOffset,
    y + 37,
    12,
    5
  );

  // Baju pink
  ctx.fillStyle = "#F1A3C3";

  ctx.beginPath();
  ctx.roundRect(x + 5, y + 16, 22, 19, 5);
  ctx.fill();

  // Detail baju
  ctx.fillStyle = "#FFE4EE";
  ctx.fillRect(x + 14, y + 20, 4, 4);


    // =====================================
    // ANIMASI TANGAN
    // =====================================

    ctx.strokeStyle = "#F1A3C3";
    ctx.lineWidth = 6;
    ctx.beginPath();

    if (isFlagSliding) {
    // Tangan kiri berada di samping badan
    ctx.moveTo(x + 7, y + 20);
    ctx.lineTo(x + 5, y + 29);

    // Tangan kanan menjangkau tiang
    ctx.moveTo(x + 25, y + 20);
    ctx.lineTo(x + 35, y + 17);

    }else if (player.holdingHands) {
    // Tangan kiri santai
    ctx.moveTo(x + 7, y + 20);
    ctx.lineTo(x + 4, y + 29);

    // Tangan kanan menuju cowok
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

    // Tambahkan tangan kecil yang memegang tiang
    if (isFlagSliding) {
    ctx.fillStyle = "#F2D8C8";

    ctx.beginPath();
    ctx.arc(
        x + 35,
        y + 17,
        4,
        0,
        Math.PI * 2
    );
    ctx.fill();
    }


  if (isJumping) {
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

    const head =
    player.facing === "depan"
        ? sprites.cewekSenang
        : player.facing === "kiri"
        ? sprites.cewekKiri
        : sprites.cewekKanan;

  const loaded = drawHead(
    ctx,
    head,
    x - 7,
    y - 18,
    46,
    43
  );

  // Kepala sementara saat gambar belum termuat
  if (!loaded) {
    ctx.fillStyle = "#FFE2D2";
    ctx.beginPath();
    ctx.arc(x + 16, y + 5, 17, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ========================================
// KARAKTER COWOK — MENUNGGU DI KASTIL
// ========================================


export function drawPartner(
  ctx,
  time,
  sprites,
  character = partner
) {
  const x = character.x;
  const y = character.y;

  const isWalking =
    Math.abs(character.vx ?? 0) > 0.1;

  const legSwing = isWalking
    ? Math.sin(time / 105) * 4
    : 0;

  const armSwing = isWalking
    ? Math.sin(time / 105) * 4
    : 0;

  const wave = isWalking
    ? 0
    : Math.sin(time / 240) * 5;

  ctx.save();
  ctx.lineCap = "round";

  // Kaki
  ctx.fillStyle = "#D6BBA7";

  ctx.fillRect(
    x + 7 + legSwing,
    y + 29,
    6,
    11
  );

  ctx.fillRect(
    x + 18 - legSwing,
    y + 29,
    6,
    11
  );

  // Sepatu
  ctx.fillStyle = "#3B3443";

  ctx.fillRect(
    x + 4 + legSwing,
    y + 38,
    11,
    5
  );

  ctx.fillRect(
    x + 17 - legSwing,
    y + 38,
    11,
    5
  );

  // Baju hitam
  ctx.fillStyle = "#302B35";
  ctx.beginPath();
  ctx.roundRect(
    x + 4,
    y + 15,
    24,
    20,
    5
  );
  ctx.fill();

  // Kerah
  ctx.fillStyle = "#4F4753";
  ctx.beginPath();

  ctx.moveTo(x + 10, y + 17);
  ctx.lineTo(x + 16, y + 22);
  ctx.lineTo(x + 21, y + 17);

  ctx.fill();

  // Kedua tangan
  ctx.strokeStyle = "#302B35";
  ctx.lineWidth = 6;
  ctx.beginPath();

  if (character.holdingHands) {
  // Tangan kiri memegang tangan cewek
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
        // Melambai saat diam
        ctx.moveTo(x + 6, y + 19);
        ctx.lineTo(x + 2, y + 30);

        ctx.moveTo(x + 25, y + 19);
        ctx.lineTo(x + 32 + wave, y + 7);
    }

  ctx.stroke();

  // Kepala cowok

    const head =
    character.facing === "kanan"
        ? sprites.cowokKanan
        : character.facing === "kiri"
        ? sprites.cowokKiri
        : sprites.cowokSenang;
  const loaded = drawHead(
    ctx,
    head,
    x - 7,
    y - 18,
    44,
    42
  );

  if (!loaded) {
    ctx.fillStyle = "#FFE0D0";
    ctx.beginPath();
    ctx.arc(
      x + 15,
      y + 5,
      17,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.restore();
}


export function drawHoldingHands(ctx, player, partner) {
  if (
    !player.holdingHands ||
    !partner.holdingHands
  ) {
    return;
  }

  const leftHandX = player.x + 30;
  const leftHandY = player.y + 27;

  const rightHandX = partner.x + 1;
  const rightHandY = partner.y + 27;

  ctx.save();

  ctx.lineCap = "round";
  ctx.strokeStyle = "#F2D8C8";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(leftHandX, leftHandY);
  ctx.lineTo(rightHandX, rightHandY);
  ctx.stroke();

  // Pertemuan kedua tangan
  ctx.fillStyle = "#F2D8C8";
  ctx.beginPath();
  ctx.arc(
    (leftHandX + rightHandX) / 2,
    (leftHandY + rightHandY) / 2,
    3,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();
}
