
import { useState } from "react";
import SceneLayout from "../components/SceneLayout";

const frames = [
  {
    id: "princess",
    label: "Pink Princess",
    symbol: "♛"
  },
  {
    id: "love-strip",
    label: "Love Strip",
    symbol: "♡"
  },
  {
    id: "scrapbook",
    label: "Scrapbook",
    symbol: "✿"
  },
  {
    id: "royal",
    label: "Royal Birthday",
    symbol: "✦"
  }
];

export default function PhotoBoothScene({ birthday }) {
  const [selectedFrame, setSelectedFrame] =
    useState(
      birthday?.photoBooth?.defaultFrame || "princess"
    );

  const activeFrame =
    frames.find(frame => frame.id === selectedFrame);

  return (
    <SceneLayout
      className="photobooth-scene"
      eyebrow="Smile for the camera"
      title="Birthday Photo Booth"
      description="A little picture to remember this special day."
    >
      <div className="photobooth-card">
        <div className={`photo-frame frame--${selectedFrame}`}>
          <div className="photo-frame__header">
            ✦ Happy Birthday ✦
          </div>

          <div className="photo-frame__preview">
            <span>{activeFrame.symbol}</span>
            <p>Your pretty smile goes here</p>
          </div>

          <div className="photo-frame__footer">
            Forever my princess ♡
          </div>
        </div>

        <div className="frame-picker">
          <h3>Choose Your Frame</h3>

          <div className="frame-options">
            {frames.map(frame => (
              <button
                key={frame.id}
                type="button"
                className={
                  selectedFrame === frame.id
                    ? "frame-option is-selected"
                    : "frame-option"
                }
                onClick={() =>
                  setSelectedFrame(frame.id)
                }
                aria-pressed={
                  selectedFrame === frame.id
                }
              >
                <span>{frame.symbol}</span>
                <small>{frame.label}</small>
              </button>
            ))}
          </div>
        </div>

        <p className="feature-note">
          Live camera and photo capture will
          be available in the Photo Booth phase.
        </p>

        <button
          type="button"
          className="btn btn--primary btn--large"
          disabled
        >
          Camera Coming Soon
        </button>
      </div>
    </SceneLayout>
  );
}
