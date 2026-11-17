
import "../../styles/game.css";

import {
  WIDTH,
  HEIGHT,
  REQUIRED_HEARTS
} from "../../game/constants";

import {
  useAdventureGame
} from "../../game/hooks/useAdventureGame";

import AdventureOverlay from "./AdventureOverlay";
import AdventureControls from "./AdventureControls";

export default function HeartAdventure({ onComplete }) {
  const {
    canvasRef,
    status,
    score,
    notice,
    startGame,
    handlePress,
    handleRelease
  } = useAdventureGame();

  return (
    <div className="adventure">
      {/* INFORMASI GAME */}
      <div className="adventure__topbar">
        <span>
          ♡ Hati: {score} / {REQUIRED_HEARTS}
        </span>

        <span>Level 1 — Menuju Kastil</span>
      </div>

      {/* LAYAR GAME */}
      <div className="adventure__viewport">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          aria-label="Petualangan menuju kastil"
        />

        <AdventureOverlay
          status={status}
          onStart={startGame}
          onComplete={onComplete}
        />
      </div>

      {/* PESAN PERMAINAN */}
      {notice && (
        <p
          className="adventure__notice"
          role="status"
        >
          {notice}
        </p>
      )}

      {/* KONTROL GAME */}
      <AdventureControls
        status={status}
        onPress={handlePress}
        onRelease={handleRelease}
        onRestart={startGame}
      />
    </div>
  );
}
