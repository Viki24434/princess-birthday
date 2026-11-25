import test from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createPhotoAlbumClient, blobToBase64, base64ToBlob, MAX_PHOTO_BYTES } from "../src/services/photoAlbum.js";

const endpoint = "https://script.google.com/macros/s/test-deployment/exec";
const code = "kode-kenangan-pribadi";
const bytes = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, ...Array(24).fill(0)]);
const photo = () => ({ id: crypto.randomUUID(), frame: "princess", count: 3, createdAt: "2026-11-24T08:00:00.000Z", blob: new Blob([bytes], { type: "image/png" }) });
const response = data => ({ ok: true, json: async () => ({ ok: true, data }) });

test("album requests send the code in a simple POST body and never put it in the URL", async () => {
  const calls = [];
  const client = createPhotoAlbumClient(endpoint, async (url, options) => { calls.push({ url, options }); return response({ files: [], nextCursor: null }); });
  await client.list(code);
  assert.equal(calls[0].url, endpoint);
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.credentials, "omit");
  assert.equal(calls[0].options.headers["Content-Type"], "text/plain;charset=UTF-8");
  assert.deepEqual(JSON.parse(calls[0].options.body), { action: "list", code, cursor: null });
});

test("upload retains the same request id and transfers the PNG bytes without corruption", async () => {
  const original = photo();
  const client = createPhotoAlbumClient(endpoint, async (_url, options) => {
    const payload = JSON.parse(options.body);
    assert.equal(payload.photo.id, original.id);
    assert.equal(payload.photo.frame, original.frame);
    assert.deepEqual([...Buffer.from(payload.photo.base64, "base64")], [...bytes]);
    return response({ id: original.id, driveId: "remote-photo-123" });
  });
  assert.equal((await client.upload(code, original)).id, original.id);
});

test("private reads return an image Blob that can be displayed and downloaded", async () => {
  const original = photo();
  const encoded = await blobToBase64(original.blob);
  const client = createPhotoAlbumClient(endpoint, async (_url, options) => {
    assert.deepEqual(JSON.parse(options.body), { action: "read", code, driveId: "remote-photo-123" });
    return response({ mimeType: "image/png", base64: encoded });
  });
  const result = await client.read(code, "remote-photo-123");
  assert.equal(result.type, "image/png");
  assert.deepEqual(new Uint8Array(await result.arrayBuffer()), bytes);
});

test("credentials cannot be sent to an arbitrary endpoint or a development deployment", () => {
  for (const url of ["http://script.google.com/macros/s/id/exec", "https://example.com/exec", endpoint + "?code=secret", endpoint.replace("/exec", "/dev")]) {
    assert.throws(() => createPhotoAlbumClient(url));
  }
});

test("invalid formats and oversize photos fail before a network upload", async () => {
  let requests = 0;
  const client = createPhotoAlbumClient(endpoint, async () => { requests++; return response({}); });
  await assert.rejects(client.upload(code, { ...photo(), blob: new Blob([bytes], { type: "image/jpeg" }) }));
  await assert.rejects(client.upload(code, { ...photo(), blob: new Blob([new Uint8Array(MAX_PHOTO_BYTES + 1)], { type: "image/png" }) }), /8 MB/);
  assert.equal(requests, 0);
});

test("authentication failures and non-JSON deployment pages are reported clearly", async () => {
  const rejected = createPhotoAlbumClient(endpoint, async () => ({ ok: true, json: async () => ({ ok: false, error: { code: "UNAUTHORIZED", message: "Kode album belum cocok." } }) }));
  await assert.rejects(rejected.list(code), error => error.code === "UNAUTHORIZED");
  const html = createPhotoAlbumClient(endpoint, async () => ({ ok: true, json: async () => { throw new SyntaxError("HTML login page"); } }));
  await assert.rejects(html.list(code), /belum bisa dibuka/);
});

test("network timeouts and locking the album abort in-flight requests", async () => {
  const stalled = (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true }));
  const timeout = createPhotoAlbumClient(endpoint, stalled, 5);
  await assert.rejects(timeout.list(code), /belum merespons/);
  const client = createPhotoAlbumClient(endpoint, stalled);
  const controller = new AbortController();
  const pending = client.list(code, null, controller.signal);
  controller.abort();
  await assert.rejects(pending, error => error.name === "AbortError");
});

test("unexpected image types and broken image bodies cannot become a photo Blob", () => {
  assert.throws(() => base64ToBlob("not-an-image", "image/svg+xml"));
  assert.throws(() => base64ToBlob(btoa("this is not a PNG image"), "image/png"));
});
