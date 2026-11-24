import test from "node:test";
import assert from "node:assert/strict";
import { getCameraX, getGameViewport } from "../src/game/rendering/viewport.js";
import { HEIGHT, WIDTH, WORLD_WIDTH, PLAYER_WIDTH, PLAYER_HEIGHT } from "../src/game/constants.js";
import { CASTLE_X } from "../src/game/levels/level1.js";

function nearlyEqual(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 0.00001, `${actual} should equal ${expected}`);
}

test("desktop keeps its original field of view and camera position", () => {
  const viewport = getGameViewport(720, 400);
  assert.equal(viewport.width, WIDTH);
  assert.equal(viewport.height, HEIGHT);
  assert.equal(getCameraX(1000), 770);
});

test("portrait phone frames make the character larger while keeping the whole level height", () => {
  for (const [width, height] of [[288, 248], [328, 280], [343, 292], [358, 304], [398, 336]]) {
    const viewport = getGameViewport(width, height, 3);
    const displayScale = viewport.scale / (viewport.pixelHeight / height);
    const characterHeight = PLAYER_HEIGHT * displayScale;
    const oldCharacterHeight = PLAYER_HEIGHT * width / WIDTH;

    assert.ok(characterHeight >= 24);
    assert.ok(characterHeight > oldCharacterHeight * 1.3);
    assert.ok(viewport.width < WIDTH);
    assert.equal(viewport.height, HEIGHT);
  }
});

test("portrait, landscape, and fractional sizes use equal horizontal and vertical scales", () => {
  for (const [width, height] of [[288, 222], [358.5, 304.25], [780, 210], [846, 463.78]]) {
    const viewport = getGameViewport(width, height, 2.75);
    const scaleX = viewport.pixelWidth / viewport.width;
    const scaleY = viewport.pixelHeight / viewport.height;

    nearlyEqual(scaleX, scaleY);
    nearlyEqual(PLAYER_WIDTH * scaleX / (PLAYER_HEIGHT * scaleY), PLAYER_WIDTH / PLAYER_HEIGHT);
  }
});

test("camera keeps the player visible and never exposes space outside the world", () => {
  for (const viewWidth of [480, 720, 1480, WORLD_WIDTH + 100]) {
    for (const playerX of [0, 55, 500, 1800, CASTLE_X - 162, CASTLE_X + 70, WORLD_WIDTH - PLAYER_WIDTH]) {
      const cameraX = getCameraX(playerX, viewWidth);
      const screenX = playerX - cameraX;

      assert.ok(cameraX >= 0);
      assert.ok(cameraX <= Math.max(0, WORLD_WIDTH - viewWidth));
      assert.ok(screenX >= 0);
      assert.ok(screenX + PLAYER_WIDTH <= viewWidth);
    }
  }
});

test("zoomed camera leaves enough room to see obstacles ahead", () => {
  const viewWidth = getGameViewport(358, 304, 2).width;
  const screenX = 1800 - getCameraX(1800, viewWidth);
  const lookAhead = viewWidth - screenX - PLAYER_WIDTH;
  assert.ok(lookAhead > viewWidth / 2);
});

test("both characters at the castle balcony remain visible on a narrow frame", () => {
  const viewWidth = getGameViewport(288, 248, 2).width;
  const cameraX = getCameraX(CASTLE_X + 70, viewWidth);
  for (const x of [CASTLE_X + 70, CASTLE_X + 106]) {
    assert.ok(x >= cameraX);
    assert.ok(x + PLAYER_WIDTH <= cameraX + viewWidth);
  }
});

test("retina rendering is capped to keep canvas memory bounded", () => {
  const viewport = getGameViewport(360, 300, 4);
  assert.equal(viewport.pixelWidth, 720);
  assert.equal(viewport.pixelHeight, 600);
});

test("hidden or invalid frames do not create invalid canvas dimensions", () => {
  for (const [width, height] of [[0, 300], [360, 0], [-1, 400], [NaN, 300], [360, Infinity]]) {
    assert.equal(getGameViewport(width, height), null);
  }
  assert.equal(getGameViewport(360, 300, NaN).pixelWidth, 360);
});
