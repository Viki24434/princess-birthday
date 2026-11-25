import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { Buffer } from "node:buffer";
import "fake-indexeddb/auto";
import { createPhotoAlbumClient } from "../src/services/photoAlbum.js";
import { createPhotoAlbumStore } from "../src/services/photoAlbumStore.js";
import { createPhotoAlbumController } from "../src/services/photoAlbumController.js";

const source = await readFile(new URL("../google-apps-script/Code.gs", import.meta.url), "utf8");
const code = "kode-kenangan-pribadi";
const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, ...Array(24).fill(0)]);
const requestId = number => `00000000-0000-4000-8000-${String(number).padStart(12, "0")}`;
const photo = number => ({ id: requestId(number), frame: "princess", count: 3, base64: png.toString("base64") });

function backend({ configured = true } = {}) {
  const properties = new Map([["DRIVE_FOLDER_ID", "owner-folder"], ["ALBUM_ACCESS_CODE", code]]);
  const files = [], logs = [];
  let creates = 0, folderReads = 0, blobReads = 0, busy = false, releases = 0;
  const iterator = values => { let index = 0; return { hasNext: () => index < values.length, next: () => values[index++] }; };
  const blob = (bytes, mime = "image/png", name = "image.png") => ({ getBytes: () => [...bytes], getContentType: () => mime, getName: () => name });
  const folder = {
    getId: () => "owner-folder", getName: () => "Kenangan Kita",
    getFilesByName: name => iterator(files.filter(file => file.parent === "owner-folder" && file.getName() === name)),
    getFilesByType: type => iterator(files.filter(file => file.parent === "owner-folder" && file.getMimeType() === type)),
    createFile(image) { creates++; return add({ name: image.getName(), data: image.getBytes(), mime: image.getContentType() }); }
  };
  function add({ name, data = png, mime = "image/png", parent = "owner-folder", day = 1, thumbnail = null, trashed = false }) {
    const id = "drive-file-" + String(files.length + 1).padStart(6, "0");
    const file = { parent, getId: () => id, getName: () => name, getMimeType: () => mime, isTrashed: () => trashed,
      getSize: () => data.length, getDateCreated: () => new Date(`2026-11-${String(day).padStart(2, "0")}T08:00:00Z`),
      getThumbnail: () => thumbnail,
      getParents: () => iterator([{ getId: () => parent }]),
      getBlob() { blobReads++; return blob(data, mime, name); }
    };
    files.push(file);return file;
  }
  const context = vm.createContext({
    console: { log: message => logs.push(message) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => properties.get(key) ?? null, setProperty: (key, value) => properties.set(key, value), deleteProperty: key => properties.delete(key) }) },
    DriveApp: { getFolderById(id) { folderReads++; if (id !== "owner-folder") throw new Error("private folder missing"); return folder; }, getFileById: id => { const file = files.find(file => file.getId() === id); if (!file) throw new Error("private details"); return file; } },
    Utilities: { DigestAlgorithm: { SHA_256: "sha256" }, Charset: { UTF_8: "utf8" },
      computeDigest: (_algorithm, value) => [...createHash("sha256").update(value).digest()].map(byte => byte > 127 ? byte - 256 : byte),
      base64Encode: value => Buffer.from(value.map(byte => (byte + 256) % 256)).toString("base64"),
      base64Decode: value => [...Buffer.from(value, "base64")].map(byte => byte > 127 ? byte - 256 : byte), newBlob: blob },
    LockService: { getScriptLock: () => ({ tryLock: () => !busy, releaseLock: () => { releases++; } }) },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: text => ({ text, setMimeType() { return this; } }) }
  });
  vm.runInContext(source, context);
  if (configured) context.setupAlbum();
  return {
    properties, files, logs, context, add, blob,
    post: (action, data = {}, password = code) => JSON.parse(context.doPost({ postData: { contents: JSON.stringify({ action, code: password, ...data }) } }).text),
    counters: () => ({ creates, folderReads, blobReads, releases }), setBusy: value => { busy = value; }
  };
}

test("owner setup hashes the album code, removes plaintext, and does not log the code", () => {
  const app = backend();
  assert.equal(app.properties.has("ALBUM_ACCESS_CODE"), false);
  assert.equal(app.properties.get("ALBUM_ACCESS_HASH").length, 64);
  assert.ok(app.logs.every(line => !line.includes(code)));
});

test("wrong or missing access codes cannot read Drive metadata or upload", () => {
  const app = backend();const before = app.counters().folderReads;
  for (const action of ["upload", "list", "read"]) assert.equal(app.post(action, { photo: photo(1) }, "wrong-code-long-enough").error.code, "UNAUTHORIZED");
  assert.equal(app.counters().folderReads, before);
  assert.equal(app.counters().creates, 0);
});

test("an unconfigured album gives an honest setup status rather than accepting photos", () => {
  const app = backend({ configured: false });
  assert.equal(app.post("upload", { photo: photo(1) }).error.code, "NOT_CONFIGURED");
  assert.equal(app.counters().creates, 0);
});

test("an upload saves PNG bytes in the owner folder and retries reuse the same file", () => {
  const app = backend();
  const first = app.post("upload", { photo: photo(1) });
  const retry = app.post("upload", { photo: photo(1) });
  assert.equal(first.ok, true);
  assert.equal(first.data.id, requestId(1));
  assert.equal(first.data.driveId, retry.data.driveId);
  assert.equal(app.counters().creates, 1);
  assert.equal(app.counters().releases, 2);
  assert.equal(app.files[0].parent, "owner-folder");
  assert.deepEqual(app.files[0].getBlob().getBytes().map(byte => (byte + 256) % 256), [...png]);
});

