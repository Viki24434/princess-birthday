
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
import AdventureFailModal from "./AdventureFailModal";

import { useState, useEffect } from "react";

import {
  getGameSoundEnabled,
  setGameSoundEnabled,
  unlockGameAudio,
  stopGameAudio
} from "../../game/audio/gameAudio";

export default function HeartAdventure({ onComplete }) {
  const {
    canvasRef,
    status,
    score,
    notice,
    failMessage,
    failType,
    startGame,
    resumeGame,
    handlePress,
    handleRelease
  } = useAdventureGame();


  const [soundEnabled, setSoundEnabled] =
    useState(getGameSoundEnabled);

  function toggleSound() {
    const next = !soundEnabled;

    setGameSoundEnabled(next);
    setSoundEnabled(next);

    if (next) {
      unlockGameAudio();
    }
  }

  // Hentikan musik dan efek suara saat keluar dari scene
  useEffect(() => {
    return () => {
      stopGameAudio();
    };
  }, []);


  return (
    <div className="adventure">
      {/* JUDUL LEVEL */}
      <div className="adventure__topbar">
        <span>Level 1 — Menuju Kastil</span>

        <button
          type="button"
          className="adventure__sound-btn"
          onClick={toggleSound}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? "🔊 Suara" : "🔇 Senyap"}
        </button>
      </div>

      {/* LAYAR GAME */}
      <div className="adventure__viewport">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          aria-label="Petualangan menuju kastil"
        />

        {/* JUMLAH HATI — POJOK KANAN ATAS */}
        <div
          className="adventure__heart-hud"
          aria-live="polite"
        >
          <span aria-hidden="true">♡</span>
          <span>
            {score} / {REQUIRED_HEARTS}
          </span>
        </div>

        {/* TAMPILAN MULAI DAN MENANG */}
        <AdventureOverlay
          status={status}
          onStart={startGame}
          onComplete={onComplete}
        />

        {/* MODAL KETIKA GAGAL */}
        <AdventureFailModal
          message={failMessage}
          type={failType}
          onRetry={resumeGame}
        />
      </div>

      {/* PESAN INFO LAINNYA */}
      {notice && (
        <p
          className="adventure__notice"
          role="status"
        >
          {notice}
        </p>
      )}

      {/* KONTROL */}
      <AdventureControls
        status={status}
        onPress={handlePress}
        onRelease={handleRelease}
        onRestart={startGame}
      />
    </div>
  );
}
