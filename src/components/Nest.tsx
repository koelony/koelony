import type { Dict } from "../i18n";

export function Nest({ t }: { t: Dict }) {
  return (
    <section id="nest" className="section" aria-labelledby="nest-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="nest-title">{t.nest.title}</h2>
          <p className="lede">{t.nest.lede}</p>
        </div>
        <ul className="roadmap">
          {t.nest.items.map((it) => (
            <li key={it.title}>
              <h3>{it.title}</h3>
              <p className={`status status-${it.status}`}>{t.nest.status[it.status]}</p>
              <p className="roadmap-body">{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
