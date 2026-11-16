
import { useState } from "react";
import SceneLayout from "../components/SceneLayout";

export default function CakeScene({ birthday }) {
  const [candlesOut, setCandlesOut] = useState(false);

  const candleCount = Math.min(
    Math.max(birthday?.cake?.candles || 3, 1),
    8
  );

  return (
    <SceneLayout
      className="cake-scene"
      eyebrow="Make a wish"
      title="Happy Birthday!"
      description={birthday?.cake?.message}
    >
      <div className="cake-stage">
        <div
          className="cake-illustration"
          role="img"
          aria-label={
            candlesOut
              ? "Kue ulang tahun dengan lilin padam"
              : "Kue ulang tahun dengan lilin menyala"
          }
        >
          <div className="cake-candles">
            {Array.from(
              { length: candleCount },
              (_, index) => (
                <div className="candle" key={index}>
                  {!candlesOut && (
                    <span className="candle-flame" />
                  )}
                </div>
              )
            )}
          </div>

          <div className="cake-top">
            <div className="cake-icing" />
          </div>

          <div className="cake-middle">
            <span>♡</span>
          </div>

          <div className="cake-bottom" />
          <div className="cake-plate" />
        </div>
      </div>

      <div className="scene-message">
        {candlesOut ? (
          <>
            <h2>Your wish is on its way! ✨</h2>
            <p>
              May all your beautiful wishes come true.
            </p>
          </>
        ) : (
          <p>
            Close your eyes, make a wish, and blow
            out the candles.
          </p>
        )}
      </div>

      <button
        type="button"
        className="btn btn--primary btn--large"
        onClick={() => setCandlesOut(value => !value)}
      >
        {candlesOut
          ? "Light Candles Again ♡"
          : "Blow the Candles ✨"}
      </button>
    </SceneLayout>
  );
}
