import test from "node:test";
import assert from "node:assert/strict";
import { PLAYER_HEIGHT, PLAYER_SPEED } from "../src/game/constants.js";
import { createGame, respawnPlayer } from "../src/game/engine/gameState.js";
import { updatePlayer } from "../src/game/engine/physics.js";
import { createMovingPlatforms, updateMovingPlatforms } from "../src/game/systems/movingPlatforms.js";
import { collectSecret } from "../src/game/systems/secretArea.js";
import { platforms, SECRET_AREA, movingPlatformTemplates } from "../src/game/levels/level1.js";

function testPlatform(overrides = {}) {
  return createMovingPlatforms([{ id: "test", x: 100, y: 220, targetX: 180, targetY: 220, w: 100, h: 16, period: 240, ...overrides }]);
}

function rider(platform) {
  return { ...createGame().player, x: platform.x + 20, y: platform.y - PLAYER_HEIGHT, supportingPlatformId: platform.id };
}

function step(player, moving, controls = {}, delta = 1) {
  updateMovingPlatforms(moving, delta);
  updatePlayer(player, controls, delta, moving);
}

test("platforms reach both ends smoothly, repeat, and never mutate the level templates", () => {
  const snapshot = structuredClone(movingPlatformTemplates);
  for (const template of movingPlatformTemplates) {
    const moving = createMovingPlatforms([template]);
    updateMovingPlatforms(moving, template.period / 2);
    assert.ok(Math.abs(moving[0].x - template.targetX) < 0.00001);
    assert.ok(Math.abs(moving[0].y - template.targetY) < 0.00001);
    updateMovingPlatforms(moving, template.period / 2);
    assert.ok(Math.abs(moving[0].x - template.x) < 0.00001);
    assert.ok(Math.abs(moving[0].y - template.y) < 0.00001);
  }
  assert.deepEqual(movingPlatformTemplates, snapshot);
});

test("horizontal and vertical riders stay on the surface across direction reversals at different frame rates", () => {
  for (const delta of [0.5, 1, 2]) {
    for (const overrides of [{}, { y: 260, targetY: 155, targetX: 100 }]) {
      const moving = testPlatform(overrides);
      const player = rider(moving[0]);
      const offset = player.x - moving[0].x;
      for (let frame = 0; frame < 1000; frame++) {
        step(player, moving, {}, delta);
        assert.equal(player.onGround, true);
        assert.equal(player.supportingPlatformId, "test");
        assert.ok(Math.abs(player.y + PLAYER_HEIGHT - moving[0].y) < 0.00001);
        assert.ok(Math.abs(player.x - moving[0].x - offset) < 0.00001);
      }
    }
  }
});

test("falling players can land on both a horizontal ferry and an ascending lift", () => {
  for (const overrides of [{}, { targetX: 100, targetY: 155 }]) {
    const moving = testPlatform(overrides);
    const player = { ...rider(moving[0]), y: 160, vy: 2, onGround: false, supportingPlatformId: null };
    for (let frame = 0; frame < 20 && !player.onGround; frame++) step(player, moving);
    assert.equal(player.supportingPlatformId, "test");
    assert.ok(Math.abs(player.y + PLAYER_HEIGHT - moving[0].y) < 0.00001);
  }
});

test("a platform does not pull a player up from underneath", () => {
  const moving = testPlatform();
  const player = { ...rider(moving[0]), y: 225, vy: -5, onGround: false, supportingPlatformId: null };
  step(player, moving);
  assert.equal(player.onGround, false);
  assert.equal(player.supportingPlatformId, null);
  assert.ok(player.y + PLAYER_HEIGHT > moving[0].y);
});

test("jumping detaches the player without dragging them horizontally through the air", () => {
  const moving = testPlatform();
  const player = rider(moving[0]);
  step(player, moving, { jump: true });
  assert.equal(player.onGround, false);
  assert.equal(player.supportingPlatformId, null);
  assert.ok(player.vy < 0);
  const jumpX = player.x;
  for (let frame = 0; frame < 10; frame++) step(player, moving);
  assert.equal(player.x, jumpX);
});

test("walking off a ferry stops carrying the player on later frames", () => {
  const moving = testPlatform();
  const player = { ...rider(moving[0]), x: moving[0].x + moving[0].w - 8 };
  for (let frame = 0; frame < 5; frame++) step(player, moving, { right: true });
  assert.equal(player.supportingPlatformId, null);
  const previousX = player.x;
  step(player, moving, { right: true });
  assert.ok(Math.abs(player.x - previousX - PLAYER_SPEED) < 0.00001);
});

