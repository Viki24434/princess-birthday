import SceneLayout from "../components/SceneLayout";
import HeartAdventure from "../components/game/HeartAdventure";

export default function GameScene({ onComplete }) {
  return (
    <SceneLayout
      className="game-scene"
      eyebrow="Ada tantangan kecil buat kamu"
      title="Petualangan Menuju Kastil ♡"
      description="Sebelum lanjut, aku pengen ngajak kamu main dulu. Kali ini kamu harus sampai ke kastil dan ketemu aku di sana, yaa."
    >
      <HeartAdventure onComplete={onComplete} />

      <div className="game-scene__message">
        <p>
          Di perjalanan nanti ada jurang, ada mob yang jalan-jalan,
          dan ada tangga yang harus kamu naiki.
          Kumpulin hati juga yaa, terus naik sampai ke kastil.
          Aku tungguin kamu di akhir. ♡
        </p>
      </div>
    </SceneLayout>
  );
}