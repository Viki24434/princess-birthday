import { useEffect, useRef } from "react";
import { resolveAssetUrl } from "../../utils/customContent";

export default function AdventureSecretModal({ content, onResume }) {
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
      <img className="adventure__secret-gift" src={resolveAssetUrl(content.image)} alt="" />
      <span className="adventure__secret-eyebrow">{content.eyebrow}</span>
      <h2 id="adventure-secret-title">{content.title}</h2>
      <p>{content.message}</p>
      <button ref={continueRef} type="button" className="btn btn--primary" onClick={onResume}>
        {content.button}
      </button>
    </div>
  );
}
