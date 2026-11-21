import type { Dict } from "../i18n";
import { LINKS } from "../site";

export function Asr({ t }: { t: Dict }) {
  return (
    <section id="asr" className="section" aria-labelledby="asr-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="asr-title">{t.asr.title}</h2>
          <p className="lede">{t.asr.lede}</p>
        </div>
        <ul className="models">
          {t.asr.cards.map((c) => (
            <li key={c.size} className="model">
              <p className="model-size">{c.size}</p>
              <p className="model-title">{c.title}</p>
            </li>
          ))}
        </ul>
        <div className="actions">
          <a className="btn btn-solid" href={LINKS.asrRepo} rel="noopener">
            {t.asr.ctaRepo}
          </a>
          <a className="btn btn-line" href={LINKS.hf17} rel="noopener">
            {t.asr.ctaHf}
          </a>
        </div>
      </div>
    </section>
  );
}
