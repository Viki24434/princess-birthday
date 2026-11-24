import { PLAYER_WIDTH, PLAYER_HEIGHT, WORLD_WIDTH } from "../constants.js";

function positionAt(platform) {
  const progress = (1 - Math.cos(platform.elapsed / platform.period * Math.PI * 2)) / 2;
  return {
    x: platform.startX + (platform.targetX - platform.startX) * progress,
    y: platform.startY + (platform.targetY - platform.startY) * progress
  };
}

export function createMovingPlatforms(templates) {
  return templates.map(template => ({
    ...template,
    startX: template.x,
    startY: template.y,
    previousX: template.x,
    previousY: template.y,
    elapsed: 0,
    dx: 0,
    dy: 0
  }));
}

export function updateMovingPlatforms(platforms, delta) {
  for (const platform of platforms) {
    platform.previousX = platform.x;
    platform.previousY = platform.y;
    platform.elapsed = (platform.elapsed + delta) % platform.period;
    Object.assign(platform, positionAt(platform));
    platform.dx = platform.x - platform.previousX;
    platform.dy = platform.y - platform.previousY;
  }
}

export function carryPlayerOnPlatform(player, platforms) {
  const support = platforms.find(platform => platform.id === player.supportingPlatformId);
  const stillStanding = support && player.onGround && !player.onLadder
    && Math.abs(player.y + PLAYER_HEIGHT - support.previousY) < 1
    && player.x + PLAYER_WIDTH > support.previousX && player.x < support.previousX + support.w;

  if (!stillStanding) {
    player.supportingPlatformId = null;
    return;
  }

  player.x = Math.max(0, Math.min(WORLD_WIDTH - PLAYER_WIDTH, player.x + support.dx));
  player.y += support.dy;
}
