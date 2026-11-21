import type { Dict } from "../i18n";
import { Canopy } from "../koel/Canopy";
import { Crossing } from "../koel/Flock";
import { DEMO_URL } from "../site";
import { Logo } from "./Logo";

/**
 * The team first: the Koelony lockup, large, then what we stand for, who we are, and the one thing
 * to try. The model itself (and the transcript the koel flies) is shown in the ASR section below.
 */
export function Hero({ t }: { t: Dict }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Canopy seed={7} w={720} h={560} from="right" />
      <div className="wrap">
        <h1 id="hero-title" className="hero-title">
          <span className="hero-brand">
            <Logo height="var(--hero-logo)" />
          </span>
          <span className="hero-tag keep-words">{t.hero.title}</span>
        </h1>
        <div className="hero-sub">
          <p className="lede">{t.hero.lede}</p>
          <div className="actions">
            <a className="btn btn-solid" href={DEMO_URL} rel="noopener">
              {t.hero.ctaDemo}
            </a>
          </div>
        </div>
        {/* A far flock crosses the sky below, again and again. */}
        <div className="hero-sky">
          <Crossing />
        </div>
      </div>
    </section>
  );
}
