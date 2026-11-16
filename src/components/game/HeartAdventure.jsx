
import { useEffect, useRef, useState } from "react";
import "../../styles/game.css";

const WIDTH = 720;
const HEIGHT = 400;
const WORLD_WIDTH = 2360;

const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 42;
const GROUND_Y = 330;

const platforms = [
  { x: 0, y: 330, w: 570, h: 70 },
  { x: 650, y: 330, w: 420, h: 70 },
  { x: 1170, y: 330, w: 370, h: 70 },
  { x: 1640, y: 330, w: 720, h: 70 },

  { x: 230, y: 260, w: 130, h: 16 },
  { x: 770, y: 245, w: 130, h: 16 },
  { x: 1210, y: 250, w: 120, h: 16 },
  { x: 1770, y: 255, w: 130, h: 16 },
  { x: 2040, y: 245, w: 145, h: 16 }
];

const hearts = [
  { x: 185, y: 293 },
  { x: 285, y: 220 },
  { x: 795, y: 205 },
  { x: 990, y: 293 },
  { x: 1245, y: 210 },
  { x: 1815, y: 215 },
  { x: 2120, y: 205 }
];

const enemies = [
  { x: 455, y: 302, w: 32, h: 28 },
  { x: 1450, y: 302, w: 32, h: 28 },
  { x: 1930, y: 302, w: 32, h: 28 }
];

function createGame() {
  return {
    player: {
      x: 55,
      y: GROUND_Y - PLAYER_HEIGHT,
      vx: 0,
      vy: 0,
      onGround: true
    },
    checkpoint: 55,
    collected: new Set(),
    warned: false
  };
}

