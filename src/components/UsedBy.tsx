import type { Dict } from "../i18n";
import { LINKS } from "../site";

export function UsedBy({ t }: { t: Dict }) {
  return (
    <section className="section section-tight" aria-labelledby="usedby-title">
      <div className="container used-by">
        <div>
          <p className="kicker">{t.usedBy.kicker}</p>
          <h2 id="usedby-title">{t.usedBy.title}</h2>
          <p>{t.usedBy.body}</p>
        </div>
        <a className="btn btn-ghost" href={LINKS.oratype} rel="noopener">
          {t.usedBy.cta}
        </a>
      </div>
    </section>
  );
}
