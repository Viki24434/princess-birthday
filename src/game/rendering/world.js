
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

import {
  drawCastle,
  drawCastleStairs
} from "./castle";

import { drawFireworks } from "../effects/fireworks";

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

    // Tangga menuju balkon kastil
    drawCastleStairs(ctx);

    // Tiang bendera
    drawFlagPole(ctx, game);

    // Cowok menggunakan posisi animasi
    drawPartner(
    ctx,
    time,
    sprites,
    game.partner
    );

    // Cewek
    drawPlayer(
    ctx,
    player,
    time,
    sprites
    );

    // Hati kecil saat mereka bertemu
    if (
    game.finishStep === "meet" ||
    game.finishStep === "celebrate"
    ) {
    const centerX =
        (player.x + game.partner.x) / 2 + 15;

    const heartY =
        Math.min(player.y, game.partner.y) -
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

    // Kembang api digambar di atas dunia game
    drawFireworks(ctx, game.fireworks);

    ctx.restore();

}