function overlaps(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function drawHeart(ctx, x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 20, size / 20);

  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.bezierCurveTo(-18, -2, -9, -15, 0, -7);
  ctx.bezierCurveTo(9, -15, 18, -2, 0, 8);

  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawWorld(ctx, game, time) {
  const player = game.player;

  const cameraX = Math.max(
    0,
    Math.min(player.x - 230, WORLD_WIDTH - WIDTH)
  );

  const sky = ctx.createLinearGradient(
    0, 0, 0, HEIGHT
  );
  sky.addColorStop(0, "#FBD8EB");
  sky.addColorStop(1, "#FFF8ED");

  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Awan yang bergerak pelan
  ctx.fillStyle = "#FFFFFF";

  for (let i = 0; i < 8; i++) {
    const x = i * 190 - cameraX * 0.18 + 30;
    const y = 65 + (i % 3) * 24;

    ctx.beginPath();
    ctx.ellipse(x, y, 38, 17, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 20, y - 9, 25, 19, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bukit jauh
  ctx.fillStyle = "#F4C9DB";
  for (let i = 0; i < 8; i++) {
    const x = i * 320 - cameraX * 0.35;
    ctx.beginPath();
    ctx.ellipse(x, 380, 195, 100, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(-cameraX, 0);

  // Platform tanah
  for (const platform of platforms) {
    ctx.fillStyle = "#D9A9B8";
    ctx.fillRect(
      platform.x,
      platform.y,
      platform.w,
      platform.h
    );

    ctx.fillStyle = "#F9D4E0";
    ctx.fillRect(
      platform.x,
      platform.y,
      platform.w,
      10
    );

    ctx.fillStyle = "#FFFFFF";
    for (let x = platform.x + 12;
      x < platform.x + platform.w - 5;
      x += 37) {
      ctx.fillRect(x, platform.y + 5, 12, 3);
    }
  }

  // Dekorasi bunga di tanah
  for (let x = 110; x < WORLD_WIDTH; x += 175) {
    const onGround = platforms
      .slice(0, 4)
      .some(p => x >= p.x && x < p.x + p.w);

    if (!onGround) continue;

    ctx.strokeStyle = "#92B99B";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, GROUND_Y);
    ctx.lineTo(x, GROUND_Y - 18);
    ctx.stroke();

    drawHeart(ctx, x, GROUND_Y - 23, 13, "#FFFFFF");
  }

  // Hati yang dapat dikumpulkan
  hearts.forEach((heart, index) => {
    if (game.collected.has(index)) return;

    const floatY = Math.sin(time / 350 + index) * 4;

    drawHeart(
      ctx,
      heart.x,
      heart.y + floatY,
      25,
      "#E774A4"
    );
  });

  // Monster kecil
  enemies.forEach(enemy => {
    ctx.fillStyle = "#A889BD";
    ctx.beginPath();
    ctx.ellipse(
      enemy.x + 16,
      enemy.y + 17,
      16,
      13,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(enemy.x + 8, enemy.y + 13, 5, 5);
    ctx.fillRect(enemy.x + 20, enemy.y + 13, 5, 5);

    ctx.fillStyle = "#6F547E";
    ctx.fillRect(enemy.x + 10, enemy.y + 15, 2, 3);
    ctx.fillRect(enemy.x + 22, enemy.y + 15, 2, 3);
  });

  // Kado tujuan akhir
  const giftX = 2250;

  ctx.fillStyle = "#E998BA";
  ctx.fillRect(giftX, 275, 55, 55);

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(giftX + 23, 275, 10, 55);
  ctx.fillRect(giftX - 5, 268, 65, 12);

  ctx.font = "32px serif";
  ctx.textAlign = "center";
  ctx.fillText("🎀", giftX + 28, 270);

  // Karakter kelinci pink
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(player.x + 6, player.y - 15, 8, 21);
  ctx.fillRect(player.x + 20, player.y - 15, 8, 21);

  ctx.fillStyle = "#EFA6C4";
  ctx.fillRect(player.x + 9, player.y - 10, 3, 12);
  ctx.fillRect(player.x + 23, player.y - 10, 3, 12);

  ctx.fillStyle = "#FFF9FC";
  ctx.fillRect(
    player.x,
    player.y,
    PLAYER_WIDTH,
    PLAYER_HEIGHT
  );

  ctx.fillStyle = "#D884AA";
  ctx.fillRect(player.x + 7, player.y + 13, 4, 4);
  ctx.fillRect(player.x + 22, player.y + 13, 4, 4);

  ctx.fillStyle = "#F4B8CE";
  ctx.fillRect(player.x + 12, player.y + 24, 9, 5);
  ctx.fillRect(player.x + 4, player.y + 37, 10, 5);
  ctx.fillRect(player.x + 20, player.y + 37, 10, 5);

  ctx.restore();
}

export default function HeartAdventure({ onComplete }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(createGame());
  const controlsRef = useRef({
    left: false,
    right: false,
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

    event.currentTarget.setPointerCapture?.(
      event.pointerId
    );

    controlsRef.current[key] = true;
  }

  function releaseControl(key) {
    if (key !== "jump") {
      controlsRef.current[key] = false;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let frameId;
    let lastTime = 0;

    const respawn = () => {
      const game = gameRef.current;

      game.player.x = game.checkpoint;
      game.player.y = GROUND_Y - PLAYER_HEIGHT;
      game.player.vx = 0;
      game.player.vy = 0;
      game.player.onGround = true;

      setNotice("Ups, coba lagi yaa, sayang ♡");
    };

    function keyDown(event) {
      const key = event.key.toLowerCase();

      if (statusRef.current !== "playing") return;

      if (["arrowleft", "arrowright", "arrowup",
           "a", "d", "w", " "].includes(key)) {
        event.preventDefault();
      }

      if (key === "arrowleft" || key === "a") {
        controlsRef.current.left = true;
      }

      if (key === "arrowright" || key === "d") {
        controlsRef.current.right = true;
      }

      if (
        (key === " " || key === "arrowup" || key === "w") &&
        !event.repeat
      ) {
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
    }

    function resetControls() {
      controlsRef.current = {
        left: false,
        right: false,
        jump: false
      };
    }

    function update(delta) {
      const game = gameRef.current;
      const player = game.player;
      const controls = controlsRef.current;

      player.vx = controls.right
        ? 5.3
        : controls.left
          ? -5.3
          : 0;

      if (controls.jump && player.onGround) {
        player.vy = -13;
        player.onGround = false;
      }

      controls.jump = false;

      const previousBottom =
        player.y + PLAYER_HEIGHT;

      player.vy = Math.min(
        player.vy + 0.64 * delta,
        16
      );

      player.x += player.vx * delta;
      player.y += player.vy * delta;

      player.x = Math.max(
        0,
        Math.min(WORLD_WIDTH - PLAYER_WIDTH, player.x)
      );

      player.onGround = false;

      for (const platform of platforms) {
        const crossingTop =
          previousBottom <= platform.y + 6 &&
          player.y + PLAYER_HEIGHT >= platform.y;

        const horizontallyInside =
          player.x + PLAYER_WIDTH > platform.x &&
          player.x < platform.x + platform.w;

        if (
          player.vy >= 0 &&
          crossingTop &&
          horizontallyInside
        ) {
          player.y = platform.y - PLAYER_HEIGHT;
          player.vy = 0;
          player.onGround = true;
        }
      }

      if (player.y > HEIGHT + 50) {
        respawn();
        return;
      }

      if (player.x > 1230) {
        game.checkpoint = 1200;
      }

      // Mengambil hati
      hearts.forEach((heart, index) => {
        if (game.collected.has(index)) return;

        const nearHeart =
          Math.abs(
            player.x + PLAYER_WIDTH / 2 - heart.x
          ) < 28 &&
          Math.abs(
            player.y + PLAYER_HEIGHT / 2 - heart.y
          ) < 34;

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

      if (enemies.some(enemy => overlaps(playerBox, enemy))) {
        respawn();
        return;
      }

      // Kado di ujung level
      const atGift = overlaps(playerBox, {
        x: 2250,
        y: 275,
        w: 55,
        h: 55
      });

      if (atGift && game.collected.size >= 3) {
        statusRef.current = "won";
        setStatus("won");
        setNotice("");
      } else if (atGift && !game.warned) {
        game.warned = true;
        setNotice(
          "Kumpulin minimal 3 hati dulu, yaa ♡"
        );
      } else if (!atGift) {
        game.warned = false;
      }
    }

    function frame(time) {
      const delta = lastTime
        ? Math.min((time - lastTime) / 16.67, 2)
        : 1;

      lastTime = time;

      if (statusRef.current === "playing") {
        update(delta);
      }

      drawWorld(ctx, gameRef.current, time);
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
        <span>♡ Hati: {score} / 3</span>
        <span>Level 1 — Cari Kado</span>
      </div>

      <div className="adventure__viewport">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          aria-label="Permainan kelinci pink yang berjalan, melompat, dan mengumpulkan hati"
        />

        {status === "ready" && (
          <div className="adventure__overlay">
            <span className="adventure__emoji">🐰</span>
            <h2>Petualangan Kecil Buat Kamu</h2>
            <p>
              Kumpulin 3 hati dan temuin
              kado di ujung jalan, yaa!
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
            <span className="adventure__emoji">🎁</span>
            <h2>Yeay, kamu berhasil! ♡</h2>
            <p>
              Hehe, pinter banget sayang.
              Sekarang ada sesuatu lagi buat kamu.
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={onComplete}
            >
              Buka Hadiah Terakhir ♡
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
        <div className="adventure__directions">
          <button
            type="button"
            aria-label="Jalan ke kiri"
            disabled={status !== "playing"}
            onPointerDown={event =>
              pressControl("left", event)
            }
            onPointerUp={() => releaseControl("left")}
            onPointerCancel={() => releaseControl("left")}
          >
            ←
          </button>

          <button
            type="button"
            aria-label="Jalan ke kanan"
            disabled={status !== "playing"}
            onPointerDown={event =>
              pressControl("right", event)
            }
            onPointerUp={() => releaseControl("right")}
            onPointerCancel={() => releaseControl("right")}
          >
            →
          </button>
        </div>

        <button
          type="button"
          className="adventure__jump"
          disabled={status !== "playing"}
          onPointerDown={event =>
            pressControl("jump", event)
          }
        >
          Lompat ↑
        </button>
      </div>

      <p className="adventure__hint">
        Komputer: tombol ← → dan Spasi.
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
