import { useState } from "react";
import SceneLayout from "../components/SceneLayout";
import GiftBox from "../components/GiftBox";

export default function WelcomeScene({ birthday, onContinue }) {
  const [giftOpened, setGiftOpened] = useState(false);
  const content = birthday.welcome;
  const message = giftOpened ? content.opened : content.closed;

  return (
    <SceneLayout
      className="welcome-scene"
      eyebrow={content.eyebrow}
      title={message.title}
      description={giftOpened ? message.description : birthday.website.subtitle}
    >
      <div className={`welcome-card ${giftOpened ? "is-opened" : ""}`}>
        <div className="welcome-card__art">
          <span className="welcome-card__label">{content.artLabel}</span>
          {giftOpened ? (
            <div className="gift-reveal__heart" aria-hidden="true">♡</div>
          ) : (
            <GiftBox onOpened={() => setGiftOpened(true)} />
          )}
          <p className="gift-instruction" role="status">
            {message.instruction}
          </p>
        </div>

        <div className="welcome-card__message">
          <span className="welcome-card__stamp" aria-hidden="true">♡</span>
          <span className="welcome-card__eyebrow">{content.cardEyebrow}</span>
          <h2>{message.heading}</h2>
          <p>
            {giftOpened
              ? message.message
              : birthday.website.welcomeMessage}
          </p>
          {giftOpened ? (
            <>
              <p>{message.extraMessage}</p>
              <button type="button" className="btn btn--primary btn--large" onClick={onContinue}>
                {message.continueLabel} <span aria-hidden="true">→</span>
              </button>
            </>
          ) : (
            <div className="welcome-card__previews" aria-label="Beberapa kejutan yang menunggu">
              {content.previews.map((preview, index) => <span key={index}>{preview}</span>)}
            </div>
          )}
          <div className="welcome-card__signature">
            <span>{content.signatureLabel}</span>
            <strong>{birthday?.sender?.name || "Aku"} <span aria-hidden="true">♡</span></strong>
          </div>
        </div>
      </div>
    </SceneLayout>
  );
}
