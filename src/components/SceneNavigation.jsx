import { scenes } from "../data/scenes";

export default function SceneNavigation({
  currentScene,
  unlockedScenes = [],
  onNavigate,
  canContinue = true
}) {
  const currentIndex = scenes.findIndex(
    scene => scene.id === currentScene
  );

  const previousScene = scenes[currentIndex - 1];
  const nextScene = scenes[currentIndex + 1];

  return (
    <>
      <div className="journey-shell">
        <div className="journey-heading">
          <span>Perjalanan kecil buat kamu <span aria-hidden="true">♡</span></span>
          <span>Bab {String(currentIndex + 1).padStart(2, "0")} dari {String(scenes.length).padStart(2, "0")}</span>
        </div>
        <nav
          className="scene-progress"
          aria-label="Perjalanan kejutan ulang tahun"
        >
          {scenes.map((scene, index) => {
            const isActive =
              currentScene === scene.id;

            const isUnlocked =
              unlockedScenes.includes(scene.id);

            return (
              <button
                key={scene.id}
                type="button"
                className={[
                  "progress-dot",
                  isActive ? "is-active" : "",
                  isUnlocked ? "is-unlocked" : ""
                ].filter(Boolean).join(" ")}
                disabled={!isUnlocked}
                onClick={() => onNavigate(scene.id)}
                aria-label={`Buka halaman ${scene.label}${isUnlocked ? "" : ", belum terbuka"}`}
                aria-current={
                  isActive ? "step" : undefined
                }
                title={scene.label}
              >
                <span className="progress-dot__number" aria-hidden="true">
                  {isUnlocked && index < currentIndex ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                <span className="progress-dot__label">{scene.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <footer className="bottom-navigation">
        <button
          type="button"
          className="btn btn--secondary"
          disabled={!previousScene}
          onClick={() => {
            if (previousScene) {
              onNavigate(previousScene.id);
            }
          }}
        >
          ← Kembali
        </button>

        <span className="navigation-caption">
          <strong>{scenes[currentIndex].label}</strong>
          <small>{currentIndex + 1} / {scenes.length}</small>
        </span>

        {nextScene ? (
          <button
            type="button"
            className="btn btn--primary"
            disabled={!canContinue}
            onClick={() => onNavigate(nextScene.id)}
          >
            Lanjut →
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => onNavigate("welcome")}
          >
            Ulang Lagi ♡
          </button>
        )}
      </footer>
    </>
  );
}
