import type { Dict } from "../i18n";
import { DEMO_URL } from "../site";
import { Melody } from "./Staff";

export function Hero({ t }: { t: Dict }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
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
        <Melody
          text={t.hero.sample}
          jyutping={t.hero.sampleJyutping}
          caption={t.hero.sampleLabel}
        />
      </div>
    </section>
  );
}
