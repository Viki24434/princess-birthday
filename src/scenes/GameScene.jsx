import SceneLayout from "../components/SceneLayout";
import HeartAdventure from "../components/game/HeartAdventure";

export default function GameScene({ onComplete, onSkip }) {
  return (
    <SceneLayout
      className="game-scene"
      eyebrow="Ada tantangan kecil buat kamu"
      title="Petualangan Menuju Kastil ♡"
      description="Ada perjalanan yang lebih panjang menuju kastil. Main dulu boleh, langsung baca suratnya juga boleh, sayang."
    >
      <div className="game-scene__choice">
        <p>Kamu boleh menikmati petualangannya atau langsung lanjut ke kejutan berikutnya. ♡</p>
        <button type="button" className="btn btn--secondary" onClick={onSkip}>
          Lanjut tanpa bermain →
        </button>
      </div>

      <HeartAdventure onComplete={onComplete} />

      <div className="game-scene__message">
        <p>
          Di perjalanan nanti ada jurang, ada mob yang jalan-jalan,
          tangga, dan pijakan yang bergerak.
          Kumpulin hati juga yaa, terus naik sampai ke kastil.
          Kalau ingin menjelajah, ada sudut kecil yang menyimpan pesan buatmu. ♡
        </p>
      </div>
    </SceneLayout>
  );
}
