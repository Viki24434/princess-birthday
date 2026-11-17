
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
          Lewatin jurang, hindari mob,
          kumpulin {REQUIRED_HEARTS} hati,
          terus turunin benderanya yaa.
          Aku tunggu di kastil! ♡
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

        <h2>Akhirnya sampai juga, sayang! ♡</h2>

        <p>
          Hehe, kamu berhasil lewatin semuanya.
          Aku udah nungguin kamu di sini, nih.
          Sekarang masih ada satu hal lagi
          yang pengen aku kasih ke kamu.
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
