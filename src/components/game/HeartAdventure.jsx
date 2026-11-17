import { useEffect, useRef, useState } from "react";
import "../../styles/game.css";

import {
  WIDTH,
  HEIGHT,
  WORLD_WIDTH,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  GROUND_Y,
  REQUIRED_HEARTS
} from "../../game/constants";

import {
  platforms,
  ladders,
  END_STAIRS,
  heartItems,
  enemyTemplates,
  FLAG,
  CASTLE_DOOR_X,
  partner
} from "../../game/levels/level1";

import { loadHeadSprites } from "../../game/assets/sprites";

import { updatePlayer } from "../../game/engine/physics";

import { overlaps } from "../../game/engine/collision";

import {
  updateEnemies,
  isPlayerHit
} from "../../game/entities/enemies";

import { drawWorld } from "../../game/rendering/world";

function createGame() {
  return {
    player: {
    x: 55,
    y: GROUND_Y - PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    onGround: true,
    onLadder: false,
    facing: "kanan"
    },
    checkpoint: 55,
    collected: new Set(),
    warned: false,
    enemies: enemyTemplates.map((enemy) => ({ ...enemy })),
    flagY: FLAG.top + 15,
    finishStep: null,
  };
}

export default function HeartAdventure({ onComplete }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(createGame());
  const spritesRef = useRef({});

  const controlsRef = useRef({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false
  });

  const statusRef = useRef("ready");

  const [status, setStatus] = useState("ready");
  const [score, setScore] = useState(0);
  const [notice, setNotice] = useState("");

  function startGame() {
    gameRef.current = createGame();

    controlsRef.current = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false
    };

    statusRef.current = "playing";
    setStatus("playing");
    setScore(0);
    setNotice("");
  }

  function pressControl(key, event) {
    event.preventDefault();

    if (statusRef.current !== "playing") return;

    event.currentTarget.setPointerCapture?.(event.pointerId);
    controlsRef.current[key] = true;
  }

  function releaseControl(key) {
    controlsRef.current[key] = false;
  }

    useEffect(() => {
    spritesRef.current = loadHeadSprites();

    return () => {
        spritesRef.current = {};
    };
    }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let frameId;
    let lastTime = 0;

    const resetControls = () => {
      controlsRef.current = {
        left: false,
        right: false,
        up: false,
        down: false,
        jump: false
      };
    };

    const respawn = () => {
      const game = gameRef.current;

      game.player.x = game.checkpoint;
      game.player.y = GROUND_Y - PLAYER_HEIGHT;
      game.player.vx = 0;
      game.player.vy = 0;
      game.player.onGround = true;
      game.player.onLadder = false;

      setNotice("Ups, jatuh atau kena mob. Coba lagi yaa, sayang ♡");
    };

    function keyDown(event) {
      const key = event.key.toLowerCase();

      if (statusRef.current !== "playing") return;

      if (["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "d", "w", "s", " "].includes(key)) {
        event.preventDefault();
      }

      if (key === "arrowleft" || key === "a") {
        controlsRef.current.left = true;
      }

      if (key === "arrowright" || key === "d") {
        controlsRef.current.right = true;
      }

      if (key === "arrowup" || key === "w") {
        controlsRef.current.up = true;
      }

      if (key === "arrowdown" || key === "s") {
        controlsRef.current.down = true;
      }

      if ((key === " " || key === "arrowup") && !event.repeat) {
        controlsRef.current.jump = true;
      }
    }

    function keyUp(event) {
      const key = event.key.toLowerCase();

      if (key === "arrowleft" || key === "a") {
        controlsRef.current.left = false;
      }

      if (key === "arrowright" || key === "d") {
        controlsRef.current.right = false;
      }

      if (key === "arrowup" || key === "w") {
        controlsRef.current.up = false;
      }

      if (key === "arrowdown" || key === "s") {
        controlsRef.current.down = false;
      }
    }

    function update(delta) {
      const game = gameRef.current;
      const player = game.player;

      if (statusRef.current === "finishing") {
        // Tahap 1: bendera turun dan
        // karakter meluncur di tiang.
        if (game.finishStep === "slide") {
          game.flagY = Math.min(
            FLAG.bottom - 50,
            game.flagY + 3.6 * delta
          );

          player.x = FLAG.x + 7;
          player.vx = 0;
          player.vy = 0;
          player.onLadder = false;
          player.facing = "kanan";

          player.y = Math.min(
            GROUND_Y - PLAYER_HEIGHT,
            player.y + 4.2 * delta
          );

          const flagDown =
            game.flagY >= FLAG.bottom - 50;

          const playerDown =
            player.y >= GROUND_Y - PLAYER_HEIGHT;

          if (playerDown) {
            player.onGround = true;
          }

          if (flagDown && playerDown) {
            game.finishStep = "walk";
          }
        }

        // Tahap 2: karakter berjalan sendiri
        // menuju pintu kastil.
        else if (game.finishStep === "walk") {
          player.x = Math.min(
            CASTLE_DOOR_X,
            player.x + 2.8 * delta
          );

          player.vx = 2.8;
          player.facing = "kanan";

          if (player.x >= CASTLE_DOOR_X) {
            player.vx = 0;
            game.finishStep = "done";

            statusRef.current = "won";
            setStatus("won");
            setNotice("");
          }
        }

        return;
      }

      // Gerakkan semua mob
      updateEnemies(game.enemies, delta);

      // Jalankan gerakan pemain,
      // gravitasi, tangga, dan collision
      updatePlayer(
        player,
        controlsRef.current,
        delta
      );

      if (player.x > 1600) {
        game.checkpoint = 1560;
      }

      if (player.x > 2500) {
        game.checkpoint = 2520;
      }

      if (player.y > HEIGHT + 50) {
        respawn();
        return;
      }

      heartItems.forEach((heart, index) => {
        if (game.collected.has(index)) return;

        const nearHeart =
          Math.abs(player.x + PLAYER_WIDTH / 2 - heart.x) < 28 &&
          Math.abs(player.y + PLAYER_HEIGHT / 2 - heart.y) < 34;

        if (nearHeart) {
          game.collected.add(index);
          setScore(game.collected.size);
          setNotice("");
        }
      });

      const playerBox = {
        x: player.x,
        y: player.y,
        w: PLAYER_WIDTH,
        h: PLAYER_HEIGHT
      };

      if (isPlayerHit(player, game.enemies)) {
        respawn();
        return;
      }

      const flagHitbox = {
        x: FLAG.x - 10,
        y: FLAG.top,
        w: 24,
        h: FLAG.bottom - FLAG.top
      };

      if (overlaps(playerBox, flagHitbox)) {
        if (game.collected.size >= REQUIRED_HEARTS) {
          // Mulai animasi penyelesaian level
          statusRef.current = "finishing";
          setStatus("finishing");

          game.finishStep = "slide";
          player.vx = 0;
          player.vy = 0;

          setNotice(
            "Yeay, kamu berhasil! Bentar yaa ♡"
          );
        } else if (!game.warned) {
          game.warned = true;

          setNotice(
            `Kumpulin ${REQUIRED_HEARTS} hati dulu yaa, sayang ♡`
          );
        }
      } else {
        game.warned = false;
      }

    }

    function frame(time) {
      const delta = lastTime ? Math.min((time - lastTime) / 16.67, 2) : 1;
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

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("blur", resetControls);

    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", resetControls);
    };
  }, []);

  return (
    <div className="adventure">
      <div className="adventure__topbar">
        <span>♡ Hati: {score} / {REQUIRED_HEARTS}</span>
        <span>Level 1 — Menuju Kastil</span>
      </div>

      <div className="adventure__viewport">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          aria-label="Permainan platform petualangan menuju kastil"
        />

        {status === "ready" && (
          <div className="adventure__overlay">
            <span className="adventure__emoji">🏰</span>
            <h2>Petualangan Menuju Kastil ♡</h2>
            <p>
              Lewatin jurang, hindari mob, naik tangga,
              kumpulin {REQUIRED_HEARTS} hati, lalu temui pasanganmu di kastil.
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
            <span className="adventure__emoji">🏰</span>

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
        <p className="adventure__notice" role="status">
          {notice}
        </p>
      )}

      <div className="adventure__controls">
        <div className="adventure__move">
          <button
            type="button"
            aria-label="Jalan ke kiri"
            disabled={status !== "playing"}
            onPointerDown={(event) => pressControl("left", event)}
            onPointerUp={() => releaseControl("left")}
            onPointerCancel={() => releaseControl("left")}
          >
            ←
          </button>

          <button
            type="button"
            aria-label="Jalan ke kanan"
            disabled={status !== "playing"}
            onPointerDown={(event) => pressControl("right", event)}
            onPointerUp={() => releaseControl("right")}
            onPointerCancel={() => releaseControl("right")}
          >
            →
          </button>
        </div>

        <div className="adventure__action">
          <button
            type="button"
            aria-label="Naik tangga"
            disabled={status !== "playing"}
            onPointerDown={(event) => pressControl("up", event)}
            onPointerUp={() => releaseControl("up")}
            onPointerCancel={() => releaseControl("up")}
          >
            ↑
          </button>

          <button
            type="button"
            aria-label="Turun tangga"
            disabled={status !== "playing"}
            onPointerDown={(event) => pressControl("down", event)}
            onPointerUp={() => releaseControl("down")}
            onPointerCancel={() => releaseControl("down")}
          >
            ↓
          </button>

          <button
            type="button"
            className="adventure__jump"
            disabled={status !== "playing"}
            onPointerDown={(event) => pressControl("jump", event)}
            onPointerUp={() => releaseControl("jump")}
            onPointerCancel={() => releaseControl("jump")}
          >
            Lompat
          </button>
        </div>
      </div>

      <p className="adventure__hint">
        Komputer: ← → untuk jalan, Spasi untuk lompat, ↑ ↓ untuk naik/turun tangga.
        HP: pakai tombol di bawah permainan.
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