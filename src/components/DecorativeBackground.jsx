
const decorations = [
  { symbol: "♡", className: "deco--one" },
  { symbol: "✦", className: "deco--two" },
  { symbol: "✿", className: "deco--three" },
  { symbol: "♡", className: "deco--four" },
  { symbol: "✧", className: "deco--five" },
  { symbol: "✿", className: "deco--six" }
];

export default function DecorativeBackground() {
  return (
    <div
      className="decorative-background"
      aria-hidden="true"
    >
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      {decorations.map((item, index) => (
        <span
          key={index}
          className={`floating-decoration ${item.className}`}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
