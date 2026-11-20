import type { Dict } from "../i18n";
import { DEMO_URL } from "../site";

export function Demo({ t }: { t: Dict }) {
  return (
    <section id="demo" className="section band" aria-labelledby="demo-title">
      <div className="wrap split">
        <div>
          <h2 id="demo-title">{t.demo.title}</h2>
          <p className="lede">{t.demo.body}</p>
        </div>
        <div className="demo-side">
          <ul className="ruled" data-perch="demo" data-perch-edge="bottom">
            {t.demo.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <a className="btn btn-solid" href={DEMO_URL} rel="noopener">
            {t.demo.cta}
          </a>
          <p className="fine">{t.demo.note}</p>
        </div>
      </div>
    </section>
  );
}