test("respawn clears moving support but keeps the secret and collected hearts; restart resets all three", () => {
  const game = createGame();
  game.checkpoint = 3800;
  game.player.supportingPlatformId = "secret-lift";
  game.secretFound = true;
  game.collected.add(1);
  updateMovingPlatforms(game.movingPlatforms, 90);
  respawnPlayer(game);
  assert.equal(game.player.supportingPlatformId, null);
  assert.equal(game.player.x, 3800);
  assert.equal(game.secretFound, true);
  assert.equal(game.collected.size, 1);
  assert.equal(game.movingPlatforms[0].elapsed, 90);
  const restarted = createGame();
  assert.equal(restarted.secretFound, false);
  assert.equal(restarted.collected.size, 0);
  assert.equal(restarted.movingPlatforms[0].elapsed, 0);
});

test("the secret cannot be collected from the main path, is optional, and only unlocks once", () => {
  const game = createGame();
  game.player.x = SECRET_AREA.heart.x - 15;
  assert.equal(collectSecret(game), false);
  game.player.y = SECRET_AREA.heart.y - PLAYER_HEIGHT / 2;
  assert.equal(collectSecret(game), true);
  assert.equal(collectSecret(game), false);
  assert.equal(game.collected.size, 0);
  assert.equal(game.checkpoint, 55);
});

test("the real lift reaches the secret ledge and the player can jump back onto the main route", () => {
  for (const delta of [0.5, 1, 2]) {
    const game = createGame();
    const lift = game.movingPlatforms.find(platform => platform.id === "secret-lift");
    game.player = rider(lift);
    for (let time = 0; time < lift.period / 2; time += delta) step(game.player, game.movingPlatforms, {}, delta);
    const ledge = platforms.find(platform => platform.kind === "secret");
    let landed = false;
    for (let frame = 0; frame < 120; frame++) {
      const dx = SECRET_AREA.heart.x - game.player.x - 15;
      step(game.player, game.movingPlatforms, { right: dx > 3, left: dx < -3, jump: frame === 0 }, delta);
      if (game.player.onGround && Math.abs(game.player.y + PLAYER_HEIGHT - ledge.y) < 0.01) { landed = true; break; }
    }
    assert.equal(landed, true, `could not reach secret at delta ${delta}`);
    assert.equal(collectSecret(game), true);
    let returned = false;
    for (let frame = 0; frame < 160; frame++) {
      step(game.player, game.movingPlatforms, { right: true }, delta);
      if (game.player.onGround && Math.abs(game.player.y + PLAYER_HEIGHT - 204) < 0.01) { returned = true; break; }
    }
    assert.equal(returned, true, `could not return to the main route at delta ${delta}`);
  }
});

test("both real ferries can be boarded at different phases and lead back to the main platforms", () => {
  for (const [id, launchX, launchY, nextX] of [["garden-ferry", 1390, 330, 1530], ["bridge-ferry", 3390, 172, 3695]]) {
    for (const phase of [0, 0.25, 0.5, 0.75]) {
      const game = createGame();
      const ferry = game.movingPlatforms.find(platform => platform.id === id);
      updateMovingPlatforms(game.movingPlatforms, phase * ferry.period);
      Object.assign(game.player, { x: launchX, y: launchY - PLAYER_HEIGHT, supportingPlatformId: null });
      let boarded = false;
      for (let frame = 0; frame < 120; frame++) {
        const dx = ferry.x + ferry.w / 2 - game.player.x - 15;
        step(game.player, game.movingPlatforms, { right: dx > 3, left: dx < -3, jump: frame === 0 });
        if (game.player.supportingPlatformId === id) { boarded = true; break; }
      }
      assert.equal(boarded, true, `could not board ${id} at phase ${phase}`);
      for (let frame = 0; frame < ferry.period && ferry.x < ferry.targetX - 5; frame++) step(game.player, game.movingPlatforms);
      let returned = false;
      for (let frame = 0; frame < 100; frame++) {
        step(game.player, game.movingPlatforms, { right: true, jump: frame === 0 });
        if (game.player.onGround && !game.player.supportingPlatformId && game.player.x + 30 > nextX) { returned = true; break; }
      }
      assert.equal(returned, true, `could not leave ${id} at phase ${phase}`);
    }
  }
});
