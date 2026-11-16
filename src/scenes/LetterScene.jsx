
import { useState } from "react";
import SceneLayout from "../components/SceneLayout";

export default function LetterScene({ letter }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SceneLayout
      className="letter-scene"
      eyebrow="Ada sedikit cerita dari aku"
      title="Buat Kamu, Sayang ♡"
      description="Ada beberapa hal yang pengen aku sampein ke kamu."
    >
      {!isOpen ? (
        <div className="letter-opening">
          <button
            type="button"
            className="envelope"
            onClick={() => setIsOpen(true)}
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
            onClick={() => setIsOpen(true)}
          >
            Buka suratnya ♡
          </button>
        </div>
      ) : (
        <article className="letter-paper">
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
            onClick={() => setIsOpen(false)}
          >
            Tutup surat ♡
          </button>
        </article>
      )}
    </SceneLayout>
  );
}
