import "fake-indexeddb/auto";
import test from "node:test";
import assert from "node:assert/strict";
import { createPhotoAlbumStore } from "../src/services/photoAlbumStore.js";
import { createPhotoAlbumController } from "../src/services/photoAlbumController.js";

function photo() {
  return { id: crypto.randomUUID(), frame: "princess", count: 3, createdAt: new Date().toISOString(), blob: new Blob(["local png bytes"], { type: "image/png" }) };
}
function remote(record) { return { id: record.id, driveId: "drive-" + record.id, frame: record.frame, count: record.count, createdAt: record.createdAt, name: "foto.png" }; }
const freshStore = () => createPhotoAlbumStore("test-photos-" + crypto.randomUUID());
const session = () => ({ code: "" });
const code = "kode-kenangan-pribadi";

test("a pending PNG survives closing and reopening the actual IndexedDB database", async () => {
  const name = "test-photos-" + crypto.randomUUID();
  const first = createPhotoAlbumStore(name);
  const record = photo();
  await first.save(record);
  await first.close();
  const reopened = createPhotoAlbumStore(name);
  const saved = (await reopened.list())[0];
  assert.equal(saved.id, record.id);
  assert.equal(await saved.blob.text(), await record.blob.text());
  await reopened.close();
});

test("local PNG bytes are removed only after a matching remote confirmation", async () => {
  const store = freshStore(), record = photo();
  await store.save(record);
  await assert.rejects(store.markUploaded(record.id, { ...remote(record), id: "wrong-id" }));
  assert.ok((await store.list())[0].blob);
  await store.markUploaded(record.id, remote(record));
  assert.equal((await store.list())[0].blob, undefined);
  assert.equal((await store.list())[0].driveId, remote(record).driveId);
  await store.save(record);
  assert.equal((await store.list())[0].blob, undefined, "clicking save twice must not queue a second upload");
  await store.close();
});

test("an offline upload remains in IndexedDB and syncs when the album is opened again", async () => {
  const store = freshStore(), record = photo();let online = false;
  const client = { list: async () => ({ files: [], nextCursor: null }), upload: async itemCode => {
    assert.equal(itemCode, code);if (!online) throw new Error("Koneksi terputus");return remote(record);
  } };
  const first = createPhotoAlbumController({ store, client, session: session() });
  await first.initialize();await first.unlock(code);
  assert.equal(await first.save(record), false);
  assert.ok((await store.list())[0].blob);
  assert.ok(!first.getSnapshot().message.includes("tersimpan di Google Drive"));
  first.dispose();online = true;
  const reopened = createPhotoAlbumController({ store, client, session: session() });
  await reopened.initialize();await reopened.unlock(code);
  assert.equal(reopened.getSnapshot().records[0].driveId, remote(record).driveId);
  assert.equal((await store.list())[0].blob, undefined);
  assert.match(reopened.getSnapshot().message, /Google Drive/);
  reopened.dispose();await store.close();
});

test("without a Drive deployment the interface reports a local copy, not a cloud success", async () => {
  const store = freshStore();
  const album = createPhotoAlbumController({ store, client: null, session: session() });
  await album.initialize();await album.save(photo());
  assert.equal(album.getSnapshot().configured, false);
  assert.match(album.getSnapshot().message, /perangkat ini/);
  assert.ok(album.getSnapshot().records[0].blob);
  assert.equal(album.getSnapshot().records[0].driveId, undefined);
  album.dispose();await store.close();
});

test("locking while an upload completes cannot reopen the album or expose remote photos", async () => {
  const store = freshStore(), record = photo();let finishUpload, notify;
  const started = new Promise(resolve => { notify = resolve; });
  const client = { list: async () => ({ files: [], nextCursor: null }), upload: () => new Promise(resolve => { finishUpload = resolve; notify(); }) };
  const credentials = session(), album = createPhotoAlbumController({ store, client, session: credentials });
  await album.initialize();await album.unlock(code);
  const saving = album.save(record);await started;album.lock();finishUpload(remote(record));await saving;
  assert.equal(album.getSnapshot().unlocked, false);
  assert.equal(album.getSnapshot().files.length, 0);
  assert.equal(album.getSnapshot().selected, null);
  assert.equal(credentials.code, "");
  assert.ok((await store.list())[0].blob, "an unconfirmed completion must leave a retryable PNG");
  album.dispose();await store.close();
});

test("private photos can be opened after unlock and locking clears the preview", async () => {
  const store = freshStore(), record = photo(), metadata = remote(record);
  const client = { list: async () => ({ files: [metadata], nextCursor: null }), read: async () => record.blob };
  const album = createPhotoAlbumController({ store, client, session: session() });
  await album.initialize();await album.unlock(code);await album.open(metadata);
  assert.equal(await album.getSnapshot().selected.blob.text(), await record.blob.text());
  album.lock();assert.equal(album.getSnapshot().selected, null);
  assert.equal(await album.open(metadata), false);
  assert.equal(await album.open({ ...metadata, blob: record.blob }), false, "cached uploaded pixels must not bypass the album lock");
  album.dispose();await store.close();
});

test("Drive can still save a photo when browser storage is unavailable", async () => {
  const record = photo();
  const store = { list: async () => [], save: async () => { throw new Error("storage blocked"); }, markUploaded: async () => { throw new Error("storage blocked"); } };
  const client = { list: async () => ({ files: [], nextCursor: null }), upload: async () => remote(record) };
  const album = createPhotoAlbumController({ store, client, session: session() });
  await album.initialize();await album.unlock(code);
  assert.equal(await album.save(record), true);
  assert.equal(album.getSnapshot().records[0].driveId, remote(record).driveId);
  assert.match(album.getSnapshot().message, /tersimpan di Google Drive/);
  album.dispose();
});

test("a failed pending sync reports an error rather than leaving a stale sending status", async () => {
  const store = freshStore();await store.save(photo());
  const client = { list: async () => ({ files: [], nextCursor: null }), upload: async () => { throw new Error("Koneksi terputus"); } };
  const album = createPhotoAlbumController({ store, client, session: session() });
  await album.initialize();await album.unlock(code);
  assert.equal(album.getSnapshot().busy, "");
  assert.equal(album.getSnapshot().message, "");
  assert.match(album.getSnapshot().error, /Koneksi/);
  assert.ok((await store.list())[0].blob);
  album.dispose();await store.close();
});

test("the album can initialize again after a development StrictMode cleanup", async () => {
  const store = freshStore();await store.save(photo());
  const album = createPhotoAlbumController({ store, client: null, session: session() });
  const first = album.initialize();album.dispose();const second = album.initialize();
  await Promise.all([first, second]);
  assert.equal(album.getSnapshot().busy, "");
  assert.equal(album.getSnapshot().records.length, 1);
  album.dispose();await store.close();
});
