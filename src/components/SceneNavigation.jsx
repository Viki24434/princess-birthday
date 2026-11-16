
const scenes = [
  {
    id: "welcome",
    label: "Pembuka"
  },
  {
    id: "cake",
    label: "Kue Ulang Tahun"
  },
  {
    id: "memories",
    label: "Kenangan Kita"
  },
  {
    id: "photobooth",
    label: "Foto-Foto"
  },
  {
    id: "letter",
    label: "Surat Buat Kamu"
  },
  {
    id: "final",
    label: "Penutup"
  }
];

export default function SceneNavigation({
  currentScene,
  unlockedScenes = [],
  onNavigate
}) {
  const currentIndex = scenes.findIndex(
    (scene) => scene.id === currentScene
  );

  const previousScene = scenes[currentIndex - 1];
  const nextScene = scenes[currentIndex + 1];

  return (
    <>
      {/* Navigasi progres halaman */}
      <nav
        className="scene-progress"
        aria-label="Perjalanan kejutan ulang tahun"
      >
        {scenes.map((scene, index) => {
          const isActive = currentScene === scene.id;

          const isUnlocked = unlockedScenes.includes(
            scene.id
          );

          return (
            <button
              key={scene.id}
              type="button"
              className={[
                "progress-dot",
                isActive ? "is-active" : "",
                isUnlocked ? "is-unlocked" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={!isUnlocked}
              onClick={() => onNavigate(scene.id)}
              aria-label={`Buka halaman ${scene.label}`}
              aria-current={
                isActive ? "step" : undefined
              }
              title={scene.label}
            >
              <span>{index + 1}</span>
            </button>
          );
        })}
      </nav>

      {/* Tombol navigasi bawah */}
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
          {currentIndex + 1} / {scenes.length}
        </span>

        {nextScene ? (
          <button
            type="button"
            className="btn btn--primary"
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

export { scenes };
