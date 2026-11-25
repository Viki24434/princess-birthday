export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const FRAMES = ["princess", "love-strip", "scrapbook", "royal", "birthday-doodle"];

export function validatePhoto(photo) {
  if (!photo?.blob || photo.blob.type !== "image/png" || !FRAMES.includes(photo.frame)
    || ![1, 2, 3, 4].includes(photo.count) || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(photo.id)) {
    throw new Error("Hasil foto belum siap disimpan.");
  }
  if (photo.blob.size > MAX_PHOTO_BYTES) throw new Error("Ukuran foto melebihi 8 MB. Coba ambil lebih sedikit foto.");
}

export async function blobToBase64(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 32768) binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
  return btoa(binary);
}

export function base64ToBlob(base64, mimeType = "image/png") {
  if (mimeType !== "image/png" || typeof base64 !== "string" || base64.length > Math.ceil(MAX_PHOTO_BYTES / 3) * 4) {
    throw new Error("Data foto dari album tidak valid.");
  }
  let binary;
  try { binary = atob(base64); } catch { throw new Error("Data foto dari album tidak valid."); }
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
  if (bytes.length < 24 || [137, 80, 78, 71, 13, 10, 26, 10].some((byte, index) => bytes[index] !== byte)) throw new Error("Data foto dari album tidak valid.");
  return new Blob([bytes], { type: mimeType });
}

export function createPhotoAlbumClient(endpoint, fetchImpl = globalThis.fetch, timeoutMs = 45000) {
  let url;
  try { url = new URL(endpoint); } catch { throw new Error("Album kenangan belum dihubungkan."); }
  if (url.protocol !== "https:" || url.hostname !== "script.google.com" || !/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname) || url.search || url.hash) {
    throw new Error("Alamat album kenangan belum sesuai.");
  }

  async function request(action, code, data = {}, signal) {
    if (typeof code !== "string" || code.trim().length < 12 || code.trim().length > 128) throw new Error("Masukkan kode album yang diberikan pemilik website.");
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) throw new DOMException("Dibatalkan", "AbortError");
    signal?.addEventListener("abort", abort, { once: true });
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
    try {
      const response = await fetchImpl(url.href, {
        method: "POST", credentials: "omit", redirect: "follow", signal: controller.signal,
        // Simple request: Apps Script tidak menyediakan handler OPTIONS untuk preflight.
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ action, code: code.trim(), ...data })
      });
      if (!response.ok) throw new Error("Album belum bisa dihubungi. Coba lagi sebentar.");
      let result;
      try { result = await response.json(); } catch { throw new Error("Album belum bisa dibuka. Coba lagi sebentar."); }
      if (!result.ok) {
        const error = new Error(result.error?.message || "Foto belum berhasil dikirim ke album.");
        error.code = result.error?.code;
        throw error;
      }
      return result.data;
    } catch (error) {
      if (signal?.aborted) throw error;
      if (timedOut) throw new Error("Album belum merespons. Foto yang tertunda bisa dikirim lagi nanti.", { cause: error });
      if (error instanceof TypeError) throw new Error("Koneksi ke album terputus. Periksa internet lalu coba lagi.", { cause: error });
      throw error;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
    }
  }

  return {
    list: (code, cursor = null, signal) => request("list", code, { cursor }, signal),
    async upload(code, photo, signal) {
      validatePhoto(photo);
      return request("upload", code, { photo: {
        id: photo.id, frame: photo.frame, count: photo.count, base64: await blobToBase64(photo.blob)
      } }, signal);
    },
    async read(code, driveId, signal) {
      const data = await request("read", code, { driveId }, signal);
      return base64ToBlob(data.base64, data.mimeType);
    }
  };
}
