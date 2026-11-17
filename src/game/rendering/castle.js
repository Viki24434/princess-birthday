
export function drawCastle(ctx) {
  const castleX = 2860;

  ctx.save();

  // Bangunan utama
  ctx.fillStyle = "#F3D8E5";
  ctx.fillRect(castleX, 170, 180, 160);

  // Menara kiri dan kanan
  ctx.fillStyle = "#E0B8CA";
  ctx.fillRect(castleX + 7, 125, 37, 70);
  ctx.fillRect(castleX + 136, 125, 37, 70);

  // Menara tengah
  ctx.fillRect(castleX + 68, 88, 45, 100);

  // Atap menara
  ctx.fillStyle = "#B96A8D";

  const towers = [
    [castleX + 25, 102, 27],
    [castleX + 90, 60, 34],
    [castleX + 154, 102, 27]
  ];

  towers.forEach(([x, y, size]) => {
    ctx.beginPath();
    ctx.moveTo(x - size, y + 25);
    ctx.lineTo(x, y - 14);
    ctx.lineTo(x + size, y + 25);
    ctx.closePath();
    ctx.fill();
  });

  // Pintu kastil
  ctx.fillStyle = "#9B6582";
  ctx.beginPath();

  ctx.roundRect(
    castleX + 70,
    260,
    44,
    70,
    [22, 22, 0, 0]
  );

  ctx.fill();

  // Jendela
  ctx.fillStyle = "#FFF8DC";
  ctx.fillRect(castleX + 24, 213, 20, 28);
  ctx.fillRect(castleX + 136, 213, 20, 28);

  // Balkon tempat pasangan menunggu
  ctx.fillStyle = "#C98BA9";
  ctx.fillRect(castleX + 50, 170, 92, 10);

  ctx.restore();
}
