import { useState } from "react";
import SceneLayout from "../components/SceneLayout";

export default function CakeScene({ birthday }) {
  const [candlesOut, setCandlesOut] = useState(false);
  const content = birthday.cake;
  const message = candlesOut ? content.after : content.before;
  const candleCount = Math.min(
    Math.max(birthday?.cake?.candles || 3, 1),
    8
  );

  return (
    <SceneLayout
      className="cake-scene"
      eyebrow={content.eyebrow}
      title={content.title}
      description={birthday?.cake?.message}
    >
      <div className={`cake-card ${candlesOut ? "is-celebrating" : ""}`}>
        <div className="cake-card__art">
          <span className="cake-card__label">{content.artLabel}</span>
          <div className="cake-stage">
            <span className="cake-sparkle cake-sparkle--one" aria-hidden="true">✦</span>
            <span className="cake-sparkle cake-sparkle--two" aria-hidden="true">✧</span>
            <span className="cake-sparkle cake-sparkle--three" aria-hidden="true">♡</span>

            <div
              className="cake-illustration"
              id="birthday-cake"
              role="img"
              aria-label={candlesOut
                ? "Kue tiga tingkat berwarna pink dan krem dengan lilin yang sudah padam"
                : "Kue tiga tingkat berwarna pink dan krem dengan lilin menyala"}
            >
              <div className="cake-candles">
                {Array.from({ length: candleCount }, (_, index) => (
                  <div className="candle" key={index}>
                    <span className={candlesOut ? "candle-smoke" : "candle-flame"} />
                  </div>
                ))}
              </div>

              <div className="cake-top">
                <div className="cake-icing" />
                <div className="cake-sprinkles">
                  {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
                </div>
              </div>
              <div className="cake-middle">
                <span className="cake-seal">♡</span>
              </div>
              <div className="cake-bottom" />
              <div className="cake-ribbon" aria-hidden="true"><span /><span /><i /></div>
              <div className="cake-plate" />
              <div className="cake-stand" />
            </div>
          </div>
          <p className="cake-card__status" id="cake-status" role="status">
            {message.status}
          </p>
        </div>

        <div className="cake-card__message">
          <span className="cake-card__stamp" aria-hidden="true">♡</span>
          <span className="cake-card__eyebrow">{content.cardEyebrow}</span>
          <h2>{message.heading}</h2>
          {message.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          <button
            type="button"
            className="btn btn--primary btn--large"
            aria-controls="birthday-cake"
            aria-describedby="cake-status"
            onClick={() => setCandlesOut(value => !value)}
          >
            {message.button}
          </button>
          <div className="cake-card__signature">
            <span>{content.signatureLabel}</span>
            <strong>{birthday?.sender?.name || "Aku"} <span aria-hidden="true">♡</span></strong>
          </div>
        </div>
      </div>
    </SceneLayout>
  );
}
