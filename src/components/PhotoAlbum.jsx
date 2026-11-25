import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPhotoAlbumClient } from "../services/photoAlbum";
import { createPhotoAlbumStore } from "../services/photoAlbumStore";
import { createPhotoAlbumController } from "../services/photoAlbumController";

const store = createPhotoAlbumStore();
const endpoint = import.meta.env.VITE_DRIVE_ALBUM_URL;
function albumClient() {
  try { return endpoint ? createPhotoAlbumClient(endpoint) : null; }
  catch { return null; }
}

function PhotoImage({ photo }) {
  const imageRef = useRef(null);
  const thumbnail = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/.test(photo.thumbnail || "") ? photo.thumbnail : undefined;
  useEffect(() => {
    if (!photo.blob) return;
    const url = URL.createObjectURL(photo.blob);
    if (imageRef.current) imageRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [photo.blob]);
  if (!photo.blob && !thumbnail) return <span className="photo-album__placeholder" aria-hidden="true">♡</span>;
  return <img ref={imageRef} src={thumbnail} alt="Pratinjau foto kenangan" loading="lazy" />;
}

function PhotoPreview({ photo, onClose }) {
  const imageRef = useRef(null);
  const downloadRef = useRef(null);
  useEffect(() => {
    const url = URL.createObjectURL(photo.blob);
    imageRef.current.src = url;
    downloadRef.current.href = url;
    return () => URL.revokeObjectURL(url);
  }, [photo.blob]);
  return (
    <figure className="photo-album__preview">
      <img ref={imageRef} alt="Foto kenangan yang tersimpan" />
      <figcaption>
        <a ref={downloadRef} className="btn btn--primary" download={photo.name}>Unduh fotonya ♡</a>
        <button type="button" className="btn btn--secondary" onClick={onClose}>Tutup foto</button>
      </figcaption>
    </figure>
  );
}

export default function PhotoAlbum({ currentPhoto }) {
  const [album] = useState(() => createPhotoAlbumController({ client: albumClient(), store }));
  const state = useSyncExternalStore(album.subscribe, album.getSnapshot, album.getSnapshot);
  const [visibleCount, setVisibleCount] = useState(12);
  useEffect(() => {
    album.initialize();
    return () => album.dispose();
  }, [album]);

  const records = new Map(state.records.filter(photo => state.unlocked || !photo.driveId).map(photo => [photo.id, photo]));
  if (state.unlocked) for (const photo of state.files) records.set(photo.id, { ...records.get(photo.id), ...photo });
  const photos = [...records.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const pending = state.records.filter(photo => !photo.driveId && photo.blob).length;
  const saved = currentPhoto && state.records.find(photo => photo.id === currentPhoto.id);
  const busy = Boolean(state.busy);

  return (
    <section className="photo-album" aria-labelledby="photo-album-title" aria-busy={busy}>
      <div className="photo-album__heading">
        <span aria-hidden="true">♡</span>
        <div><h3 id="photo-album-title">Album Kenangan Kita</h3><p>Simpan hasil favoritmu untuk dibuka lagi nanti.</p></div>
      </div>

      {currentPhoto && (
        <button type="button" className="btn btn--primary" onClick={() => album.save(currentPhoto)} disabled={busy || Boolean(saved?.driveId)}>
          {state.busy === "save" ? "Lagi menyimpan…" : saved?.driveId ? "Tersimpan di Google Drive ♡" : "Simpan ke kenangan ♡"}
        </button>
      )}

      {state.configured && <p className="photo-album__status">Foto di album bisa dibuka oleh orang yang memiliki kode album.</p>}

      {!state.configured && <p className="photo-album__status">Album Google Drive belum dihubungkan. Foto yang kamu simpan di sini sementara disimpan di perangkat ini.</p>}

      {state.configured && !state.unlocked && (
        <form className="photo-album__unlock" onSubmit={async event => {
          event.preventDefault();
          const input = event.currentTarget.elements.namedItem("albumCode");
          if (await album.unlock(input.value)) input.value = "";
        }}>
          <label htmlFor="album-code">Kode album dari pemilik website</label>
          <div><input id="album-code" name="albumCode" type="password" minLength={12} maxLength={128} required autoComplete="off" disabled={busy} />
            <button type="submit" className="btn btn--secondary" disabled={busy}>{state.busy === "unlock" ? "Membuka…" : "Buka album"}</button></div>
        </form>
      )}

      {state.unlocked && (
        <div className="photo-album__actions">
          <span>Terhubung ke album Google Drive</span>
          <button type="button" onClick={() => album.reload()} disabled={busy}>Muat ulang</button>
          <button type="button" onClick={() => album.lock()}>Kunci album</button>
        </div>
      )}

      {pending > 0 && (
        <div className="photo-album__pending">
          <p>{pending} foto tersimpan di perangkat ini dan belum dikonfirmasi Google Drive.</p>
          {state.unlocked && <button type="button" className="btn btn--secondary" disabled={busy} onClick={() => album.syncPending()}>Kirim foto yang tertunda</button>}
        </div>
      )}
      <p className="photo-album__feedback" role="status">{state.message || (busy ? "Sebentar yaa, sedang menyiapkan album…" : "")}</p>
      {state.error && <p className="booth-error" role="alert">{state.error}{pending > 0 ? " Salinan foto di perangkat ini tetap aman." : ""}</p>}

      <div className="photo-album__grid">
        {photos.slice(0, visibleCount).map(photo => (
          <article key={photo.id} className="photo-album__card">
            <PhotoImage photo={photo} />
            <p>{photo.count} foto · {new Date(photo.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
            <small>{photo.driveId ? "Tersimpan di Google Drive" : "Salinan di perangkat ini"}</small>
            <button type="button" className="btn btn--secondary" disabled={busy} onClick={() => album.open(photo)}>Buka foto</button>
          </article>
        ))}
      </div>
      {photos.length === 0 && !busy && <p className="photo-album__empty">Belum ada foto di sini. Ambil foto pertama untuk jadi kenangan kita ♡</p>}
      {(photos.length > visibleCount || state.nextCursor) && (
        <button type="button" className="btn btn--secondary" disabled={busy} onClick={() => {
          setVisibleCount(value => value + 12);
          if (photos.length <= visibleCount && state.nextCursor) album.reload(true);
        }}>Lihat foto lainnya</button>
      )}
      {state.selected && <PhotoPreview photo={state.selected} onClose={() => album.closePreview()} />}
    </section>
  );
}
