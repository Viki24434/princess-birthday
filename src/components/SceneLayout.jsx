
export default function SceneLayout({
  eyebrow,
  title,
  description,
  children,
  className = ""
}) {
  return (
    <section className={`scene ${className}`}>
      <div className="scene__inner">
        <header className="scene__header">
          {eyebrow && (
            <span className="scene__eyebrow">
              ✦ {eyebrow} ✦
            </span>
          )}

          {title && (
            <h1 className="scene__title">
              {title}
            </h1>
          )}

          {description && (
            <p className="scene__description">
              {description}
            </p>
          )}
        </header>

        <div className="scene__content">
          {children}
        </div>
      </div>
    </section>
  );
}
