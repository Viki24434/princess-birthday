
import { useEffect, useRef, useState } from "react";

import { REQUIRED_HEARTS } from "../constants";

import {
  createGame,
  respawnPlayer
} from "../engine/gameState";

import { updatePlayer } from "../engine/physics";
import { updateEnemies } from "../entities/enemies";

import {
  updateCheckpoint,
  isPlayerInVoid,
  collectHearts,
  hasHitEnemy,
  checkFlagContact
} from "../systems/progress";

import {
  beginFinishSequence,
  updateFinishSequence
} from "../systems/finishSequence";

import {
  createControls,
  resetControls,
  registerKeyboardControls,
  pressControl,
  releaseControl
} from "../systems/input";

import { loadHeadSprites } from "../assets/sprites";
import { drawWorld } from "../rendering/world";

export function useAdventureGame() {
  const canvasRef = useRef(null);
  const gameRef = useRef(createGame());
  const spritesRef = useRef({});

  const controlsRef = useRef(createControls());
  const statusRef = useRef("ready");

  const [status, setStatus] = useState("ready");
  const [score, setScore] = useState(0);
  const [notice, setNotice] = useState("");

  // ====================================
  // MULAI / ULANG GAME
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
  // KONTROL TOMBOL LAYAR
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
  // ENGINE DAN GAME LOOP
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

    function handleBlur() {
      resetControls(controlsRef.current);
    }

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

      // Animasi bendera dan menuju kastil
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

      // Gerakkan karakter
      updatePlayer(
        player,
        controlsRef.current,
        delta
      );

      // Simpan checkpoint
      updateCheckpoint(game);

      // Jatuh ke jurang
      if (isPlayerInVoid(game)) {
        respawn();
        return;
      }

      // Mengumpulkan hati
      if (collectHearts(game)) {
        setScore(game.collected.size);
        setNotice("");
      }

      // Terkena mob
      if (hasHitEnemy(game)) {
        respawn();
        return;
      }

      // Menyentuh tiang bendera
      const flagResult = checkFlagContact(game);

      if (flagResult === "finish") {
        beginFinishSequence(game);

        statusRef.current = "finishing";
        setStatus("finishing");

        resetControls(controlsRef.current);

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

    // ====================================
    // CLEANUP
    // ====================================

    return () => {
      cancelAnimationFrame(frameId);
      unregisterKeyboard();

      window.removeEventListener(
        "blur",
        handleBlur
      );

      resetControls(controlsRef.current);
      spritesRef.current = {};
    };
  }, []);

  // Data dan fungsi yang digunakan React
  return {
    canvasRef,
    status,
    score,
    notice,
    startGame,
    handlePress,
    handleRelease
  };
}
