
import SceneLayout from "../components/SceneLayout";
import PolaroidCard from "../components/PolaroidCard";

export default function MemoriesScene({ memories }) {
  return (
    <SceneLayout
      className="memories-scene"
      eyebrow="Sedikit cerita tentang kita"
      title="Cerita Kita ♡"
      description="Ada cerita kecil di balik setiap foto kita."
    >
      <div className="scrapbook">
        <div className="scrapbook__tape tape-left" />
        <div className="scrapbook__tape tape-right" />

        <div className="scrapbook__heading">
          <span>✿</span>

          <p>
            Aku nyimpen beberapa momen kita
            di sini. Mungkin sederhana,
            tapi semuanya punya cerita yang
            pengen aku inget terus.
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
          Coba klik fotonya, sayang ♡
        </p>
      </div>
    </SceneLayout>
  );
}
