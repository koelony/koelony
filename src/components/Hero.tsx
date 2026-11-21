import type { Dict } from "../i18n";
import { Canopy } from "../koel/Canopy";
import { Crossing } from "../koel/Flock";
import { DEMO_URL } from "../site";
import { Melody } from "./Staff";

export function Hero({ t }: { t: Dict }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Canopy seed={7} w={720} h={560} from="right" />
      <div className="wrap">
        <h1 id="hero-title">{t.hero.title}</h1>
        <div className="hero-sub">
          <p className="lede">{t.hero.lede}</p>
          <div className="actions">
            <a className="btn btn-solid" href={DEMO_URL} rel="noopener">
              {t.hero.ctaDemo}
            </a>
          </div>
        </div>
        {/* A far flock crosses the gap between the words and the staff, again and again. */}
        <div className="hero-sky">
          <Crossing />
        </div>
        <Melody
          text={t.hero.sample}
          jyutping={t.hero.sampleJyutping}
          caption={t.hero.sampleLabel}
        />
      </div>
    </section>
  );
}
