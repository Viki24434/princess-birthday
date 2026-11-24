import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { getCharacterExpression, getCharacterHeadSprite } from "../src/game/rendering/characterExpressions.js";

const idle = { onGround: true, onLadder: false, vx: 0, facing: "depan" };
const expressions = ["Normal", "Kedip", "Terkejut", "Sedih", "Malu", "Senang"];
const loaded = () => ({ complete: true, naturalWidth: 236, naturalHeight: 242 });

test("each side expression uses one PNG for both directions and only flips the left-facing head", () => {
  for (const kind of ["cowok", "cewek"]) {
    const role = kind === "cowok" ? "player" : "partner";
    const sprites = Object.fromEntries(expressions.map(expression => [kind + "Samping" + expression, loaded()]));
    const cases = [
      [{}, {}, 0],
      [{}, {}, role === "player" ? 3600 : 2500],
      [{ onGround: false }, role === "player" ? {} : { finishStep: "slide" }, 0],
      [{}, { failed: true }, 0],
      [{}, { finishStep: "meet" }, 0],
      [{}, { celebrating: true }, 0]
    ];
    for (const [index, [state, context, time]] of cases.entries()) {
      const right = getCharacterHeadSprite(sprites, kind, { ...idle, ...state, facing: "kanan" }, time, { ...context, role });
      const left = getCharacterHeadSprite(sprites, kind, { ...idle, ...state, facing: "kiri" }, time, { ...context, role });
      assert.equal(right.image, sprites[kind + "Samping" + expressions[index]]);
      assert.equal(left.image, right.image);
      assert.equal(right.flipX, false);
      assert.equal(left.flipX, true);
      assert.equal(right.frame, undefined);
      assert.equal(left.frame, undefined);
    }
  }
});

test("walking and climbing reuse the original neutral profile in either direction", () => {
  const neutral = loaded();
  for (const facing of ["kiri", "kanan"]) {
    for (const state of [{ vx: facing === "kiri" ? -5 : 5 }, { onGround: false, onLadder: true }]) {
      const sprite = getCharacterHeadSprite({ cowokSampingNormal: neutral }, "cowok", { ...idle, ...state, facing }, 0);
      assert.equal(sprite.image, neutral);
      assert.equal(sprite.flipX, facing === "kiri");
    }
  }
});

test("missing, loading, and broken expressions fall back to the neutral side PNG and preserve the flip", () => {
  const original = loaded();
  for (const facing of ["kiri", "kanan"]) {
    for (const expression of [undefined, { complete: false }, { complete: true, naturalWidth: 0 }]) {
      const sprite = getCharacterHeadSprite({ cowokSampingNormal: original, cowokTerkejut: {}, cowokSampingTerkejut: expression },
        "cowok", { ...idle, facing, onGround: false }, 0);
      assert.equal(sprite.image, original);
      assert.equal(sprite.flipX, facing === "kiri");
    }
  }
});

test("the balcony celebration keeps the original front-facing happy PNG without a flip", () => {
  const happy = loaded();
  const sprite = getCharacterHeadSprite({ cowokSenang: happy, cowokSampingSenang: loaded() }, "cowok", idle, 0, { finishStep: "celebrate" });
  assert.equal(sprite.image, happy);
  assert.ok(!sprite.flipX);
});

test("idle faces blink briefly and each character has a different blink time", () => {
  assert.equal(getCharacterExpression(idle, 0), "Normal");
  assert.equal(getCharacterExpression(idle, 3600), "Kedip");
  assert.equal(getCharacterExpression(idle, 3740), "Normal");
  assert.equal(getCharacterExpression(idle, 7600), "Kedip");
  assert.equal(getCharacterExpression(idle, 3600, { role: "partner" }), "Normal");
  assert.equal(getCharacterExpression(idle, 2500, { role: "partner" }), "Kedip");
});

test("movement and climbing keep the character facing the direction of travel", () => {
  assert.equal(getCharacterExpression({ ...idle, vx: 5 }, 0), "Kanan");
  assert.equal(getCharacterExpression({ ...idle, vx: -5, facing: "kiri" }, 0), "Kiri");
  assert.equal(getCharacterExpression({ ...idle, onGround: false, onLadder: true }, 0), "Kanan");
});

test("only the playable character is surprised in the air", () => {
  assert.equal(getCharacterExpression({ ...idle, onGround: false, vy: -5 }, 0), "Terkejut");
  assert.equal(getCharacterExpression({ ...idle, onGround: false, vy: 10 }, 0), "Terkejut");
  assert.equal(getCharacterExpression({ vx: 0 }, 0, { role: "partner" }), "Normal");
});

test("failure overrides movement and checkpoint celebrations until retry", () => {
  assert.equal(getCharacterExpression({ ...idle, vx: 5 }, 0, { failed: true, celebrating: true }), "Sedih");
  assert.equal(getCharacterExpression(idle, 0, { celebrating: true }), "Senang");
  assert.equal(getCharacterExpression(idle, 0, { failed: false }), "Normal");
});

test("front-facing characters can use expression PNGs during the ending", () => {
  for (const role of ["player", "partner"]) {
    for (const finishStep of ["meet", "together", "enter"]) {
      assert.equal(getCharacterExpression(idle, 0, { role, finishStep }), "Malu");
    }
    assert.equal(getCharacterExpression(idle, 0, { role, finishStep: "slide" }), role === "partner" ? "Terkejut" : "Senang");
    for (const finishStep of ["walk", "appear", "celebrate", "done"]) {
      assert.equal(getCharacterExpression(idle, 0, { role, finishStep }), "Senang");
    }
  }
});

test("the front-facing expression PNGs remain available", () => {
  for (const character of ["cewek", "cowok"]) {
    for (const expression of ["normal", "senang", "kedip", "malu", "sedih", "terkejut"]) {
      assert.ok(existsSync(new URL(`../public/game/characters/${character}/${expression}.png`, import.meta.url)));
    }
  }
});

test("each expression is a separate transparent PNG with consistent head dimensions", () => {
  for (const kind of ["cowok", "cewek"]) {
    let size;
    for (const expression of expressions) {
      const png = readFileSync(new URL(`../public/game/characters/${kind}/samping-${expression.toLowerCase()}.png`, import.meta.url));
      assert.equal(png.subarray(1, 4).toString(), "PNG");
      const current = { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
      assert.ok(current.width >= 128 && current.width <= 512);
      assert.ok(current.height >= 128 && current.height <= 512);
      if (size) assert.deepEqual(current, size);
      else size = current;
      assert.equal(png[25], 6, "the expression must retain RGBA transparency");
    }
  }
});
