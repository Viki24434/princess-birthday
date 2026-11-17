
import {
  WIDTH,
  WORLD_WIDTH
} from "../constants";

import { drawBackground } from "./background";
import { drawTerrain } from "./terrain";

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

function getCameraX(playerX) {
  return Math.max(
    0,
    Math.min(
      playerX - 230,
      WORLD_WIDTH - WIDTH
    )
  );
}

export function drawWorld(ctx, game, time, sprites) {
  const player = game.player;
  const partner = game.partner;

  const cameraX = getCameraX(player.x);

  // Background tetap seperti sebelumnya
  drawBackground(ctx, cameraX);

  ctx.save();
  ctx.translate(-cameraX, 0);

  // Dunia game
  drawTerrain(ctx);
  drawCollectibles(ctx, game, time);
  drawEnemies(ctx, game.enemies);

  // Kastil dan bendera
  drawCastle(ctx, game);
  drawFlagPole(ctx, game);

  // =====================================
  // KEDUA KARAKTER + TRANSPARANSI
  // =====================================

  ctx.save();

  ctx.globalAlpha = game.coupleOpacity ?? 1;

  drawPlayer(
    ctx,
    player,
    time,
    sprites
  );

  drawPartner(
    ctx,
    time,
    sprites,
    partner
  );

  // Gambar tangan yang saling berpegangan
  drawHoldingHands(
    ctx,
    player,
    partner
  );

  ctx.restore();

  // =====================================
  // HATI KECIL SAAT BERTEMU / MERAYAKAN
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

  // Kembang api
  drawFireworks(
    ctx,
    game.fireworks ?? []
  );

  ctx.restore();
}
