
import { useEffect, useState } from "react";

import useBirthdayData from "./hooks/useBirthdayData";

import DecorativeBackground from "./components/DecorativeBackground";
import SceneNavigation, {
  scenes
} from "./components/SceneNavigation";

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

  const [gameCompleted, setGameCompleted] =
    useState(false);

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

    // Surat baru bisa dibuka setelah game selesai.
    if (
      currentScene === "game" &&
      sceneId === "letter" &&
      !gameCompleted
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

  function finishGame() {
    setGameCompleted(true);

    setUnlockedScenes(previous => {
      if (previous.includes("letter")) {
        return previous;
      }

      return [...previous, "letter"];
    });

    setCurrentScene("letter");
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
      <GameScene onComplete={finishGame} />
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
              Princess Birthday
            </span>
          </button>

          <span className="header-label">
            Khusus Buat Kamu ✦
          </span>
        </header>

        <SceneNavigation
          currentScene={currentScene}
          unlockedScenes={unlockedScenes}
          onNavigate={navigateTo}
          canContinue={
            currentScene !== "game" ||
            gameCompleted
          }
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
