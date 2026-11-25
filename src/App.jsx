
import { useEffect, useState } from "react";

import useBirthdayData from "./hooks/useBirthDayData";

import DecorativeBackground from "./components/DecorativeBackground";
import SceneNavigation from "./components/SceneNavigation";
import { scenes } from "./data/scenes";

import WelcomeScene from "./scenes/WelcomeScene";
import CakeScene from "./scenes/CakeScene";
import MemoriesScene from "./scenes/MemoriesScene";
import PhotoBoothScene from "./scenes/PhotoBoothScene";
import GameScene from "./scenes/GameScene";
import LetterScene from "./scenes/LetterScene";
import FinalScene from "./scenes/FinalScene";

export default function App() {
  const {
    birthday,
    memories,
    letter,
    loading,
    error
  } = useBirthdayData();

  const [currentScene, setCurrentScene] =
    useState("welcome");

  const [unlockedScenes, setUnlockedScenes] =
    useState(["welcome"]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }, [currentScene]);

  function navigateTo(sceneId) {
    const targetIndex = scenes.findIndex(
      scene => scene.id === sceneId
    );

    const currentIndex = scenes.findIndex(
      scene => scene.id === currentScene
    );

    if (targetIndex === -1) return;

    if (
      targetIndex > currentIndex + 1 &&
      !unlockedScenes.includes(sceneId)
    ) {
      return;
    }

    setUnlockedScenes(previous => {
      if (previous.includes(sceneId)) {
        return previous;
      }

      return [...previous, sceneId];
    });

    setCurrentScene(sceneId);
  }

  function goNext() {
    const index = scenes.findIndex(
      scene => scene.id === currentScene
    );

    const next = scenes[index + 1];

    if (next) {
      navigateTo(next.id);
    }
  }

  if (loading) {
    return (
      <div className="app-status">
        <span className="loading-heart">♡</span>
        <h1>Lagi nyiapin kejutan buat kamu...</h1>
        <p>Sebentar yaa, sayang ♡</p>
      </div>
    );
  }

  if (error || !birthday || !letter) {
    return (
      <div className="app-status">
        <h1>Ups, ada yang salah ♡</h1>

        <p>
          {error ||
            "Data ulang tahunnya belum bisa dibuka."}
        </p>

        <button
          type="button"
          className="btn btn--primary"
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const sceneContent = {
    welcome: (
      <WelcomeScene
        birthday={birthday}
        onContinue={goNext}
      />
    ),

    cake: (
      <CakeScene birthday={birthday} />
    ),

    memories: (
      <MemoriesScene memories={memories} />
    ),

    photobooth: (
      <PhotoBoothScene birthday={birthday} />
    ),

    game: (
      <GameScene onComplete={goNext} onSkip={goNext} />
    ),

    letter: (
      <LetterScene letter={letter} />
    ),

    final: (
      <FinalScene
        birthday={birthday}
        onNavigate={navigateTo}
      />
    )
  };

  return (
    <div className="birthday-app">
      <DecorativeBackground />

      <div className="app-shell">
        <header className="app-header">
          <button
            type="button"
            className="brand"
            onClick={() => navigateTo("welcome")}
            aria-label="Kembali ke halaman pembuka"
          >
            <span className="brand__icon">♡</span>

            <span className="brand__text">
              <strong>Princess Birthday</strong>
              <small>Sebuah kejutan, sepenuh hati</small>
            </span>
          </button>

          <span className="header-label">
            <span aria-hidden="true">✦</span> Khusus Buat Kamu
          </span>
        </header>

        <SceneNavigation
          currentScene={currentScene}
          unlockedScenes={unlockedScenes}
          onNavigate={navigateTo}
        />

        <main
          className="app-main"
          id="main-content"
        >
          <div
            key={currentScene}
            className="scene-transition"
          >
            {sceneContent[currentScene]}
          </div>
        </main>

        <div className="app-footer-note">
          Dibuat khusus buat kamu ♡
        </div>
      </div>
    </div>
  );
}
