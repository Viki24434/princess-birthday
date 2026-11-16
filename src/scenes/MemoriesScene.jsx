
import SceneLayout from "../components/SceneLayout";
import PolaroidCard from "../components/PolaroidCard";

export default function MemoriesScene({ memories }) {
  return (
    <SceneLayout
      className="memories-scene"
      eyebrow="Our beautiful moments"
      title="Our Little Story"
      description="Every picture holds a piece of our story."
    >
      <div className="scrapbook">
        <div className="scrapbook__tape tape-left" />
        <div className="scrapbook__tape tape-right" />

        <div className="scrapbook__heading">
          <span>✿</span>
          <p>
            A collection of moments that
            will always have a special place
            in my heart.
          </p>
          <span>✿</span>
        </div>

        <div className="polaroid-grid">
          {memories.map(memory => (
            <PolaroidCard
              key={memory.id}
              memory={memory}
            />
          ))}
        </div>

        <p className="scrapbook__footer">
          Tap the photos to discover our stories ♡
        </p>
      </div>
    </SceneLayout>
  );
}
