
import { useEffect, useRef, useState } from "react";
import SceneLayout from "../components/SceneLayout";

const OPEN_DURATION = 650;
const PAPER_CLOSE_DURATION = 380;
const ENVELOPE_CLOSE_DURATION = 520;

function animationDuration(duration) {
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return 0;
  }

  return duration;
}

export default function LetterScene({ letter }) {
  // closed -> opening -> open
  // open -> closing -> sealing -> closed
  const [phase, setPhase] = useState("closed");

  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  function openLetter() {
    if (phase !== "closed") return;

    clearTimeout(timerRef.current);
    setPhase("opening");

    timerRef.current = setTimeout(() => {
      setPhase("open");
    }, animationDuration(OPEN_DURATION));
  }

  function closeLetter() {
    if (phase !== "open") return;

    clearTimeout(timerRef.current);
    setPhase("closing");

    // Kertas masuk dan menghilang
    timerRef.current = setTimeout(() => {
      setPhase("sealing");

      // Amplop muncul dan flap menutup
      timerRef.current = setTimeout(() => {
        setPhase("closed");
      }, animationDuration(ENVELOPE_CLOSE_DURATION));

    }, animationDuration(PAPER_CLOSE_DURATION));
  }

  const showEnvelope =
    phase === "closed" ||
    phase === "opening" ||
    phase === "sealing";

  const showPaper =
    phase === "open" ||
    phase === "closing";

  return (
    <SceneLayout
      className="letter-scene"
      eyebrow="Ada sedikit cerita dari aku"
      title="Buat Kamu, Sayang ♡"
      description="Ada beberapa hal yang pengen aku sampein ke kamu."
    >
      {/* ==============================
          AMPLOP ASLI
      ============================== */}

      {showEnvelope && (
        <div
          className={[
            "letter-opening",
            phase === "opening"
              ? "letter-opening--opening"
              : "",
            phase === "sealing"
              ? "letter-opening--sealing"
              : ""
          ].filter(Boolean).join(" ")}
        >
          <button
            type="button"
            className="envelope"
            onClick={openLetter}
            disabled={phase !== "closed"}
            aria-label="Buka surat buat kamu"
          >
            <div className="envelope__back" />
            <div className="envelope__flap" />
            <div className="envelope__front" />

            <div className="envelope__seal">
              ♡
            </div>
          </button>

          <p>
            Coba buka amplopnya, sayang ♡
          </p>

          <button
            className="btn btn--primary"
            type="button"
            onClick={openLetter}
            disabled={phase !== "closed"}
          >
            Buka suratnya ♡
          </button>
        </div>
      )}

      {/* ==============================
          KERTAS SURAT ASLI
      ============================== */}

      {showPaper && (
        <article
          className={[
            "letter-paper",
            phase === "closing"
              ? "letter-paper--closing"
              : ""
          ].filter(Boolean).join(" ")}
        >
          <span className="letter-paper__ornament">
            ✦ ♡ ✦
          </span>

          <h2>{letter.title}</h2>

          <p className="letter-greeting">
            {letter.greeting}
          </p>

          {letter.paragraphs.map((paragraph, index) => (
            <p key={index}>
              {paragraph}
            </p>
          ))}

          <div className="letter-signature">
            <p>{letter.closing}</p>
            <strong>{letter.signature}</strong>
          </div>

          <button
            type="button"
            className="btn btn--secondary"
            onClick={closeLetter}
            disabled={phase !== "open"}
          >
            Tutup surat ♡
          </button>
        </article>
      )}
    </SceneLayout>
  );
}
