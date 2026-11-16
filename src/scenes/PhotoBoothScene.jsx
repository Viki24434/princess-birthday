
import { useState } from "react";
import SceneLayout from "../components/SceneLayout";

const frames = [
  {
    id: "princess",
    label: "Putri Cantik",
    symbol: "♛"
  },
  {
    id: "love-strip",
    label: "Foto Kita",
    symbol: "♡"
  },
  {
    id: "scrapbook",
    label: "Kenangan Manis",
    symbol: "✿"
  },
  {
    id: "royal",
    label: "Hari Spesial",
    symbol: "✦"
  }
];

export default function PhotoBoothScene({ birthday }) {
  const [selectedFrame, setSelectedFrame] =
    useState(
      birthday?.photoBooth?.defaultFrame || "princess"
    );

  const activeFrame =
    frames.find(frame => frame.id === selectedFrame)
    || frames[0];

  return (
    <SceneLayout
      className="photobooth-scene"
      eyebrow="Senyum dulu, sayang"
      title="Foto-Foto Dulu, Yuk!"
      description="Biar ada foto lucu yang bisa kamu simpen dari hari ini."
    >
      <div className="photobooth-card">
        <div
          className={`photo-frame frame--${selectedFrame}`}
        >
          <div className="photo-frame__header">
            ✦ Selamat Ulang Tahun ✦
          </div>

          <div className="photo-frame__preview">
            <span>{activeFrame.symbol}</span>

            <p>
              Nanti foto cantik kamu
              ada di sini ♡
            </p>
          </div>

          <div className="photo-frame__footer">
            Senyum terus yaa, sayang ♡
          </div>
        </div>

        <div className="frame-picker">
          <h3>Pilih bingkainya, yaa</h3>

          <div className="frame-options">
            {frames.map(frame => (
              <button
                key={frame.id}
                type="button"
                className={
                  selectedFrame === frame.id
                    ? "frame-option is-selected"
                    : "frame-option"
                }
                onClick={() =>
                  setSelectedFrame(frame.id)
                }
                aria-pressed={
                  selectedFrame === frame.id
                }
              >
                <span>{frame.symbol}</span>
                <small>{frame.label}</small>
              </button>
            ))}
          </div>
        </div>

        <p className="feature-note">
          Sabar yaa, sayang. Aku lagi
          nyiapin tempat foto-foto
          yang lucu buat kamu, hehe.
        </p>

        <button
          type="button"
          className="btn btn--primary btn--large"
          disabled
        >
          Kameranya belum siap, hehe ♡
        </button>
      </div>
    </SceneLayout>
  );
}
