import { useEffect, useRef } from "react";
import { SECRET_AREA } from "../../game/levels/level1";

export default function AdventureSecretModal({ onResume }) {
  const continueRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    continueRef.current?.focus();
    function handleKey(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onResume();
      }
      if (event.key === "Tab") {
        event.preventDefault();
        continueRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, [onResume]);

  return (
    <div className="adventure__overlay adventure__secret-modal" role="dialog" aria-modal="true" aria-labelledby="adventure-secret-title">
      <img className="adventure__secret-gift" src={`${import.meta.env.BASE_URL}photobooth/decorations/gift.png`} alt="" />
      <span className="adventure__secret-eyebrow">Sudut rahasia ditemukan</span>
      <h2 id="adventure-secret-title">{SECRET_AREA.title}</h2>
      <p>{SECRET_AREA.message}</p>
      <button ref={continueRef} type="button" className="btn btn--primary" onClick={onResume}>
        Lanjutkan petualangan →
      </button>
    </div>
  );
}
