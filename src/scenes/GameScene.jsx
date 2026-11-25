import { useMemo } from "react";
import SceneLayout from "../components/SceneLayout";
import HeartAdventure from "../components/game/HeartAdventure";
import { REQUIRED_HEARTS } from "../game/constants";
import { formatContent } from "../utils/customContent";

export default function GameScene({ content, onComplete, onSkip }) {
  const game = useMemo(() => formatContent(content, { hearts: REQUIRED_HEARTS }), [content]);
  const scene = game.scene;
  return (
    <SceneLayout
      className="game-scene"
      eyebrow={scene.eyebrow}
      title={scene.title}
      description={scene.description}
    >
      <div className="game-scene__choice">
        <p>{scene.choiceMessage}</p>
        <button type="button" className="btn btn--secondary" onClick={onSkip}>
          {scene.skipButton}
        </button>
      </div>

      <HeartAdventure content={game} onComplete={onComplete} />

      <div className="game-scene__message">
        <p>
          {scene.footerMessage}
        </p>
      </div>
    </SceneLayout>
  );
}
