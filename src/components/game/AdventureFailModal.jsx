
export default function AdventureFailModal({
  message,
  type,
  onRetry
}) {
  if (!message) return null;

  const isMob = type === "mob";

  return (
    <div className="adventure__fail-backdrop">
      <div
        className={[
          "adventure__fail-modal",
          isMob
            ? "adventure__fail-modal--mob"
            : ""
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="adventure-fail-title"
      >
        <span
          className="adventure__fail-emoji"
          aria-hidden="true"
        >
          {isMob ? "💥" : "🥺"}
        </span>

        <h2 id="adventure-fail-title">
          {isMob
            ? "Aduhh, ketabrak monster! ♡"
            : "Yahh, jatuh duluu ♡"}
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
