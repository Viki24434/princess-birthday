
import {
  WIDTH,
  WORLD_WIDTH
} from "../constants";

import { drawBackground } from "./background";
import { drawTerrain } from "./terrain";

import {
  drawCollectibles,
  drawEnemies
} from "./objects";

import { drawFlagPole } from "./flag";
import { drawCastle } from "./castle";

import {
  drawPlayer,
  drawPartner
} from "./characters";

// =====================================
// KAMERA MENGIKUTI PEMAIN
// =====================================

function getCameraX(playerX) {
  return Math.max(
    0,
    Math.min(
      playerX - 230,
      WORLD_WIDTH - WIDTH
    )
  );
}

// =====================================
// RENDER SELURUH DUNIA GAME
// =====================================

export function drawWorld(ctx, game, time, sprites) {
  const player = game.player;

  const cameraX = getCameraX(player.x);

  // Background menggunakan posisi kamera
  // tetapi belum ditranslasi
  drawBackground(ctx, cameraX);

  ctx.save();

  // Menggeser dunia mengikuti karakter
  ctx.translate(-cameraX, 0);

  // Tanah, platform, jurang, tangga
  drawTerrain(ctx);

  // Hati collectible
  drawCollectibles(ctx, game, time);

  // Mob
  drawEnemies(ctx, game.enemies);

  // Kastil
  drawCastle(ctx);

  // Tiang dan bendera
  drawFlagPole(ctx, game);

  // Pasangan yang menunggu
  drawPartner(ctx, time, sprites);

  // Karakter pemain
  drawPlayer(ctx, player, time, sprites);

  ctx.restore();
}
