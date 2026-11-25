import { openDB } from "idb";
import { validatePhoto } from "./photoAlbum.js";

export function createPhotoAlbumStore(name = "princess-birthday-photos") {
  let database;
  async function db() {
    if (!database) database = openDB(name, 1, {
      upgrade(connection) { connection.createObjectStore("photos", { keyPath: "id" }); }
    }).catch(error => { database = null; throw error; });
    return database;
  }
  return {
    async list() {
      const records = await (await db()).getAll("photos");
      return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async save(photo) {
      validatePhoto(photo);
      const connection = await db();
      const existing = await connection.get("photos", photo.id);
      if (existing?.driveId) return existing;
      const record = { id: photo.id, frame: photo.frame, count: photo.count, createdAt: photo.createdAt || new Date().toISOString(), blob: photo.blob };
      await connection.put("photos", record);
      return record;
    },
    async markUploaded(id, remote) {
      if (remote?.id !== id || !remote.driveId) throw new Error("Konfirmasi penyimpanan foto tidak valid.");
      // Setelah konfirmasi Drive, tidak perlu menyimpan PNG besar dua kali di perangkat.
      const record = { id, driveId: remote.driveId, frame: remote.frame, count: remote.count, createdAt: remote.createdAt, name: remote.name };
      await (await db()).put("photos", record);
      return record;
    },
    async close() { if (database) (await database).close(); database = null; }
  };
}
