
import SceneLayout from "../components/SceneLayout";

export default function WelcomeScene({
  birthday,
  onContinue
}) {
  const name = birthday?.recipient?.nickname || "Princess";

  return (
    <SceneLayout
      className="welcome-scene"
      eyebrow="Ada sesuatu buat kamu"
      title="Hai, sayang... ♡"
      description="Aku bikin sesuatu buat kamu, nih."
    >
      <div className="welcome-illustration">
        <div className="gift-stars" aria-hidden="true">
          ✦ ♡ ✧
        </div>

        <div className="gift-wrapper" aria-hidden="true">
          <div className="gift-bow">
            <span />
            <span />
          </div>

          <div className="gift-lid" />
          <div className="gift-box">
            <div className="gift-ribbon" />
            <div className="gift-heart">♡</div>
          </div>
        </div>
      </div>

      <div className="scene-message">
        <span className="script-text">
          Khusus buat kamu ♡
        </span>

        <p>
          Sebenernya sederhana aja, tapi aku bikinnya
          khusus buat kamu. Semoga kamu suka, yaa.
        </p>
      </div>

      <button
        type="button"
        className="btn btn--primary btn--large"
        onClick={onContinue}
      >
        Buka kadonya ♡
      </button>
    </SceneLayout>
  );
}
