import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { drawPngSticker, getFrameStickerNames, getPhotoStickerLayout } from "../src/utils/photoboothStickers.js";

const themes = ["princess", "love-strip", "scrapbook", "royal", "birthday-doodle"];

test("all frame themes reference real PNG files with an alpha channel", async () => {
  const names = new Set(themes.flatMap(getFrameStickerNames));
  assert.equal(names.size, 5);
  for (const name of names) {
    const bytes = await readFile(new URL(`../public/photobooth/decorations/${name}.png`, import.meta.url));
    assert.equal(bytes.subarray(1, 4).toString(), "PNG");
    assert.equal(bytes[25], 6, `${name} must be RGBA`);
    assert.ok(bytes.readUInt32BE(16) > 0);
    assert.ok(bytes.readUInt32BE(20) > 0);
  }
});

test("single photo keeps all four corner ornaments inside its output canvas", () => {
  for (const theme of themes) {
    const placements = getPhotoStickerLayout(theme, [{ x: 90, y: 230, w: 720, h: 860 }]);
    assert.equal(placements.length, 4);
    for (const placement of placements) {
      assert.ok(placement.x >= 0 && placement.y >= 0);
      assert.ok(placement.x + placement.width <= 900);
      assert.ok(placement.y + placement.height <= 1320);
    }
  }
});

test("ornaments do not overlap across the narrow gaps in three and four photo strips", () => {
  for (const [count, y, height, gap, x, width] of [[3, 145, 510, 24, 100, 700], [4, 230, 760, 28, 120, 660]]) {
    const slots = Array.from({ length: count }, (_, index) => ({ x, y: y + index * (height + gap), w: width, h: height }));
    const placements = getPhotoStickerLayout("princess", slots);
    assert.equal(placements.length, count * 2 + 2);
    for (let i = 0; i < placements.length; i++) {
      for (let j = i + 1; j < placements.length; j++) {
        const a = placements[i];
        const b = placements[j];
        const overlap = a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
        assert.equal(overlap, false, `ornaments ${i} and ${j} collide in a ${count}-photo strip`);
      }
    }
  }
});

test("drawing a wide PNG into a square preserves its aspect ratio and restores the canvas", () => {
  const calls = [];
  const ctx = Object.fromEntries(["save", "translate", "rotate", "drawImage", "restore"].map(name => [name, (...args) => calls.push({ name, args })]));
  const image = { naturalWidth: 600, naturalHeight: 300 };
  drawPngSticker(ctx, image, { x: 10, y: 20, width: 100, height: 100, rotation: 12 });
  assert.equal(calls[0].name, "save");
  assert.deepEqual(calls.find(call => call.name === "translate").args, [60, 70]);
  assert.deepEqual(calls.find(call => call.name === "drawImage").args, [image, -50, -25, 100, 50]);
  assert.equal(calls.at(-1).name, "restore");
});
