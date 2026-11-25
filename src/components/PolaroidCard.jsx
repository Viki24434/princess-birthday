
import { useState } from "react";
import { resolveAssetUrl } from "../utils/customContent";

export default function PolaroidCard({ memory }) {
  const [flipped, setFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = resolveAssetUrl(memory.image);

  return (
    <button
      type="button"
      className={`polaroid ${flipped ? "is-flipped" : ""}`}
      style={{
        "--rotation": `${memory.rotation || 0}deg`
      }}
      onClick={() => setFlipped(value => !value)}
      aria-label={`Lihat cerita ${memory.title}`}
      aria-pressed={flipped}
    >
      <div className="polaroid__inner">
        <div className="polaroid__front">
          <div className="polaroid__image">
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt={memory.title}
                loading="lazy"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="image-placeholder">
                <span>♡</span>
                <small>Our Memory</small>
              </div>
            )}
          </div>

          <span className="polaroid__caption">
            {memory.title}
          </span>
        </div>

        <div className="polaroid__back">
          <span className="polaroid__heart">♡</span>
          <h3>{memory.title}</h3>
          <small>{memory.date}</small>
          <p>{memory.description}</p>
          <span className="polaroid__hint">
            Tap to flip back
          </span>
        </div>
      </div>
    </button>
  );
}
