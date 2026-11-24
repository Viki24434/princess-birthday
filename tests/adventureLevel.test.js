import test from "node:test";
import assert from "node:assert/strict";
import { WORLD_WIDTH, GROUND_Y, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED, JUMP_FORCE, GRAVITY, REQUIRED_HEARTS } from "../src/game/constants.js";
import { platforms, gaps, ladders, END_STAIRS, heartItems, enemyTemplates, CHECKPOINTS, FLAG, CASTLE_X, CASTLE_DOOR_X, FINISH_WALK_X, partner } from "../src/game/levels/level1.js";

const ground = platforms.filter(platform => platform.y === GROUND_Y);

test("level terrain reaches the world boundary without a hidden drop after the castle", () => {
  assert.equal(ground[0].x, 0);
  assert.equal(ground.at(-1).x + ground.at(-1).w, WORLD_WIDTH);
  assert.ok(CASTLE_X + 180 < WORLD_WIDTH);
  assert.ok(FLAG.x > 5500);
});

test("every ground gap can be cleared with the current jump physics", () => {
  const airTime = 2 * Math.abs(JUMP_FORCE) / GRAVITY;
  const jumpDistance = airTime * PLAYER_SPEED;
  assert.ok(gaps.length >= 10);
  for (const gap of gaps) {
    assert.ok(gap.w > 0);
    assert.ok(gap.w + PLAYER_WIDTH + 20 < jumpDistance);
    assert.ok(ground.some(platform => platform.x + platform.w === gap.x));
    assert.ok(ground.some(platform => platform.x === gap.x + gap.w));
  }
});

test("ladders connect an upper platform to safe ground", () => {
  for (const ladder of ladders) {
    const center = ladder.x + ladder.w / 2;
    assert.ok(platforms.some(platform => platform.y === ladder.y && center >= platform.x && center <= platform.x + platform.w));
    assert.ok(ground.some(platform => ladder.y + ladder.h === platform.y && center >= platform.x && center <= platform.x + platform.w));
  }
});

test("checkpoint respawns are supported and outside every ground enemy patrol", () => {
  let previous = 0;
  for (const checkpoint of CHECKPOINTS) {
    const x = checkpoint.respawnX;
    assert.ok(x > previous && x <= checkpoint.x);
    assert.ok(ground.some(platform => x >= platform.x && x + PLAYER_WIDTH <= platform.x + platform.w));
    for (const enemy of enemyTemplates.filter(enemy => enemy.y + enemy.h === GROUND_Y)) {
      assert.ok(x + PLAYER_WIDTH <= enemy.minX || x >= enemy.maxX + enemy.w, `unsafe checkpoint at ${x}`);
    }
    previous = x;
  }
});

test("the final checkpoint gives a safe retry before the castle staircase", () => {
  const finalCheckpoint = CHECKPOINTS.at(-1);
  const firstStep = END_STAIRS[0];
  assert.ok(finalCheckpoint.x + 100 < firstStep.x);
  assert.ok(finalCheckpoint.respawnX + PLAYER_WIDTH < firstStep.x);
  assert.ok(CHECKPOINTS.every(checkpoint => checkpoint.x < firstStep.x));
  assert.ok(!END_STAIRS.some(stair => finalCheckpoint.respawnX < stair.x + stair.w && finalCheckpoint.respawnX + PLAYER_WIDTH > stair.x));
});

test("enemy patrols stay fully on a supporting platform", () => {
  for (const enemy of enemyTemplates) {
    assert.ok(enemy.x >= enemy.minX && enemy.x <= enemy.maxX);
    assert.ok(platforms.some(platform => platform.y === enemy.y + enemy.h && enemy.minX >= platform.x && enemy.maxX + enemy.w <= platform.x + platform.w));
  }
});

test("collectible hearts are reachable from the level surfaces", () => {
  const jumpHeight = JUMP_FORCE * JUMP_FORCE / (2 * GRAVITY);
  assert.ok(heartItems.length > REQUIRED_HEARTS);
  for (const heart of heartItems) {
    assert.ok(heart.x >= 0 && heart.x < FLAG.x);
    assert.ok([...platforms, ...END_STAIRS].some(platform => {
      const centerY = platform.y - PLAYER_HEIGHT / 2;
      return heart.x >= platform.x - 28 && heart.x <= platform.x + platform.w + 28 && heart.y >= centerY - jumpHeight - 34 && heart.y <= centerY + 34;
    }), `heart at ${heart.x}, ${heart.y} is out of reach`);
  }
});

test("the staircase, flag, meeting point, and castle keep their finish order", () => {
  assert.ok(END_STAIRS.at(-1).x + END_STAIRS.at(-1).w < FLAG.x);
  assert.ok(FLAG.x < FINISH_WALK_X);
  assert.ok(FINISH_WALK_X + PLAYER_WIDTH < partner.x);
  assert.ok(partner.x < CASTLE_X);
  assert.ok(CASTLE_X < CASTLE_DOOR_X && CASTLE_DOOR_X < WORLD_WIDTH);
});