test("malformed images, path-like names, oversized data, and a busy upload lock do not create files", () => {
  const app = backend();
  assert.equal(app.post("upload", { photo: { ...photo(1), base64: btoa("this is not a png image file") } }).error.code, "INVALID_PHOTO");
  assert.equal(app.post("upload", { photo: { ...photo(1), id: "../../other-folder" } }).error.code, "INVALID_PHOTO");
  app.context.ALBUM_MAX_BYTES = 40;
  assert.equal(app.post("upload", { photo: { ...photo(1), base64: Buffer.concat([png, Buffer.alloc(20)]).toString("base64") } }).error.code, "TOO_LARGE");
  app.setBusy(true);
  assert.equal(app.post("upload", { photo: photo(1) }).error.code, "BUSY");
  assert.equal(app.counters().creates, 0);
});

test("gallery pagination includes only album PNGs and sorts the newest memories first", () => {
  const app = backend();
  for (let number = 1; number <= 14; number++) app.add({ name: `princess-${requestId(number)}--princess--3.png`, day: number });
  app.add({ name: "private-unrelated-photo.png" });
  app.add({ name: `princess-${requestId(20)}--princess--3.png`, parent: "other-folder" });
  const first = app.post("list").data;
  assert.equal(first.files.length, 12);
  assert.equal(first.files[0].id, requestId(14));
  assert.equal(first.nextCursor, "12");
  const next = app.post("list", { cursor: first.nextCursor }).data;
  assert.equal(next.files.length, 2);
  assert.equal(next.nextCursor, null);
});

test("photo reads reject files outside the configured folder before accessing their bytes", () => {
  const app = backend();
  const outsider = app.add({ name: `princess-${requestId(1)}--princess--3.png`, parent: "other-folder" });
  const unrelated = app.add({ name: "private-photo.png" });
  assert.equal(app.post("read", { driveId: outsider.getId() }).error.code, "NOT_FOUND");
  assert.equal(app.post("read", { driveId: unrelated.getId() }).error.code, "NOT_FOUND");
  assert.equal(app.counters().blobReads, 0);
  const uploaded = app.post("upload", { photo: photo(2) }).data;
  const read = app.post("read", { driveId: uploaded.driveId });
  assert.equal(read.ok, true);
  assert.equal(read.data.base64, png.toString("base64"));
});

test("GET reveals only the service status and no folder, credentials, or photos", () => {
  const app = backend();const before = app.counters().folderReads;
  const status = JSON.parse(app.context.doGet().text);
  assert.deepEqual(status, { ok: true, data: { service: "princess-birthday-album", version: 1 } });
  assert.equal(app.counters().folderReads, before);
});

test("thumbnail responses accept small image blobs and ignore unsafe or oversized thumbnails", () => {
  const app = backend();
  app.add({ name: `princess-${requestId(1)}--princess--3.png`, thumbnail: app.blob([1, 2, 3], "image/jpeg") });
  app.add({ name: `princess-${requestId(2)}--princess--3.png`, thumbnail: app.blob([1, 2, 3], "image/svg+xml") });
  const files = app.post("list").data.files;
  assert.match(files.find(file => file.id === requestId(1)).thumbnail, /^data:image\/jpeg;base64,/);
  assert.equal(files.find(file => file.id === requestId(2)).thumbnail, undefined);
});

test("client, IndexedDB, and Apps Script recover a lost upload reply without duplicating the Drive file", async () => {
  const app = backend();let dropReply = true;
  const client = createPhotoAlbumClient("https://script.google.com/macros/s/test-album/exec", async (_url, options) => {
    const payload = JSON.parse(options.body);
    const result = app.context.doPost({ postData: { contents: options.body } });
    if (payload.action === "upload" && dropReply) { dropReply = false; throw new TypeError("connection lost after upload"); }
    return { ok: true, json: async () => JSON.parse(result.text) };
  });
  const store = createPhotoAlbumStore("round-trip-" + crypto.randomUUID());
  const capture = { id: requestId(50), frame: "birthday-doodle", count: 2, createdAt: new Date().toISOString(), blob: new Blob([png], { type: "image/png" }) };
  const first = createPhotoAlbumController({ client, store, session: { code: "" } });
  await first.initialize();await first.unlock(code);
  assert.equal(await first.save(capture), false);
  assert.equal(app.counters().creates, 1);
  assert.ok((await store.list())[0].blob);
  assert.ok(!first.getSnapshot().message.includes("tersimpan di Google Drive"));
  first.dispose();
  const reopened = createPhotoAlbumController({ client, store, session: { code: "" } });
  await reopened.initialize();await reopened.unlock(code);
  assert.equal(app.counters().creates, 1);
  assert.equal((await store.list())[0].blob, undefined);
  const file = reopened.getSnapshot().files[0];
  assert.equal(file.count, 2, "a session stopped after two photos must still be preserved");
  await reopened.open(file);
  assert.deepEqual([...new Uint8Array(await reopened.getSnapshot().selected.blob.arrayBuffer())], [...png]);
  reopened.lock();assert.equal(reopened.getSnapshot().selected, null);
  reopened.dispose();await store.close();
});
