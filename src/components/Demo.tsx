import type { Dict } from "../i18n";
import { BAND_EDGE } from "../koel/colony";
import { Roost } from "../koel/Flock";
import { DEMO_URL } from "../site";
import { Tape } from "./Tape";

export function Demo({ t }: { t: Dict }) {
  return (
    <section id="demo" className="section band" aria-labelledby="demo-title">
      <Roost on="edge" birds={BAND_EDGE} />
      <Tape text={t.hero.sample} jyutping={t.hero.sampleJyutping} />
      <div className="wrap split">
        <div>
          <h2 id="demo-title">{t.demo.title}</h2>
          <p className="lede">{t.demo.body}</p>
        </div>
        <div className="demo-side">
          <a className="btn btn-solid" href={DEMO_URL} rel="noopener">
            {t.demo.cta}
          </a>
          <p className="fine">{t.demo.note}</p>
        </div>
      </div>
    </section>
  );
}
