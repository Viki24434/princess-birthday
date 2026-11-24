import test from "node:test";
import assert from "node:assert/strict";
import { PLAYER_HEIGHT } from "../src/game/constants.js";
import { createGame, respawnPlayer } from "../src/game/engine/gameState.js";
import { updatePlayer } from "../src/game/engine/physics.js";
import { resolveEnemyContact, updateEnemies, STOMP_BOUNCE, DEFEAT_DURATION } from "../src/game/entities/enemies.js";

function mob(overrides = {}) {
  return { x: 100, y: 100, w: 30, h: 28, minX: 100, maxX: 200, speed: 1, dir: 1, kind: "slime", defeated: false, ...overrides };
}

function player(overrides = {}) {
  return { ...createGame().player, x: 105, y: 60, vy: 4, onGround: false, ...overrides };
}

test("landing on a green slime defeats it, places the feet on its head, and bounces the player", () => {
  const enemy = mob();
  const hero = player({ supportingPlatformId: "old-ferry" });
  assert.deepEqual(resolveEnemyContact(hero, [enemy], { x: 105, y: 50 }), { hit: false, stomped: 1 });
  assert.equal(enemy.defeated, true);
  assert.equal(enemy.defeatTimer, 0);
  assert.equal(hero.y + PLAYER_HEIGHT, enemy.y);
  assert.equal(hero.vy, STOMP_BOUNCE);
  assert.equal(hero.onGround, false);
  assert.equal(hero.supportingPlatformId, null);
});

test("a side collision with a slime still hurts the player", () => {
  const enemy = mob();
  assert.deepEqual(resolveEnemyContact(player({ x: 80, y: 100 }), [enemy], { x: 60, y: 100 }), { hit: true, stomped: 0 });
  assert.equal(enemy.defeated, false);
});

test("hitting a slime from underneath is not a stomp", () => {
  const enemy = mob();
  assert.equal(resolveEnemyContact(player({ y: 120, vy: -8 }), [enemy], { x: 105, y: 140 }).hit, true);
  assert.equal(enemy.defeated, false);
});

test("spiked mobs hurt even when approached from above", () => {
  const enemy = mob({ kind: "spiked" });
  assert.deepEqual(resolveEnemyContact(player(), [enemy], { x: 105, y: 50 }), { hit: true, stomped: 0 });
  assert.equal(enemy.defeated, false);
});

test("touching the top exactly at the end of a frame counts as a stomp", () => {
  const enemy = mob();
  const hero = player({ y: enemy.y - PLAYER_HEIGHT });
  assert.equal(resolveEnemyContact(hero, [enemy], { x: 105, y: 50 }).stomped, 1);
});

test("fast falls cannot tunnel through a slime even if the final boxes no longer overlap", () => {
  const enemy = mob();
  const hero = player({ y: 200, vy: 16 });
  assert.equal(resolveEnemyContact(hero, [enemy], { x: 105, y: 0 }).stomped, 1);
  assert.equal(hero.y + PLAYER_HEIGHT, enemy.y);
});

test("a diagonal side impact is not misclassified just because the player started above the mob", () => {
  const enemy = mob({ x: 120 });
  assert.equal(resolveEnemyContact(player({ x: 115, y: 80 }), [enemy], { x: 50, y: 40 }).hit, true);
  assert.equal(enemy.defeated, false);
});

test("moving away from a touching edge does not produce a phantom stomp", () => {
  const enemy = mob();
  assert.deepEqual(resolveEnemyContact(player({ x: 60, y: 66 }), [enemy], { x: 70, y: 50 }), { hit: false, stomped: 0 });
});

test("relative movement detects a mob walking into a stationary player", () => {
  const enemy = mob({ x: 130, previousX: 160, previousY: 100 });
  assert.equal(resolveEnemyContact(player({ y: 100 }), [enemy], { x: 105, y: 100 }).hit, true);
});

test("the first stomp prevents a later collision with a lower spiked mob in the same fall", () => {
  const slime = mob();
  const spikes = mob({ y: 160, kind: "spiked" });
  const hero = player({ y: 200 });
  assert.deepEqual(resolveEnemyContact(hero, [spikes, slime], { x: 105, y: 0 }), { hit: false, stomped: 1 });
  assert.equal(slime.defeated, true);
  assert.equal(spikes.defeated, false);
  assert.equal(hero.y + PLAYER_HEIGHT, 100);
});

test("simultaneous contact with spikes takes priority over an adjacent slime", () => {
  const slime = mob();
  const spikes = mob({ x: 130, kind: "spiked" });
  assert.deepEqual(resolveEnemyContact(player({ x: 120 }), [slime, spikes], { x: 120, y: 50 }), { hit: true, stomped: 0 });
  assert.equal(slime.defeated, false);
});

test("two slimes touched from above at the same time share one bounce", () => {
  const enemies = [mob(), mob({ x: 130 })];
  const hero = player({ x: 120 });
  assert.deepEqual(resolveEnemyContact(hero, enemies, { x: 120, y: 50 }), { hit: false, stomped: 2 });
  assert.ok(enemies.every(enemy => enemy.defeated));
  assert.equal(hero.vy, STOMP_BOUNCE);
});

test("already-overlapping or ladder-climbing players cannot claim a top stomp", () => {
  for (const [hero, previous] of [[player(), { x: 105, y: 90 }], [player({ onLadder: true }), { x: 105, y: 50 }]]) {
    const enemy = mob();
    assert.equal(resolveEnemyContact(hero, [enemy], previous).hit, true);
    assert.equal(enemy.defeated, false);
  }
});

test("a terrain landing does not erase the downward motion needed to detect an earlier stomp", () => {
  const hero = player({ x: 250, y: 258, vy: 16 });
  const previous = { x: hero.x, y: hero.y };
  updatePlayer(hero, {}, 2);
  assert.equal(hero.vy, 0);
  assert.equal(hero.onGround, true);
  const enemy = mob({ x: 250, y: 302 });
  assert.equal(resolveEnemyContact(hero, [enemy], previous).stomped, 1);
  assert.equal(hero.vy, STOMP_BOUNCE);
});

test("defeated enemies stop patrolling and never collide during their disappearance", () => {
  const enemy = mob({ defeated: true, defeatTimer: 0 });
  updateEnemies([enemy], DEFEAT_DURATION);
  assert.equal(enemy.x, 100);
  assert.equal(enemy.defeatTimer, DEFEAT_DURATION);
  assert.deepEqual(resolveEnemyContact(player({ y: 100 }), [enemy], { x: 105, y: 90 }), { hit: false, stomped: 0 });
});

test("respawn preserves defeated mobs while a new game restores them", () => {
  const game = createGame();
  const index = game.enemies.findIndex(enemy => enemy.kind === "slime");
  game.enemies[index].defeated = true;
  respawnPlayer(game);
  assert.equal(game.enemies[index].defeated, true);
  assert.equal(createGame().enemies[index].defeated, false);
});

test("repairing an invalid patrol position also records a valid previous position", () => {
  const enemy = mob({ x: NaN, dir: 0 });
  updateEnemies([enemy], 1);
  assert.equal(enemy.previousX, enemy.minX);
  assert.ok(Number.isFinite(enemy.x));
  assert.ok(enemy.dir === 1 || enemy.dir === -1);
});
