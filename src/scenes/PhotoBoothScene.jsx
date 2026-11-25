
import { useEffect, useRef, useState } from "react";
import SceneLayout from "../components/SceneLayout";
import PhotoAlbum from "../components/PhotoAlbum";
import {
  capturePhoto,
  composeBirthdayPhoto
} from "../utils/photoComposer";
import { getFrameStickerNames, getStickerSource } from "../utils/photoboothStickers";

import "../styles/photobooth.css";

const frames = [
  { id: "princess", label: "Putri Cantik", symbol: "♛" },
  { id: "love-strip", label: "Foto Kita", symbol: "♡" },
  { id: "scrapbook", label: "Kenangan Manis", symbol: "✿" },
  { id: "royal", label: "Hari Spesial", symbol: "✦" },
  { id: "birthday-doodle", label: "Birthday Doodle", symbol: "♡" }
];

function getCameraError(error) {
  switch (error?.name) {
    case "NotAllowedError":
      return "Izin kameranya belum diberikan. Coba izinkan lewat pengaturan browser, yaa.";
    case "NotFoundError":
      return "Kameranya nggak ketemu di perangkat ini.";
    case "NotReadableError":
      return "Kameranya lagi dipakai aplikasi lain. Coba tutup aplikasi itu dulu.";
    case "OverconstrainedError":
      return "Pengaturan kamera ini belum didukung perangkat kamu.";
    default:
      return error?.message ||
        "Kameranya belum bisa dibuka. Coba lagi, yaa.";
  }
}

