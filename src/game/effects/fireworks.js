import { playGameSound } from "../audio/gameAudio";

const FIREWORK_COLORS = [
  "#FF8AB6",
  "#FFD166",
  "#A9D8FF",
  "#E3B6FF",
  "#FFFFFF",
  "#FFB7A5"
];

// Membuat satu ledakan kembang api
export function spawnFirework(particles, x, y) {
  const count = 28;

  const color =
    FIREWORK_COLORS[
      Math.floor(Math.random() * FIREWORK_COLORS.length)
    ];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 1.2 + Math.random() * 2;

    const life = 45 + Math.random() * 25;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,

      life,
      maxLife: life,

      radius: 1.5 + Math.random() * 2,
      color
    });

    playGameSound("firework");
  }
}

// Menggerakkan seluruh partikel
export function updateFireworks(particles, delta) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];

    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;

    // Gravitasi kecil untuk efek jatuh
    particle.vy += 0.025 * delta;

    // Sedikit perlambatan
    particle.vx *= Math.pow(0.99, delta);

    particle.life -= delta;

    if (particle.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Menggambar partikel
export function drawFireworks(ctx, particles) {
  ctx.save();

  for (const particle of particles) {
    const opacity = Math.max(
      0,
      particle.life / particle.maxLife
    );

    ctx.globalAlpha = opacity;
    ctx.fillStyle = particle.color;

    ctx.beginPath();

    ctx.arc(
      particle.x,
      particle.y,
      particle.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.restore();
}
