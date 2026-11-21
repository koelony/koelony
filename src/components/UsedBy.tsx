import type { Dict } from "../i18n";
import { Canopy } from "../koel/Canopy";
import { USED_BY_RULE } from "../koel/colony";
import { Roost } from "../koel/Flock";
import { LINKS } from "../site";

export function UsedBy({ t }: { t: Dict }) {
  return (
    <section className="section section-tight" aria-labelledby="usedby-title" data-watch>
      <Roost on="rule" birds={USED_BY_RULE} />
      <Canopy
        seed={42}
        w={600}
        h={360}
        from="left"
        className="canopy-oratype"
        birds={[{ on: 2, act: "turn nod", every: 5, wait: 0.5 }]}
      />
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
