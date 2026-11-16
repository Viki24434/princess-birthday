
const scenes = [
  { id: "welcome", label: "Welcome" },
  { id: "cake", label: "Cake" },
  { id: "memories", label: "Memories" },
  { id: "photobooth", label: "Photo" },
  { id: "letter", label: "Letter" },
  { id: "final", label: "Final" }
];

export default function SceneNavigation({
  currentScene,
  unlockedScenes,
  onNavigate
}) {
  const currentIndex = scenes.findIndex(
    scene => scene.id === currentScene
  );

  const previous = scenes[currentIndex - 1];
  const next = scenes[currentIndex + 1];

  return (
    <>
      <nav
        className="scene-progress"
        aria-label="Birthday journey"
      >
        {scenes.map((scene, index) => {
          const unlocked =
            unlockedScenes.includes(scene.id);

          return (
            <button
              key={scene.id}
              type="button"
              className={[
                "progress-dot",
                currentScene === scene.id
                  ? "is-active"
                  : "",
                unlocked ? "is-unlocked" : ""
              ].join(" ")}
              disabled={!unlocked}
              onClick={() => onNavigate(scene.id)}
              aria-label={`Buka ${scene.label}`}
              aria-current={
                currentScene === scene.id
                  ? "step"
                  : undefined
              }
              title={scene.label}
            >
              <span>{index + 1}</span>
            </button>
          );
        })}
      </nav>

      <footer className="bottom-navigation">
        <button
          type="button"
          className="btn btn--secondary"
          disabled={!previous}
          onClick={() =>
            previous && onNavigate(previous.id)
          }
        >
          ← Back
        </button>

        <span className="navigation-caption">
          {currentIndex + 1} / {scenes.length}
        </span>

        {next ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => onNavigate(next.id)}
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => onNavigate("welcome")}
          >
            Replay ♡
          </button>
        )}
      </footer>
    </>
  );
}

export { scenes };
