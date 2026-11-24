import test from "node:test";
import assert from "node:assert/strict";
import { PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_SPEED } from "../src/game/constants.js";
import { ladders } from "../src/game/levels/level1.js";
import { createGame } from "../src/game/engine/gameState.js";
import { updatePlayer } from "../src/game/engine/physics.js";
import { createControls, resetControls } from "../src/game/systems/input.js";

function atTop(ladder, attached = false) {
  return { ...createGame().player, x: ladder.x + (ladder.w - PLAYER_WIDTH) / 2,
    y: ladder.y - PLAYER_HEIGHT, onLadder: attached, onGround: !attached };
}

test("a fresh Up press jumps from the top of every ladder, including a character still marked as climbing", () => {
  for (const ladder of ladders) for (const attached of [false, true]) for (const delta of [0.5, 1, 2]) {
    const player = atTop(ladder, attached);
    const previousY = player.y;
    updatePlayer(player, { ...createControls(), up: true }, delta);
    assert.equal(player.onLadder, false, `ladder ${ladder.x} kept its climbing state`);
    assert.equal(player.onGround, false);
    assert.ok(player.vy < 0);
    assert.ok(player.y < previousY);
  }
});

test("the jump button does not reattach to a ladder while Up stays held", () => {
  for (const ladder of ladders) for (const delta of [0.5, 1, 2]) {
    const player = atTop(ladder, true);
    const controls = { ...createControls(), up: true, upJumpHandled: true, jump: true };
    for (let frame = 0; frame < 8; frame++) {
      updatePlayer(player, controls, delta);
      assert.equal(player.onLadder, false, `ladder ${ladder.x} reattached on frame ${frame}`);
      assert.equal(player.onGround, false);
      assert.ok(player.vy < 0);
    }
  }
});

test("reaching the top finishes climbing without auto-jumping, then a new Up press jumps", () => {
  for (const ladder of ladders) for (const delta of [0.5, 1, 2]) {
    const player = { ...atTop(ladder), y: ladder.y + ladder.h - PLAYER_HEIGHT };
    const controls = { ...createControls(), up: true };
    for (let frame = 0; frame < Math.ceil(ladder.h / (3.4 * delta)) + 3; frame++) updatePlayer(player, controls, delta);
    assert.equal(player.onLadder, false);
    assert.equal(player.onGround, true);
    assert.equal(player.y, ladder.y - PLAYER_HEIGHT);
    assert.equal(player.vy, 0);
    controls.up = false;
    updatePlayer(player, controls, delta);
    controls.up = true;
    updatePlayer(player, controls, delta);
    assert.ok(player.vy < 0);
    assert.equal(player.onLadder, false);
  }
});

test("holding Up after a climb does not block walking away along the upper platform", () => {
  for (const ladder of ladders) {
    const player = atTop(ladder, true);
    const previousX = player.x;
    updatePlayer(player, { ...createControls(), up: true, right: true, upJumpHandled: true }, 1);
    assert.equal(player.onLadder, false);
    assert.equal(player.onGround, true);
    assert.ok(Math.abs(player.x - previousX - PLAYER_SPEED) < 0.00001);
  }
});

test("Down still starts a descent from the top", () => {
  for (const ladder of ladders) for (const attached of [false, true]) {
    const player = atTop(ladder, attached);
    const previousY = player.y;
    updatePlayer(player, { ...createControls(), down: true }, 1);
    assert.equal(player.onLadder, true);
    assert.equal(player.onGround, false);
    assert.ok(player.y > previousY);
  }
});

test("Up at the bottom still climbs instead of jumping", () => {
  for (const ladder of ladders) {
    const player = { ...atTop(ladder), y: ladder.y + ladder.h - PLAYER_HEIGHT };
    const previousY = player.y;
    updatePlayer(player, { ...createControls(), up: true }, 1);
    assert.equal(player.onLadder, true);
    assert.equal(player.vy, 0);
    assert.ok(player.y < previousY);
  }
});

test("a jump from the middle of a ladder stays detached while rising", () => {
  const ladder = ladders[0];
  const player = { ...atTop(ladder, true), y: ladder.y + 90 - PLAYER_HEIGHT };
  const controls = { ...createControls(), up: true, upJumpHandled: true, jump: true };
  for (let frame = 0; frame < 8; frame++) {
    updatePlayer(player, controls, 1);
    assert.equal(player.onLadder, false);
    assert.ok(player.vy < 0);
  }
});

test("resetting controls during a pause does not swallow the next Up press at the top", () => {
  const controls = { ...createControls(), up: true, upJumpHandled: true };
  resetControls(controls);
  controls.up = true;
  const player = atTop(ladders[0]);
  updatePlayer(player, controls, 1);
  assert.ok(player.vy < 0);
  assert.equal(player.onLadder, false);
});
