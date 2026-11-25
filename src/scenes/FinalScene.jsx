
import { Fragment } from "react";
import SceneLayout from "../components/SceneLayout";

export default function FinalScene({
  birthday,
  onNavigate
}) {
  const content = birthday.final;
  return (
    <SceneLayout
      className="final-scene"
      eyebrow={content.eyebrow}
      title={content.title}
      description={birthday?.website?.closingMessage}
    >
      <div className="final-heart">
        <span aria-hidden="true">♡</span>
      </div>

      <div className="final-card">
        <span className="script-text">
          {content.cardLabel}
        </span>

        <h2>
          {content.heading}
        </h2>

        {content.paragraphs.map((paragraph, index) => (
          <Fragment key={index}>
            {index === 1 && <div className="final-card__divider">✦ ♡ ✦</div>}
            <p>{paragraph}</p>
          </Fragment>
        ))}
      </div>

      <div className="final-actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => onNavigate("memories")}
        >
          {content.memoriesButton}
        </button>

        <button
          type="button"
          className="btn btn--primary"
          onClick={() => onNavigate("welcome")}
        >
          {content.restartButton}
        </button>
      </div>
    </SceneLayout>
  );
}
