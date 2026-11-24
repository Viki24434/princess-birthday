
import { REQUIRED_HEARTS } from "../../game/constants";

export default function AdventureOverlay({
  status,
  onStart,
  onComplete
}) {
  if (status === "ready") {
    return (
      <div className="adventure__overlay">
        <span className="adventure__emoji">
          🏰
        </span>

        <h2>Petualangan Menuju Kastil ♡</h2>

        <p>
          Hindari mob, kumpulkan {REQUIRED_HEARTS} hati,
          lalu turunkan bendera di kastil.
          Naiki pijakan bergerak, dan kalau melihat kilau emas, coba ikuti… ♡
        </p>

        <button
          type="button"
          className="btn btn--primary"
          onClick={onStart}
        >
          Mulai Main ♡
        </button>
      </div>
    );
  }

  if (status === "won") {
    return (
      <div className="adventure__overlay">
        <span className="adventure__emoji">
          💖
        </span>

        <h2>Kita berhasil sampai ke atas, sayang! ♡</h2>

        <p>
        Yeay, akhirnya kita sampai juga!
        Lihat tuh, kembang apinya cantik banget.
        Makasih yaa udah mau lewatin
        petualangan kecil ini bareng aku.

        Tapi tunggu, masih ada sesuatu
        yang pengen aku kasih ke kamu. ♡
        </p>

        <button
          type="button"
          className="btn btn--primary"
          onClick={onComplete}
        >
          Lihat kejutan berikutnya ♡
        </button>
      </div>
    );
  }

  return null;
}
