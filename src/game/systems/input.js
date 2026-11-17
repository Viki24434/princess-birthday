
export function createControls() {
  return {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false
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
  function keyDown(event) {
    if (statusRef.current !== "playing") {
      return;
    }

    const key = event.key.toLowerCase();
    const controls = controlsRef.current;

    const supportedKeys = [
      "arrowleft",
      "arrowright",
      "arrowup",
      "arrowdown",
      "a",
      "d",
      "w",
      "s",
      " "
    ];

    if (supportedKeys.includes(key)) {
      event.preventDefault();
    }

    if (key === "arrowleft" || key === "a") {
      controls.left = true;
    }

    if (key === "arrowright" || key === "d") {
      controls.right = true;
    }

    if (key === "arrowup" || key === "w") {
      controls.up = true;
    }

    if (key === "arrowdown" || key === "s") {
      controls.down = true;
    }

    if (key === " " && !event.repeat) {
      controls.jump = true;
    }
  }

  function keyUp(event) {
    const key = event.key.toLowerCase();
    const controls = controlsRef.current;

    if (key === "arrowleft" || key === "a") {
      controls.left = false;
    }

    if (key === "arrowright" || key === "d") {
      controls.right = false;
    }

    if (key === "arrowup" || key === "w") {
      controls.up = false;
    }

    if (key === "arrowdown" || key === "s") {
      controls.down = false;
    }
  }

  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);

  // Cleanup saat komponen dilepas
  return () => {
    window.removeEventListener("keydown", keyDown);
    window.removeEventListener("keyup", keyUp);
  };
}

// ====================================
// KONTROL TOUCH / POINTER
// ====================================

export function pressControl(
  key,
  event,
  controlsRef,
  statusRef
) {
  event.preventDefault();

  if (statusRef.current !== "playing") {
    return;
  }

  event.currentTarget.setPointerCapture?.(
    event.pointerId
  );

  controlsRef.current[key] = true;
}

export function releaseControl(key, controlsRef) {
  // Tombol lompat diproses sekali
  // oleh physics agar tap cepat tetap terbaca.
  if (key === "jump") {
    return;
  }

  controlsRef.current[key] = false;
}
