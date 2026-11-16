
import { useState } from "react";
import SceneLayout from "../components/SceneLayout";
import GiftBox from "../components/GiftBox";

export default function WelcomeScene({
  onContinue
}) {
  const [giftOpened, setGiftOpened] = useState(false);

  return (
    <SceneLayout
      className="welcome-scene"
      eyebrow="Ada sesuatu buat kamu"
      title={
        giftOpened
          ? "Selamat ulang tahun, sayang ♡"
          : "Hai, sayang... ♡"
      }
      description={
        giftOpened
          ? "Hehe, akhirnya dibuka juga."
          : "Aku bikin sesuatu buat kamu, nih."
      }
    >
      {!giftOpened ? (
        <>
          <GiftBox
            onOpened={() => setGiftOpened(true)}
          />

          <div className="scene-message">
            <span className="script-text">
              Khusus buat kamu ♡
            </span>

            <p>
              Sebenernya sederhana aja, tapi aku
              bikinnya khusus buat kamu.
              Semoga kamu suka, yaa.
            </p>
          </div>

          <p className="gift-instruction">
            Coba ketuk kadonya, sayang ♡
          </p>
        </>
      ) : (
        <div className="gift-reveal">
          <div
            className="gift-reveal__heart"
            aria-hidden="true"
          >
            ♡
          </div>

          <p>
            Hari ini kan hari spesial kamu.
            Jadi aku pengen bikin sesuatu
            yang bisa kamu inget nantinya.
          </p>

          <p>
            Masih ada kejutan kecil lainnya,
            lanjut yuk? ❤️
          </p>

          <button
            type="button"
            className="btn btn--primary btn--large"
            onClick={onContinue}
          >
            Lanjut, yuk ♡
          </button>
        </div>
      )}
    </SceneLayout>
  );
}
