import type { Dict } from "../i18n";
import { LINKS } from "../site";

export function UsedBy({ t }: { t: Dict }) {
  return (
    <section className="section section-tight" aria-labelledby="usedby-title">
      <div className="wrap split">
        <h2 id="usedby-title">{t.usedBy.title}</h2>
        <div>
          <p className="lede">{t.usedBy.body}</p>
          <a className="btn btn-line" href={LINKS.oratype} rel="noopener">
            {t.usedBy.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
