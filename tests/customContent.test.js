import test from "node:test";
import assert from "node:assert/strict";
import { formatContent, resolveAssetUrl } from "../src/utils/customContent.js";

test("personal content replaces names inside nested paragraphs without changing source JSON", () => {
  const source = { title: "Hai, {nickname} ♡", paragraphs: ["Dari {sender}", "Untuk {name}"], candles: 3, optional: null };
  const result = formatContent(source, { nickname: "Nana", name: "Putri", sender: "Viki" });
  assert.deepEqual(result, { title: "Hai, Nana ♡", paragraphs: ["Dari Viki", "Untuk Putri"], candles: 3, optional: null });
  assert.equal(source.title, "Hai, {nickname} ♡");
});

test("game placeholders can be filled after recipient placeholders without interpreting replacement characters", () => {
  const personalized = formatContent("{nickname}, kumpulkan {hearts} hati. {unknown}", { nickname: "$& Putri" });
  assert.equal(formatContent(personalized, { hearts: 6 }), "$& Putri, kumpulkan 6 hati. {unknown}");
});

test("public image paths keep the GitHub Pages subfolder", () => {
  assert.equal(resolveAssetUrl("images/foto kita.jpg", "/princess-birthday/"), "/princess-birthday/images/foto kita.jpg");
  assert.equal(resolveAssetUrl("/game/memories/foto.png", "/princess-birthday/"), "/princess-birthday/game/memories/foto.png");
  assert.equal(resolveAssetUrl("images/foto.jpg", "./"), "./images/foto.jpg");
  assert.equal(resolveAssetUrl("images/foto.jpg", "/"), "/images/foto.jpg");
});

test("direct internet image URLs keep their host and query instead of receiving the deployment base", () => {
  const image = "https://images.example.com/photo.png?size=large&v=2";
  assert.equal(resolveAssetUrl(image, "/princess-birthday/"), image);
  assert.equal(resolveAssetUrl(" https://images.example.com/photo.png ", "/"), "https://images.example.com/photo.png");
});

test("missing, invalid and unsupported image addresses are ignored", () => {
  for (const image of [null, "", "  ", "javascript:alert(1)", "data:image/png;base64,123", "file:///photo.png", "//example.com/photo.png", "https://"]) {
    assert.equal(resolveAssetUrl(image, "/princess-birthday/"), "");
  }
});
