import { useState } from "react";
import SceneLayout from "../components/SceneLayout";

export default function CakeScene({ birthday }) {
  const [candlesOut, setCandlesOut] = useState(false);
  const nickname = birthday?.recipient?.nickname || "sayang";
  const candleCount = Math.min(
    Math.max(birthday?.cake?.candles || 3, 1),
    8
  );

  return (
    <SceneLayout
      className="cake-scene"
      eyebrow="Hari spesial kamu"
      title={`Selamat Ulang Tahun, ${nickname}! ♡`}
      description={birthday?.cake?.message}
    >
      <div className={`cake-card ${candlesOut ? "is-celebrating" : ""}`}>
        <div className="cake-card__art">
          <span className="cake-card__label">SEPOTONG MANIS DI HARI ISTIMEWA</span>
          <div className="cake-stage">
            <span className="cake-sparkle cake-sparkle--one" aria-hidden="true">✦</span>
            <span className="cake-sparkle cake-sparkle--two" aria-hidden="true">✧</span>
            <span className="cake-sparkle cake-sparkle--three" aria-hidden="true">♡</span>

            <div
              className="cake-illustration"
              id="birthday-cake"
              role="img"
              aria-label={candlesOut
                ? "Kue tiga tingkat berwarna pink dan krem dengan lilin yang sudah padam"
                : "Kue tiga tingkat berwarna pink dan krem dengan lilin menyala"}
            >
              <div className="cake-candles">
                {Array.from({ length: candleCount }, (_, index) => (
                  <div className="candle" key={index}>
                    <span className={candlesOut ? "candle-smoke" : "candle-flame"} />
                  </div>
                ))}
              </div>

              <div className="cake-top">
                <div className="cake-icing" />
                <div className="cake-sprinkles">
                  {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
                </div>
              </div>
              <div className="cake-middle">
                <span className="cake-seal">♡</span>
              </div>
              <div className="cake-bottom" />
              <div className="cake-ribbon" aria-hidden="true"><span /><span /><i /></div>
              <div className="cake-plate" />
              <div className="cake-stand" />
            </div>
          </div>
          <p className="cake-card__status" id="cake-status" role="status">
            {candlesOut ? "Lilinnya padam, semoga doanya sampai ♡" : "Tutup mata sebentar, buat satu permintaan ♡"}
          </p>
        </div>

        <div className="cake-card__message">
          <span className="cake-card__stamp" aria-hidden="true">♡</span>
          <span className="cake-card__eyebrow">SATU DOA, BANYAK HARAPAN</span>
          <h2>{candlesOut ? "Aamiin, semoga terkabul yaa!" : "Bikin satu permintaan, yuk."}</h2>
          <p>
            {candlesOut
              ? "Semoga semua yang kamu harapin bisa tercapai satu per satu. Aku juga bakal ikut seneng kalau kamu bahagia."
              : "Sebelum lanjut, coba tutup mata sebentar, terus bikin satu permintaan dulu, yaa."}
          </p>
          <p>
            {candlesOut
              ? "Semoga hari-hari kamu selalu dipenuhi hal baik, senyum yang tulus, dan banyak alasan untuk bahagia. ♡"
              : `Kalau udah, tiup lilinnya. Semoga permintaannya terkabul, ${nickname}. ♡`}
          </p>
          <button
            type="button"
            className="btn btn--primary btn--large"
            aria-controls="birthday-cake"
            aria-describedby="cake-status"
            onClick={() => setCandlesOut(value => !value)}
          >
            {candlesOut ? "Nyalain lilinnya lagi ♡" : "Tiup lilinnya ♡"}
          </button>
          <div className="cake-card__signature">
            <span>Aku ikut mendoakan yang terbaik,</span>
            <strong>{birthday?.sender?.name || "Aku"} <span aria-hidden="true">♡</span></strong>
          </div>
        </div>
      </div>
    </SceneLayout>
  );
}
