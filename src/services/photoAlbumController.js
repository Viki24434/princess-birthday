import { validatePhoto } from "./photoAlbum.js";

// Kode hanya di memori tab ini, tidak ditulis ke URL, localStorage, atau bundle.
export const photoAlbumSession = { code: "" };

export function createPhotoAlbumController({ client, store, session = photoAlbumSession }) {
  let code = client ? session.code : "";
  let active = null;
  let alive = true;
  const listeners = new Set();
  let state = { records: [], files: [], nextCursor: null, unlocked: Boolean(code), configured: Boolean(client), busy: "", error: "", message: "", selected: null };

  function update(patch, signal) {
    if (!alive || signal?.aborted) return;
    state = { ...state, ...patch };
    listeners.forEach(listener => listener());
  }

  async function run(label, operation) {
    if (active) return false;
    const controller = new AbortController();
    active = controller;
    update({ busy: label, error: "", message: "" });
    try {
      await operation(controller.signal);
      return !controller.signal.aborted;
    } catch (error) {
      if (controller.signal.aborted) return false;
      if (error.code === "UNAUTHORIZED") {
        code = ""; session.code = "";
        update({ unlocked: false, files: [], selected: null });
      }
      update({ error: error.message || "Album belum bisa dihubungi. Coba lagi sebentar.", message: "" }, controller.signal);
      return false;
    } finally {
      if (active === controller) { active = null; update({ busy: "" }, controller.signal); }
    }
  }

  async function localRecords(signal) {
    const records = await store.list();
    update({ records }, signal);
    return records;
  }

  async function uploadOne(photo, signal) {
    const remote = await client.upload(code, photo, signal);
    if (signal.aborted) return;
    if (remote?.id !== photo.id || !remote.driveId) throw new Error("Album belum mengonfirmasi foto ini. Salinan perangkat tetap disimpan.");
    let stored = remote;
    try { stored = await store.markUploaded(photo.id, remote); }
    catch { /* Drive sudah mengonfirmasi; galeri tetap menampilkan hasilnya. */ }
    update({
      records: [{ ...stored, blob: photo.blob }, ...state.records.filter(record => record.id !== photo.id)],
      files: [remote, ...state.files.filter(file => file.id !== photo.id)]
    }, signal);
  }

  async function sync(signal) {
    let records;
    try { records = await localRecords(signal); }
    catch {
      records = state.records;
      if (!records.some(record => !record.driveId && record.blob)) {
        update({ error: "Album terbuka, tetapi salinan di perangkat ini belum bisa dibaca. Foto baru tetap bisa dikirim." }, signal);
        return;
      }
    }
    const pending = records.filter(record => !record.driveId && record.blob);
    for (const [index, photo] of pending.entries()) {
      if (signal.aborted) return;
      update({ message: `Mengirim foto ${index + 1} dari ${pending.length} ke album…` }, signal);
      await uploadOne(photo, signal);
    }
    update({ message: pending.length ? "Foto kenangan sudah tersimpan di Google Drive ♡" : "Album sudah diperbarui." }, signal);
  }

  async function list(cursor, append, signal) {
    const page = await client.list(code, cursor, signal);
    if (!Array.isArray(page?.files)) throw new Error("Isi album belum bisa dibaca.");
    const combined = append ? [...state.files, ...page.files] : page.files;
    update({ files: [...new Map(combined.map(file => [file.id, file])).values()], nextCursor: page.nextCursor }, signal);
  }

  return {
    getSnapshot: () => state,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    initialize() {
      alive = true;
      return run("loading", async signal => {
        try { await localRecords(signal); }
        catch { update({ error: "Salinan foto di perangkat ini belum bisa dibuka. Kamu tetap bisa memakai album online atau mengunduh PNG." }, signal); }
        if (code && client && !signal.aborted) await list(null, false, signal);
      });
    },
    unlock(input) {
      return run("unlock", async signal => {
        if (!client) throw new Error("Album Google Drive belum dihubungkan oleh pemilik website.");
        const candidate = input.trim();
        const page = await client.list(candidate, null, signal);
        if (signal.aborted) return;
        if (!Array.isArray(page?.files)) throw new Error("Isi album belum bisa dibaca.");
        code = candidate; session.code = code;
        update({ unlocked: true, files: page.files, nextCursor: page.nextCursor }, signal);
        await sync(signal);
      });
    },
    lock() {
      active?.abort(); active = null; code = ""; session.code = "";
      update({ unlocked: false, busy: "", files: [], nextCursor: null, selected: null, error: "", message: "Album dikunci.",
        records: state.records.map(record => record.driveId ? { ...record, blob: undefined } : record) });
    },
    save(photo) {
      return run("save", async signal => {
        validatePhoto(photo);
        let stored;
        try { stored = await store.save(photo); }
        catch {
          if (!code || !client) throw new Error("Foto belum tersimpan. Gunakan tombol unduh PNG, lalu coba lagi.");
          stored = photo;
        }
        update({ records: [stored, ...state.records.filter(record => record.id !== stored.id)] }, signal);
        if (stored.driveId) { update({ message: "Foto ini sudah tersimpan di Google Drive ♡" }, signal); return; }
        if (code && client && !signal.aborted) {
          await uploadOne(stored, signal);
          update({ message: "Foto kenangan sudah tersimpan di Google Drive ♡" }, signal);
        } else {
          update({ message: "Salinan tersimpan di perangkat ini. Buka album untuk mengirimnya ke Google Drive." }, signal);
        }
      });
    },
    syncPending() {
      return run("sync", async signal => {
        if (!code || !client) throw new Error("Buka album dengan kode akses terlebih dahulu.");
        await sync(signal);
      });
    },
    reload(more = false) {
      return run("loading", async signal => {
        if (!code || !client) throw new Error("Buka album terlebih dahulu.");
        await list(more ? state.nextCursor : null, more, signal);
      });
    },
    open(photo) {
      return run("read", async signal => {
        if (photo.driveId && !code) throw new Error("Buka album terlebih dahulu untuk melihat foto ini.");
        const blob = photo.blob || (code && client && await client.read(code, photo.driveId, signal));
        if (!blob) throw new Error("Buka album terlebih dahulu untuk melihat foto ini.");
        update({ selected: { blob, name: photo.name || "foto-kenangan.png" } }, signal);
      });
    },
    closePreview() { update({ selected: null }); },
    dispose() { alive = false; active?.abort(); active = null; }
  };
}