export default function PhotoBoothScene({ birthday }) {
  const defaultFrame =
    birthday?.photoBooth?.defaultFrame || "birthday-doodle";

  const [selectedFrame, setSelectedFrame] = useState(
    frames.some(frame => frame.id === defaultFrame)
      ? defaultFrame
      : "princess"
  );

  const [facingMode, setFacingMode] = useState("user");
  const [cameraStatus, setCameraStatus] = useState("idle");
  const [error, setError] = useState("");

  const [photoCount, setPhotoCount] = useState(3);
  const [timerSeconds, setTimerSeconds] = useState(
    birthday?.photoBooth?.countdown === 5 ? 5 : 3
  );

  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [renderedResult, setRenderedResult] = useState(null);
  const resultMatches = renderedResult?.photos === photos && renderedResult?.frame === selectedFrame;
  const resultUrl = resultMatches ? renderedResult.url : null;
  const isRendering = photos.length > 0 && !isCapturing && !resultMatches;

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const requestRef = useRef(0);
  const runRef = useRef(0);
  const delayRef = useRef(null);
  const resultUrlRef = useRef(null);

  const activeFrame = frames.find(
    frame => frame.id === selectedFrame
  ) || frames[0];

  function clearResult() {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }

    setRenderedResult(null);
  }

  function cancelPendingTimer() {
    runRef.current += 1;

    if (delayRef.current) {
      clearTimeout(delayRef.current.id);
      delayRef.current.resolve(false);
      delayRef.current = null;
    }
  }

  function cancelCapture() {
    cancelPendingTimer();
    setIsCapturing(false);
    setCountdown(null);
  }

  function stopTracks() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function stopCamera() {
    requestRef.current += 1;
    cancelCapture();
    stopTracks();
    setCameraStatus("idle");
  }

  async function startCamera(mode = "user") {
    cancelCapture();

    const requestId = ++requestRef.current;

    stopTracks();
    setError("");
    setCameraStatus("loading");
    setFacingMode(mode);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "Browser ini belum mendukung kamera, atau websitenya belum dibuka lewat HTTPS."
      );
      setCameraStatus("idle");
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 960 }
          }
        });

      if (requestId !== requestRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (requestId === requestRef.current) {
        setCameraStatus("ready");
      }
    } catch (err) {
      if (requestId !== requestRef.current) return;

      stopTracks();
      setCameraStatus("idle");
      setError(getCameraError(err));
    }
  }

  function wait(ms) {
    return new Promise(resolve => {
      const id = setTimeout(() => {
        delayRef.current = null;
        resolve(true);
      }, ms);

      delayRef.current = { id, resolve };
    });
  }

  async function startSession() {
    if (cameraStatus !== "ready" || isCapturing) {
      return;
    }

    cancelPendingTimer();
    const runId = runRef.current;

    clearResult();
    setPhotos([]);
    setError("");
    setIsCapturing(true);

    const captured = [];

    try {
      for (let index = 0; index < photoCount; index++) {
        for (let second = timerSeconds; second > 0; second--) {
          if (runId !== runRef.current) return;

          setCountdown(second);

          const completed = await wait(1000);
          if (!completed || runId !== runRef.current) {
            return;
          }
        }

        setCountdown(null);

        const photo = capturePhoto(
          videoRef.current,
          facingMode === "user"
        );

        captured.push(photo);
        setPhotos([...captured]);

        if (index < photoCount - 1) {
          const completed = await wait(350);

          if (!completed || runId !== runRef.current) {
            return;
          }
        }
      }

      if (runId === runRef.current) {
        setIsCapturing(false);
      }
    } catch (err) {
      if (runId !== runRef.current) return;

      setError(err.message);
      setIsCapturing(false);
      setCountdown(null);
    }
  }

  function retakePhotos() {
    cancelCapture();
    clearResult();
    setPhotos([]);
    setError("");
  }

  // Membuat PNG setelah sesi foto selesai.
  // Memilih bingkai lain akan membuat ulang hasilnya.
  useEffect(() => {
    if (isCapturing || photos.length === 0) return;

    let active = true;

    composeBirthdayPhoto(photos, selectedFrame)
      .then(blob => {
        if (!active) return;

        const url = URL.createObjectURL(blob);

        if (resultUrlRef.current) {
          URL.revokeObjectURL(resultUrlRef.current);
        }

        resultUrlRef.current = url;
        setRenderedResult({ photos, frame: selectedFrame, url, blob,
          id: crypto.randomUUID(), count: photos.length, createdAt: new Date().toISOString() });
      })
      .catch(err => {
        if (!active) return;

        setError(err.message);
        setRenderedResult({ photos, frame: selectedFrame, url: null });
      });

    return () => {
      active = false;
    };
  }, [photos, selectedFrame, isCapturing]);

  // Hentikan kamera dan bersihkan file sementara
  // ketika pengguna meninggalkan halaman.
  useEffect(() => {
    return () => {
      requestRef.current += 1;
      cancelPendingTimer();

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(
          track => track.stop()
        );
        streamRef.current = null;
      }

      if (resultUrlRef.current) {
        URL.revokeObjectURL(resultUrlRef.current);
        resultUrlRef.current = null;
      }
    };
  }, []);

  return (
    <SceneLayout
      className="photobooth-scene"
      eyebrow="Senyum dulu, sayang"
      title="Foto-Foto Dulu, Yuk!"
      description="Aku bikinin tempat foto kecil buat kamu. Biar ada yang bisa kamu simpen dari hari ini."
    >
      <div className="booth-container">
        <div className={`booth-camera frame--${selectedFrame}`}>
          <div className="booth-camera__heading">
            <span className="booth-camera__eyebrow">BIRTHDAY PHOTO CLUB</span>
            <strong>{activeFrame.label}</strong>
          </div>

          <div className="booth-camera__screen">
            <video
              ref={videoRef}
              className={`booth-video ${
                cameraStatus !== "ready" ? "is-hidden" : ""
              }`}
              autoPlay
              playsInline
              muted
              style={{
                transform:
                  facingMode === "user"
                    ? "scaleX(-1)"
                    : "none"
              }}
            />

            <div
              className={`booth-frame-stickers booth-frame-stickers--${selectedFrame}`}
              aria-hidden="true"
            >
              {getFrameStickerNames(selectedFrame).map((sticker, index) => (
                <img
                  key={`${sticker}-${index}`}
                  className={`booth-frame-stickers__item booth-frame-stickers__item--${index + 1}`}
                  src={getStickerSource(sticker)}
                  alt=""
                  draggable={false}
                  width={80}
                  height={80}
                  decoding="async"
                />
              ))}
            </div>

            {cameraStatus === "idle" && (
              <div className="booth-placeholder">
                <span>♡</span>
                <p>Yuk, siapin senyum cantik kamu!</p>
              </div>
            )}

            {cameraStatus === "loading" && (
              <div className="booth-placeholder">
                <span>✦</span>
                <p>Lagi nyalain kameranya...</p>
              </div>
            )}

            {countdown !== null && (
              <div
                className="booth-countdown"
                aria-live="polite"
              >
                {countdown}
              </div>
            )}

            {cameraStatus === "ready" &&
              countdown === null && (
                <div className="booth-camera__hint">
                  Senyum dulu, sayang ♡
                </div>
              )}
          </div>

          <div className="booth-camera__footer">
            <span>♡ Hari spesial kamu ♡</span>
            <small>Satu senyum, satu kenangan manis.</small>
          </div>
        </div>

        <div className="booth-controls">
          <div className="booth-controls__group">
            <h3>Pilih bingkainya</h3>

            <div className="frame-options">
              {frames.map(frame => (
                <button
                  key={frame.id}
                  type="button"
                  className={`frame-option frame-option--${frame.id} ${
                    selectedFrame === frame.id
                      ? "is-selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedFrame(frame.id)
                  }
                  disabled={isCapturing}
                  aria-pressed={
                    selectedFrame === frame.id
                  }
                >
                  <img className="frame-option__icon" src={getStickerSource(getFrameStickerNames(frame.id)[0])} alt="" width={48} height={40} draggable={false} decoding="async" />
                  <small>{frame.label}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="booth-settings">
            <label>
              Jumlah foto
              <select
                value={photoCount}
                onChange={event => {
                  setPhotoCount(Number(event.target.value));
                  retakePhotos();
                }}
                disabled={isCapturing}
              >
                <option value={1}>1 foto</option>
                <option value={4}>4 foto otomatis</option>
                <option value={3}>3 foto otomatis (1:3)</option>
              </select>
            </label>

            <label>
              Hitung mundur
              <select
                value={timerSeconds}
                onChange={event =>
                  setTimerSeconds(Number(event.target.value))
                }
                disabled={isCapturing}
              >
                <option value={3}>3 detik</option>
                <option value={5}>5 detik</option>
              </select>
            </label>
          </div>

          {error && (
            <p className="booth-error" role="alert">
              {error}
            </p>
          )}

          <div className="booth-actions">
            {cameraStatus === "idle" ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => startCamera("user")}
              >
                Nyalain kamera ♡
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => startCamera(
                    facingMode === "user"
                      ? "environment"
                      : "user"
                  )}
                  disabled={
                    cameraStatus !== "ready" ||
                    isCapturing
                  }
                >
                  Balik kamera
                </button>

                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={stopCamera}
                >
                  Matikan kamera
                </button>

                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={startSession}
                  disabled={
                    cameraStatus !== "ready" ||
                    isCapturing
                  }
                >
                  {isCapturing
                    ? "Lagi foto-foto..."
                    : "Mulai foto ♡"}
                </button>
              </>
            )}
          </div>
        </div>

        {photos.length > 0 && (
          <div className="booth-result">
            <h3>
              {isCapturing
                ? `Udah ${photos.length} dari ${photoCount} foto ♡`
                : "Hehe, ini hasil fotonya! ♡"}
            </h3>

            {isCapturing ? (
              <div className="booth-thumbnails">
                {photos.map((photo, index) => (
                  <img
                    src={photo}
                    alt={`Foto ke-${index + 1}`}
                    key={index}
                  />
                ))}
              </div>
            ) : (
              <>
                {isRendering && (
                  <p>Lagi nyiapin bingkainya...</p>
                )}

                {resultUrl && !isRendering && (
                  <img
                    className="booth-result__image"
                    src={resultUrl}
                    alt="Hasil foto ulang tahun dengan bingkai"
                  />
                )}

                <div className="booth-actions">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={retakePhotos}
                  >
                    Foto ulang
                  </button>

                  {resultUrl && !isRendering && (
                    <a
                      className="btn btn--primary"
                      href={resultUrl}
                      download="foto-ulang-tahun-sayang.png"
                    >
                      Unduh PNG ♡
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        <PhotoAlbum currentPhoto={resultMatches && !isCapturing && renderedResult?.blob ? renderedResult : null} />
      </div>
    </SceneLayout>
  );
}
