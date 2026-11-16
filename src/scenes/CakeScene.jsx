
import { useState } from "react";
import SceneLayout from "../components/SceneLayout";

export default function CakeScene({ birthday }) {
  const [candlesOut, setCandlesOut] = useState(false);

  const candleCount = Math.min(
    Math.max(birthday?.cake?.candles || 3, 1),
    8
  );

  return (
    <SceneLayout
      className="cake-scene"
      eyebrow="Hari spesial kamu"
      title="Selamat Ulang Tahun, Sayang! ♡"
      description={birthday?.cake?.message}
    >
      <div className="cake-stage">
        <div
          className="cake-illustration"
          role="img"
          aria-label={
            candlesOut
              ? "Kue ulang tahun dengan lilin yang sudah padam"
              : "Kue ulang tahun dengan lilin menyala"
          }
        >
          <div className="cake-candles">
            {Array.from(
              { length: candleCount },
              (_, index) => (
                <div className="candle" key={index}>
                  {!candlesOut && (
                    <span className="candle-flame" />
                  )}
                </div>
              )
            )}
          </div>

          <div className="cake-top">
            <div className="cake-icing" />
          </div>

          <div className="cake-middle">
            <span>♡</span>
          </div>

          <div className="cake-bottom" />
          <div className="cake-plate" />
        </div>
      </div>

      <div className="scene-message">
        {candlesOut ? (
          <>
            <h2>
              Aamiin, semoga terkabul yaa! ♡
            </h2>

            <p>
              Semoga semua yang kamu harapin
              bisa tercapai satu per satu.
              Aku juga bakal ikut seneng
              kalau kamu bahagia.
            </p>
          </>
        ) : (
          <>
            <p>
              Sebelum lanjut, coba tutup
              mata sebentar, terus bikin
              satu permintaan dulu, yaa.
            </p>

            <p>
              Kalau udah, tiup lilinnya.
              Semoga permintaannya terkabul,
              sayang. ♡
            </p>
          </>
        )}
      </div>

      <button
        type="button"
        className="btn btn--primary btn--large"
        onClick={() => setCandlesOut(value => !value)}
      >
        {candlesOut
          ? "Nyalain lilinnya lagi ♡"
          : "Tiup lilinnya ♡"}
      </button>
    </SceneLayout>
  );
}
