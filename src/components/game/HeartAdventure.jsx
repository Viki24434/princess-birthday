
import { useEffect, useRef, useState } from "react";
import "../../styles/game.css";

import { REQUIRED_HEARTS, WIDTH, HEIGHT } from "../../game/constants";

import {
  createGame,
  respawnPlayer
} from "../../game/engine/gameState";

import { updatePlayer } from "../../game/engine/physics";

import {
  updateEnemies
} from "../../game/entities/enemies";

import {
  updateCheckpoint,
  isPlayerInVoid,
  collectHearts,
  hasHitEnemy,
  checkFlagContact
} from "../../game/systems/progress";

import {
  beginFinishSequence,
  updateFinishSequence
} from "../../game/systems/finishSequence";

import {
  createControls,
  resetControls,
  registerKeyboardControls,
  pressControl,
  releaseControl
} from "../../game/systems/input";

import { loadHeadSprites } from "../../game/assets/sprites";
import { drawWorld } from "../../game/rendering/world";

export default function HeartAdventure({ onComplete }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(createGame());
  const spritesRef = useRef({});

  const controlsRef = useRef(createControls());
  const statusRef = useRef("ready");

  const [status, setStatus] = useState("ready");
  const [score, setScore] = useState(0);
  const [notice, setNotice] = useState("");

  // ====================================
  // MULAI / ULANG PERMAINAN
  // ====================================

  function startGame() {
    gameRef.current = createGame();
    resetControls(controlsRef.current);

    statusRef.current = "playing";

    setStatus("playing");
    setScore(0);
    setNotice("");
  }

  // ====================================
  // TOMBOL KONTROL HP
  // ====================================

  function handlePress(key, event) {
    pressControl(
      key,
      event,
      controlsRef,
      statusRef
    );
  }

  function handleRelease(key) {
    releaseControl(key, controlsRef);
  }

  // ====================================
  // GAME LOOP
  // ====================================

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx) return;

    spritesRef.current = loadHeadSprites();

    let frameId;
    let lastTime = 0;

    const unregisterKeyboard = registerKeyboardControls(
      controlsRef,
      statusRef
    );

    const handleBlur = () => {
      resetControls(controlsRef.current);
    };

    window.addEventListener("blur", handleBlur);

    // ====================================
    // RESPAWN
    // ====================================

    function respawn() {
      respawnPlayer(gameRef.current);

      setNotice(
        "Ups, jatuh atau kena mob. Coba lagi yaa, sayang ♡"
      );
    }

    // ====================================
    // UPDATE GAME
    // ====================================

    function update(delta) {
      const game = gameRef.current;
      const player = game.player;

      // Animasi akhir permainan
      if (statusRef.current === "finishing") {
        const finished = updateFinishSequence(
          game,
          delta
        );

        if (finished) {
          statusRef.current = "won";
          setStatus("won");
          setNotice("");
        }

        return;
      }

      // Gerakkan mob
      updateEnemies(game.enemies, delta);

      // Physics pemain
      updatePlayer(
        player,
        controlsRef.current,
        delta
      );

      // Checkpoint
      updateCheckpoint(game);

      // Jatuh ke jurang
      if (isPlayerInVoid(game)) {
        respawn();
        return;
      }

      // Mengumpulkan hati
      const collectedNewHeart = collectHearts(game);

      if (collectedNewHeart) {
        setScore(game.collected.size);
        setNotice("");
      }

      // Tabrakan dengan mob
      if (hasHitEnemy(game)) {
        respawn();
        return;
      }

      // Cek tiang bendera
      const flagResult = checkFlagContact(game);

      if (flagResult === "finish") {
        beginFinishSequence(game);

        statusRef.current = "finishing";
        setStatus("finishing");

        setNotice(
          "Yeay, kamu berhasil! Bentar yaa ♡"
        );
      }

      if (flagResult === "missing-hearts") {
        setNotice(
          `Kumpulin ${REQUIRED_HEARTS} hati dulu yaa, sayang ♡`
        );
      }
    }

    // ====================================
    // RENDER FRAME
    // ====================================

    function frame(time) {
      const delta = lastTime
        ? Math.min((time - lastTime) / 16.67, 2)
        : 1;

      lastTime = time;

      if (
        statusRef.current === "playing" ||
        statusRef.current === "finishing"
      ) {
        update(delta);
      }

      drawWorld(
        ctx,
        gameRef.current,
        time,
        spritesRef.current
      );

      frameId = requestAnimationFrame(frame);
    }

    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      unregisterKeyboard();

      window.removeEventListener(
        "blur",
        handleBlur
      );
    };
  }, []);

  // ====================================
  // TAMPILAN REACT
  // ====================================

  return (
    <div className="adventure">
      <div className="adventure__topbar">
        <span>
          ♡ Hati: {score} / {REQUIRED_HEARTS}
        </span>

        <span>Level 1 — Menuju Kastil</span>
      </div>

      <div className="adventure__viewport">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          aria-label="Permainan petualangan menuju kastil"
        />

        {status === "ready" && (
          <div className="adventure__overlay">
            <span className="adventure__emoji">
              🏰
            </span>

            <h2>Petualangan Menuju Kastil ♡</h2>

            <p>
              Lewatin jurang, hindari mob,
              kumpulin {REQUIRED_HEARTS} hati,
              terus turunin benderanya yaa.
              Aku tunggu di kastil! ♡
            </p>

            <button
              type="button"
              className="btn btn--primary"
              onClick={startGame}
            >
              Mulai Main ♡
            </button>
          </div>
        )}

        {status === "won" && (
          <div className="adventure__overlay">
            <span className="adventure__emoji">
              💖
            </span>

            <h2>Akhirnya sampai juga, sayang! ♡</h2>

            <p>
              Hehe, kamu berhasil lewatin semuanya.
              Aku udah nungguin kamu di sini, nih.
              Sekarang masih ada satu hal lagi
              yang pengen aku kasih ke kamu.
            </p>

            <button
              type="button"
              className="btn btn--primary"
              onClick={onComplete}
            >
              Lihat kejutan berikutnya ♡
            </button>
          </div>
        )}
      </div>

      {notice && (
        <p
          className="adventure__notice"
          role="status"
        >
          {notice}
        </p>
      )}

      <div className="adventure__controls">
        <div className="adventure__move">
          <button
            type="button"
            aria-label="Jalan ke kiri"
            disabled={status !== "playing"}
            onPointerDown={(event) =>
              handlePress("left", event)
            }
            onPointerUp={() =>
              handleRelease("left")
            }
            onPointerCancel={() =>
              handleRelease("left")
            }
          >
            ←
          </button>

          <button
            type="button"
            aria-label="Jalan ke kanan"
            disabled={status !== "playing"}
            onPointerDown={(event) =>
              handlePress("right", event)
            }
            onPointerUp={() =>
              handleRelease("right")
            }
            onPointerCancel={() =>
              handleRelease("right")
            }
          >
            →
          </button>
        </div>

        <div className="adventure__action">
          <button
            type="button"
            aria-label="Naik tangga"
            disabled={status !== "playing"}
            onPointerDown={(event) =>
              handlePress("up", event)
            }
            onPointerUp={() =>
              handleRelease("up")
            }
            onPointerCancel={() =>
              handleRelease("up")
            }
          >
            ↑
          </button>

          <button
            type="button"
            aria-label="Turun tangga"
            disabled={status !== "playing"}
            onPointerDown={(event) =>
              handlePress("down", event)
            }
            onPointerUp={() =>
              handleRelease("down")
            }
            onPointerCancel={() =>
              handleRelease("down")
            }
          >
            ↓
          </button>

          <button
            type="button"
            className="adventure__jump"
            aria-label="Lompat"
            disabled={status !== "playing"}
            onPointerDown={(event) =>
              handlePress("jump", event)
            }
            onPointerUp={() =>
              handleRelease("jump")
            }
            onPointerCancel={() =>
              handleRelease("jump")
            }
          >
            Lompat
          </button>
        </div>
      </div>

      <p className="adventure__hint">
        Komputer: ← → untuk jalan,
        Spasi untuk lompat,
        ↑ ↓ untuk naik atau turun tangga.
        HP: gunakan tombol di bawah permainan.
      </p>

      {status === "playing" && (
        <button
          type="button"
          className="adventure__restart"
          onClick={startGame}
        >
          Ulang permainan
        </button>
      )}
    </div>
  );
}
