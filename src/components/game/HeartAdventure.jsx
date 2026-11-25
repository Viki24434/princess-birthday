
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
import AdventureSecretModal from "./AdventureSecretModal";

import { useState, useEffect } from "react";

import {
  getGameSoundEnabled,
  setGameSoundEnabled,
  unlockGameAudio,
  stopGameAudio
} from "../../game/audio/gameAudio";

export default function HeartAdventure({ content, onComplete }) {
  const {
    canvasRef,
    status,
    score,
    notice,
    failMessage,
    failType,
    secretFound,
    startGame,
    resumeGame,
    openSecret,
    resumeSecret,
    handlePress,
    handleRelease
  } = useAdventureGame(content.memories);


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
        <span>{content.scene.levelLabel}</span>

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

        {secretFound && (
          <button type="button" className="adventure__secret-badge" onClick={openSecret}
            disabled={status !== "playing"} aria-label="Baca kembali pesan rahasia">
            <span aria-hidden="true">♥</span> Rahasia
          </button>
        )}

        {/* TAMPILAN MULAI DAN MENANG */}
        <AdventureOverlay
          content={content}
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

        {status === "secret" && <AdventureSecretModal content={content.secret} onResume={resumeSecret} />}
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
