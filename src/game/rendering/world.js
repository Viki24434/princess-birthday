
import {
  WIDTH,
  HEIGHT
} from "../constants";
import { getCameraX } from "./viewport";

import { drawBackground } from "./background";
import { drawTerrain } from "./terrain";
import { drawMovingPlatforms, drawSecretArea } from "./bonusObjects";

import {
  drawCollectibles,
  drawEnemies,
  drawHeart
} from "./objects";

import { drawFlagPole } from "./flag";
import { drawCastle } from "./castle";

import {
  drawPlayer,
  drawPartner,
  drawHoldingHands
} from "./characters";

import { drawFireworks } from "../effects/fireworks";

import {
  drawBackgroundMemories
} from "./memories";
import { drawCheckpoints } from "./checkpoints";

// =====================================
// LAYER KHUSUS UNTUK KEDUA KARAKTER
// =====================================

// Canvas sementara dibuat satu kali,
// bukan dibuat ulang setiap frame.
let coupleCanvas = null;
let coupleCtx = null;

function getCoupleLayer(viewport) {
  if (!coupleCanvas) {
    coupleCanvas = document.createElement("canvas");
    coupleCtx = coupleCanvas.getContext("2d");
  }

  const width = Math.round(viewport.width * viewport.scale);
  const height = Math.round(HEIGHT * viewport.scale);
  if (coupleCanvas.width !== width) coupleCanvas.width = width;
  if (coupleCanvas.height !== height) coupleCanvas.height = height;

  return { coupleCanvas, coupleCtx };
}

// =====================================
// GAMBAR KEDUA KARAKTER SEBAGAI
// SATU GAMBAR UTUH
// =====================================

function drawCoupleLayer(game, time, sprites, cameraX, viewport) {
  const { coupleCanvas, coupleCtx } = getCoupleLayer(viewport);

  if (!coupleCtx) return null;

  // Bersihkan gambar frame sebelumnya
  coupleCtx.setTransform(1, 0, 0, 1, 0, 0);
  coupleCtx.globalAlpha = 1;

  coupleCtx.clearRect(
    0,
    0,
    coupleCanvas.width,
    coupleCanvas.height
  );

  coupleCtx.save();
  coupleCtx.scale(viewport.scale, viewport.scale);

  // Samakan posisi kamera
  coupleCtx.translate(-cameraX, 0);

  const checkpointAge = time - (game.checkpointCelebration?.startedAt ?? -Infinity);
  const expressionContext = {
    finishStep: game.finishStep,
    failed: Boolean(game.failureType),
    celebrating: checkpointAge >= 0 && checkpointAge < 1000
  };

  // Cowok — karakter pemain
  drawPlayer(
    coupleCtx,
    game.player,
    time,
    sprites,
    expressionContext
  );

  // Cewek — pasangan yang menunggu
  drawPartner(
    coupleCtx,
    time,
    sprites,
    game.partner,
    expressionContext
  );

  // Pegangan tangan
  drawHoldingHands(
    coupleCtx,
    game.player,
    game.partner
  );

  coupleCtx.restore();

  return coupleCanvas;
}

// =====================================
// RENDER DUNIA GAME
// =====================================

export function drawWorld(ctx, game, time, sprites, viewport = { width: WIDTH, scale: 1 }) {
  const player = game.player;
  const partner = game.partner;

  const cameraX = getCameraX(player.x, viewport.width);

  // Background

    drawBackground(ctx, cameraX, viewport.width);

    ctx.save();
    ctx.translate(-cameraX, 0);

    // Foto dan tulisan kenangan di background
    drawBackgroundMemories(ctx, cameraX, viewport.width);

    // Tanah, jurang, platform, tangga
    drawTerrain(ctx);
    drawMovingPlatforms(ctx, game.movingPlatforms ?? []);
    drawSecretArea(ctx, game, time);

    // Bendera checkpoint
    drawCheckpoints(ctx, game, time);

  // Hati yang dikumpulkan
  drawCollectibles(ctx, game, time);

  // Mob
  drawEnemies(ctx, game.enemies, time);

  // Kastil dan bendera
  drawCastle(ctx, game);
  drawFlagPole(ctx, game);

  // =====================================
  // OPACITY KEDUA KARAKTER
  // =====================================

  // Gambar karakter lebih dulu dengan
  // opacity penuh pada canvas terpisah.
  const coupleLayer = drawCoupleLayer(
    game,
    time,
    sprites,
    cameraX,
    viewport
  );

  if (coupleLayer) {
    ctx.save();

    // Batasi opacity dari 0 sampai 1
    const opacity = Math.max(
      0,
      Math.min(1, game.coupleOpacity ?? 1)
    );

    // Opacity diterapkan sekali pada
    // hasil gabungan kedua karakter.
    ctx.globalAlpha = opacity;

    // Karena dunia sudah digeser kamera,
    // gambar layer pada cameraX.
    ctx.drawImage(
      coupleLayer,
      cameraX,
      0,
      viewport.width,
      HEIGHT
    );

    ctx.restore();
  }

  // =====================================
  // HATI SAAT BERTEMU
  // =====================================

  if (
    game.finishStep === "meet" ||
    game.finishStep === "celebrate"
  ) {
    const centerX =
      (player.x + partner.x) / 2 + 15;

    const heartY =
      Math.min(player.y, partner.y) -
      24 +
      Math.sin(time / 240) * 4;

    drawHeart(
      ctx,
      centerX,
      heartY,
      20,
      "#F076A8"
    );
  }

  // =====================================
  // KEMBANG API
  // =====================================

  drawFireworks(
    ctx,
    game.fireworks ?? []
  );

  ctx.restore();
}
