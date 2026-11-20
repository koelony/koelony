import type { Dict } from "../i18n";
import { DEMO_URL, LINKS } from "../site";

export function Hero({ t }: { t: Dict }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <p className="eyebrow">{t.hero.eyebrow}</p>
        <h1 id="hero-title">{t.hero.title}</h1>
        <p className="lede">{t.hero.lede}</p>
        <div className="cta-row">
          <a className="btn btn-primary" href={DEMO_URL} rel="noopener">
            {t.hero.ctaDemo}
          </a>
          <a className="btn btn-ghost" href={LINKS.asrRepo} rel="noopener">
            {t.hero.ctaGithub}
          </a>
        </div>
        <figure className="transcript">
          <blockquote lang="zh-Hant-HK">{t.hero.sample}</blockquote>
          <figcaption>{t.hero.sampleLabel}</figcaption>
        </figure>
      </div>
    </section>
  );
}
