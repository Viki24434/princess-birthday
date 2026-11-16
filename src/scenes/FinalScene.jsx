
import SceneLayout from "../components/SceneLayout";

export default function FinalScene({
  birthday,
  onNavigate
}) {
  const name =
    birthday?.recipient?.nickname || "Princess";

  return (
    <SceneLayout
      className="final-scene"
      eyebrow="One last little message"
      title={`I Love You, ${name} ♡`}
      description={birthday?.website?.closingMessage}
    >
      <div className="final-heart">
        <span aria-hidden="true">♡</span>
      </div>

      <div className="final-card">
        <span className="script-text">
          Forever & Always
        </span>

        <h2>
          You deserve all the happiness
          in the world.
        </h2>

        <p>
          Thank you for being such a
          beautiful part of my life.
        </p>

        <div className="final-card__divider">
          ✦ ♡ ✦
        </div>

        <p>
          Happy Birthday, my favorite person.
        </p>
      </div>

      <div className="final-actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => onNavigate("memories")}
        >
          Our Memories
        </button>

        <button
          type="button"
          className="btn btn--primary"
          onClick={() => onNavigate("welcome")}
        >
          Experience Again ♡
        </button>
      </div>
    </SceneLayout>
  );
}
