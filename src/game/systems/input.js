
export function createControls() {
  return {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    upJumpHandled: false
  };
}

export function resetControls(controls) {
  Object.assign(controls, createControls());
}

// ====================================
// KONTROL KEYBOARD
// ====================================


export function registerKeyboardControls(
  controlsRef,
  statusRef
) {
  const keyMap = {
    ArrowLeft: "left",
    KeyA: "left",
    ArrowRight: "right",
    KeyD: "right",
    ArrowUp: "up",
    KeyW: "up",
    ArrowDown: "down",
    KeyS: "down",
    Space: "jump"
  };

  function keyDown(event) {
    const control = keyMap[event.code];

    if (!control) return;

    const playing = statusRef.current === "playing";
    // Panah tetap milik game saat jeda dan animasi akhir, meski pemain tidak bergerak.
    if (playing || event.code.startsWith("Arrow")) event.preventDefault();

    if (!playing) return;

    if (control === "jump") {
      if (!event.repeat) {
        controlsRef.current.jump = true;
      }
      return;
    }

    controlsRef.current[control] = true;
  }

  function keyUp(event) {
    const control = keyMap[event.code];

    if (!control) return;

    // Di luar gameplay, Spasi tetap bisa mengaktifkan tombol mulai/coba lagi.
    if (statusRef.current === "playing" || event.code.startsWith("Arrow")) event.preventDefault();

    if (control !== "jump") {
      controlsRef.current[control] = false;
    }
  }

  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);

  return () => {
    window.removeEventListener("keydown", keyDown);
    window.removeEventListener("keyup", keyUp);
  };
}


// ====================================
// KONTROL HP
// ====================================

export function pressControl(
  key,
  event,
  controlsRef,
  statusRef
) {
  event.preventDefault();

  if (statusRef.current !== "playing") return;

  event.currentTarget.setPointerCapture?.(
    event.pointerId
  );

  controlsRef.current[key] = true;
}

export function releaseControl(key, controlsRef) {
  if (key === "jump") return;

  controlsRef.current[key] = false;
}
