import type { Dict } from "../i18n";
import { DEMO_URL } from "../site";

export function Demo({ t }: { t: Dict }) {
  return (
    <section id="demo" className="section section-ink" aria-labelledby="demo-title">
      <div className="container demo-inner">
        <p className="kicker">{t.demo.kicker}</p>
        <h2 id="demo-title">{t.demo.title}</h2>
        <p className="lede">{t.demo.body}</p>
        <ul className="ticks">
          {t.demo.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <a className="btn btn-red" href={DEMO_URL} rel="noopener">
          {t.demo.cta}
        </a>
        <p className="fine">{t.demo.note}</p>
      </div>
    </section>
  );
}
