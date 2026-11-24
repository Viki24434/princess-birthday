import test from "node:test";
import assert from "node:assert/strict";
import { createControls, registerKeyboardControls } from "../src/game/systems/input.js";

function keyboard(status, run) {
  const previousWindow = globalThis.window;
  const surface = new EventTarget();
  globalThis.window = surface;
  const controlsRef = { current: createControls() };
  const statusRef = { current: status };
  const unregister = registerKeyboardControls(controlsRef, statusRef);
  function send(type, code, repeat = false) {
    const event = new Event(type, { cancelable: true });
    Object.defineProperties(event, { code: { value: code }, repeat: { value: repeat } });
    surface.dispatchEvent(event);
    return event;
  }
  try { run({ controls: controlsRef.current, statusRef, send, unregister }); }
  finally { unregister(); globalThis.window = previousWindow; }
}

test("arrow keys cannot scroll during ready, pause, secret messages, the ending animation, or victory", () => {
  for (const status of ["ready", "paused", "secret", "finishing", "won"]) {
    keyboard(status, ({ controls, send }) => {
      for (const code of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]) {
        assert.equal(send("keydown", code).defaultPrevented, true, `${code} scrolls during ${status}`);
        assert.equal(send("keyup", code).defaultPrevented, true);
        assert.deepEqual(controls, createControls(), "a disabled game must not move the character");
      }
    });
  }
});

test("arrows still control the player and prevent scrolling while playing", () => {
  keyboard("playing", ({ controls, send }) => {
    for (const [code, control] of [["ArrowUp", "up"], ["ArrowDown", "down"], ["ArrowLeft", "left"], ["ArrowRight", "right"]]) {
      assert.equal(send("keydown", code).defaultPrevented, true);
      assert.equal(controls[control], true);
      assert.equal(send("keyup", code).defaultPrevented, true);
      assert.equal(controls[control], false);
    }
  });
});

test("Space remains available for native button activation when the game is not playing", () => {
  for (const status of ["ready", "paused", "secret", "finishing", "won"]) {
    keyboard(status, ({ controls, send }) => {
      assert.equal(send("keydown", "Space").defaultPrevented, false);
      assert.equal(send("keyup", "Space").defaultPrevented, false);
      assert.equal(controls.jump, false);
    });
  }
});

test("Space jumps once per press during gameplay without scrolling or repeating the jump", () => {
  keyboard("playing", ({ controls, send }) => {
    assert.equal(send("keydown", "Space").defaultPrevented, true);
    assert.equal(controls.jump, true);
    controls.jump = false;
    assert.equal(send("keydown", "Space", true).defaultPrevented, true);
    assert.equal(controls.jump, false);
    assert.equal(send("keyup", "Space").defaultPrevented, true);
  });
});

test("a key released after a transition clears movement without scrolling", () => {
  keyboard("playing", ({ controls, statusRef, send }) => {
    send("keydown", "ArrowUp");
    statusRef.current = "finishing";
    assert.equal(send("keyup", "ArrowUp").defaultPrevented, true);
    assert.equal(controls.up, false);
  });
});

test("unrelated keys and pages after leaving the game retain their normal keyboard behavior", () => {
  keyboard("playing", ({ send, unregister }) => {
    for (const code of ["Enter", "Tab", "PageDown"]) assert.equal(send("keydown", code).defaultPrevented, false);
    unregister();
    assert.equal(send("keydown", "ArrowUp").defaultPrevented, false);
    assert.equal(send("keydown", "Space").defaultPrevented, false);
  });
});
