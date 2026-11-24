import { useState } from "react";
import SceneLayout from "../components/SceneLayout";
import GiftBox from "../components/GiftBox";

export default function WelcomeScene({ birthday, onContinue }) {
  const [giftOpened, setGiftOpened] = useState(false);
  const nickname = birthday?.recipient?.nickname || "sayang";

  return (
    <SceneLayout
      className="welcome-scene"
      eyebrow="Ada sesuatu buat kamu"
      title={giftOpened ? `Selamat ulang tahun, ${nickname} ♡` : `Hai, ${nickname}... ♡`}
      description={giftOpened ? "Kadonya baru permulaan, masih ada cerita lainnya." : "Aku bikin sesuatu buat kamu, nih."}
    >
      <div className={`welcome-card ${giftOpened ? "is-opened" : ""}`}>
        <div className="welcome-card__art">
          <span className="welcome-card__label">SEBUAH KEJUTAN KECIL</span>
          {giftOpened ? (
            <div className="gift-reveal__heart" aria-hidden="true">♡</div>
          ) : (
            <GiftBox onOpened={() => setGiftOpened(true)} />
          )}
          <p className="gift-instruction" role="status">
            {giftOpened ? "Yeay, kadonya sudah terbuka! ♡" : "Ketuk kadonya untuk mulai, yaa ♡"}
          </p>
        </div>

        <div className="welcome-card__message">
          <span className="welcome-card__stamp" aria-hidden="true">♡</span>
          <span className="welcome-card__eyebrow">DARI AKU, UNTUK KAMU</span>
          <h2>{giftOpened ? "Hari ini, tentang kamu." : "Khusus buat kamu."}</h2>
          <p>
            {giftOpened
              ? "Hari ini kan hari spesial kamu. Jadi aku pengen bikin sesuatu yang bisa kamu inget nantinya."
              : birthday?.website?.welcomeMessage || "Sebenernya sederhana aja, tapi aku bikinnya khusus buat kamu. Semoga kamu suka, yaa."}
          </p>
          {giftOpened ? (
            <>
              <p>Aku harap kamu seneng yaa, soalnya masih ada beberapa kejutan kecil lainnya, hehe.</p>
              <button type="button" className="btn btn--primary btn--large" onClick={onContinue}>
                Lanjut, yuk <span aria-hidden="true">→</span>
              </button>
            </>
          ) : (
            <div className="welcome-card__previews" aria-label="Beberapa kejutan yang menunggu">
              <span>Kue & doa</span><span>Kenangan kita</span><span>Surat cinta</span>
            </div>
          )}
          <div className="welcome-card__signature">
            <span>Dengan sepenuh hati,</span>
            <strong>{birthday?.sender?.name || "Aku"} <span aria-hidden="true">♡</span></strong>
          </div>
        </div>
      </div>
    </SceneLayout>
  );
}
