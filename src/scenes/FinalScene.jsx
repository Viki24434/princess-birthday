
import SceneLayout from "../components/SceneLayout";

export default function FinalScene({
  birthday,
  onNavigate
}) {
  return (
    <SceneLayout
      className="final-scene"
      eyebrow="Terakhir, ada satu hal lagi"
      title="Aku Sayang Kamu ♡"
      description={birthday?.website?.closingMessage}
    >
      <div className="final-heart">
        <span aria-hidden="true">♡</span>
      </div>

      <div className="final-card">
        <span className="script-text">
          Aku dan Kamu ♡
        </span>

        <h2>
          Semoga kamu selalu punya
          banyak alasan buat senyum
          setiap harinya.
        </h2>

        <p>
          Makasih yaa udah jadi
          bagian dari hidup aku.
          Aku seneng bisa kenal sama kamu
          dan punya banyak cerita bareng kamu.
        </p>

        <div className="final-card__divider">
          ✦ ♡ ✦
        </div>

        <p>
          Selamat ulang tahun sekali lagi,
          sayang. Semoga kita masih bisa
          ngerayain banyak ulang tahun
          bareng-bareng, yaa.
        </p>

        <p>
          Aku sayang kamu. ❤️
        </p>
      </div>

      <div className="final-actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => onNavigate("memories")}
        >
          Lihat Kenangan Kita
        </button>

        <button
          type="button"
          className="btn btn--primary"
          onClick={() => onNavigate("welcome")}
        >
          Ulang dari Awal ♡
        </button>
      </div>
    </SceneLayout>
  );
}
