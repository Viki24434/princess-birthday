
import SceneLayout from "../components/SceneLayout";
import HeartAdventure from "../components/game/HeartAdventure";

export default function GameScene({ onComplete }) {
  return (
    <SceneLayout
      className="game-scene"
      eyebrow="Ada tantangan kecil buat kamu"
      title="Petualangan Kita ♡"
      description="Sebentar lagi selesai, sayang. Tapi sebelum itu, aku pengen ngajak kamu main sebentar, hehe."
    >
      <HeartAdventure onComplete={onComplete} />

      <div className="game-scene__message">
        <p>
          Jangan nyerah yaa, sayang.
          Kalau jatuh, coba lagi aja.
          Aku tungguin kamu di ujung sana. ♡
        </p>
      </div>
    </SceneLayout>
  );
}
