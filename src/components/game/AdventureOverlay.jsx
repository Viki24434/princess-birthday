
export default function AdventureOverlay({
  content,
  status,
  onStart,
  onComplete
}) {
  if (status === "ready") {
    return (
      <div className="adventure__overlay">
        <span className="adventure__emoji">
          🏰
        </span>

        <h2>{content.intro.title}</h2>

        <p>
          {content.intro.message}
        </p>

        <button
          type="button"
          className="btn btn--primary"
          onClick={onStart}
        >
          {content.intro.button}
        </button>
      </div>
    );
  }

  if (status === "won") {
    return (
      <div className="adventure__overlay">
        <span className="adventure__emoji">
          💖
        </span>

        <h2>{content.win.title}</h2>

        <p>
          {content.win.message}
        </p>

        <button
          type="button"
          className="btn btn--primary"
          onClick={onComplete}
        >
          {content.win.button}
        </button>
      </div>
    );
  }

  return null;
}
