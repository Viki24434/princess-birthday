
export default function AdventureFailModal({
  message,
  onRetry
}) {
  if (!message) return null;

  return (
    <div className="adventure__fail-backdrop">
      <div
        className="adventure__fail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="adventure-fail-title"
      >
        <span
          className="adventure__fail-emoji"
          aria-hidden="true"
        >
          🥺
        </span>

        <h2 id="adventure-fail-title">
          Yahh, gagal duluu ♡
        </h2>

        <p>{message}</p>

        <button
          type="button"
          className="btn btn--primary"
          onClick={onRetry}
          autoFocus
        >
          Coba Lagi ♡
        </button>
      </div>
    </div>
  );
}
