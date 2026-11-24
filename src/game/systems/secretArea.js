import { PLAYER_WIDTH, PLAYER_HEIGHT } from "../constants.js";
import { SECRET_AREA } from "../levels/level1.js";

export function collectSecret(game) {
  if (game.secretFound) return false;
  const centerX = game.player.x + PLAYER_WIDTH / 2;
  const centerY = game.player.y + PLAYER_HEIGHT / 2;
  if (Math.abs(centerX - SECRET_AREA.heart.x) >= 24 || Math.abs(centerY - SECRET_AREA.heart.y) >= 30) return false;
  game.secretFound = true;
  return true;
}
