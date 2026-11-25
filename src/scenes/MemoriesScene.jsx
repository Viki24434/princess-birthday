
import SceneLayout from "../components/SceneLayout";
import PolaroidCard from "../components/PolaroidCard";

export default function MemoriesScene({ memories, content }) {
  return (
    <SceneLayout
      className="memories-scene"
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
    >
      <div className="scrapbook">
        <div className="scrapbook__tape tape-left" />
        <div className="scrapbook__tape tape-right" />

        <div className="scrapbook__heading">
          <span>✿</span>

          <p>
            {content.intro}
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
          {content.hint}
        </p>
      </div>
    </SceneLayout>
  );
}
