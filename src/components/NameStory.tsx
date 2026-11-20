import type { Dict } from "../i18n";

export function NameStory({ t }: { t: Dict }) {
  return (
    <section id="name" className="section" aria-labelledby="name-title">
      <div className="container name-story">
        <p className="kicker">{t.name.kicker}</p>
        <h2 id="name-title">{t.name.title}</h2>
        {t.name.body.map((p) => (
          <p key={p} className="lede">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
