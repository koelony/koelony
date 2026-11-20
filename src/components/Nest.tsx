import type { Dict } from "../i18n";

export function Nest({ t }: { t: Dict }) {
  return (
    <section id="nest" className="section" aria-labelledby="nest-title">
      <div className="container">
        <p className="kicker">{t.nest.kicker}</p>
        <h2 id="nest-title">{t.nest.title}</h2>
        <p className="lede">{t.nest.lede}</p>
        <ul className="nest-grid">
          {t.nest.items.map((it) => (
            <li key={it.title} className="card">
              <span className={`status status-${it.status}`}>{t.nest.status[it.status]}</span>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
