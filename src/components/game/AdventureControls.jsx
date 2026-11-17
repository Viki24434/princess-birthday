
const movementButtons = [
  {
    action: "left",
    label: "Jalan ke kiri",
    text: "←"
  },
  {
    action: "right",
    label: "Jalan ke kanan",
    text: "→"
  }
];

const actionButtons = [
  {
    action: "up",
    label: "Lompat atau naik tangga",
    text: "↑"
  },
  {
    action: "down",
    label: "Turun tangga",
    text: "↓"
  },
  {
    action: "jump",
    label: "Lompat",
    text: "Lompat"
  }
];

function ControlButton({
  item,
  disabled,
  onPress,
  onRelease
}) {
  return (
    <button
      type="button"
      aria-label={item.label}
      className={
        item.action === "jump"
          ? "adventure__jump"
          : undefined
      }
      disabled={disabled}
      onPointerDown={(event) =>
        onPress(item.action, event)
      }
      onPointerUp={() =>
        onRelease(item.action)
      }
      onPointerCancel={() =>
        onRelease(item.action)
      }
      onLostPointerCapture={() =>
        onRelease(item.action)
      }
    >
      {item.text}
    </button>
  );
}

export default function AdventureControls({
  status,
  onPress,
  onRelease,
  onRestart
}) {
  const disabled = status !== "playing";

  return (
    <>
      <div className="adventure__controls">
        <div className="adventure__move">
          {movementButtons.map((item) => (
            <ControlButton
              key={item.action}
              item={item}
              disabled={disabled}
              onPress={onPress}
              onRelease={onRelease}
            />
          ))}
        </div>

        <div className="adventure__action">
          {actionButtons.map((item) => (
            <ControlButton
              key={item.action}
              item={item}
              disabled={disabled}
              onPress={onPress}
              onRelease={onRelease}
            />
          ))}
        </div>
      </div>

      <p className="adventure__hint">
        Komputer: ← → untuk jalan,
        Spasi untuk lompat,
        ↑ untuk lompat atau naik tangga,
        ↓ untuk turun tangga.
        HP: gunakan tombol di bawah permainan.
      </p>

      {status === "playing" && (
        <button
          type="button"
          className="adventure__restart"
          onClick={onRestart}
        >
          Ulang permainan
        </button>
      )}
    </>
  );
}
