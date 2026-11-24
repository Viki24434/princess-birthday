
const directionButtons = [
  {
    action: "left",
    label: "Jalan ke kiri",
    text: "←"
  },
  {
    action: "right",
    label: "Jalan ke kanan",
    text: "→"
  },
  {
    action: "up",
    label: "Lompat atau naik tangga",
    text: "↑"
  },
  {
    action: "down",
    label: "Turun tangga",
    text: "↓"
  }
];

const jumpButton = {
  action: "jump",
  label: "Lompat",
  text: "Lompat"
};

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
      className={`adventure__control-button adventure__control-button--${item.action}`}
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
      {item.action === "jump" && (
        <span className="adventure__jump-icon" aria-hidden="true">↑</span>
      )}
      <span>{item.text}</span>
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
        <div className="adventure__control-group">
          <span className="adventure__control-label" aria-hidden="true">Jalan & tangga</span>
          <div className="adventure__direction-pad" role="group" aria-label="Kontrol arah dan tangga">
            {directionButtons.map((item) => (
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

        <div className="adventure__control-group adventure__control-group--jump" role="group" aria-label="Kontrol lompat">
          <span className="adventure__control-label" aria-hidden="true">Lompat</span>
          <ControlButton
            item={jumpButton}
            disabled={disabled}
            onPress={onPress}
            onRelease={onRelease}
          />
        </div>
      </div>

      <p className="adventure__hint">
        <span className="adventure__hint-keyboard">Komputer: ← → untuk jalan,
        Spasi untuk lompat,
        ↑ untuk lompat atau naik tangga,
        ↓ untuk turun tangga.</span>
        <span className="adventure__hint-touch">Tahan ← atau → untuk jalan, lalu ketuk Lompat dengan jari lainnya. Gunakan ↑ ↓ saat di tangga.</span>
        <span className="adventure__mob-guide">
          <span className="adventure__mob-guide--slime">● Hijau: injak dari atas</span>
          <span className="adventure__mob-guide--spiked">▲ Berduri: hindari</span>
        </span>
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
