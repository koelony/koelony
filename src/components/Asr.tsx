import type { CSSProperties } from "react";
import type { Dict } from "../i18n";
import { ASR_RULE, SIZES_RULE } from "../koel/colony";
import { Crossing, Roost } from "../koel/Flock";
import { type Locale, pagePath } from "../site";
import { Melody } from "./Staff";
import { StarButton } from "./Stars";

/**
 * A model size, set so it can be confirmed a character at a time like the hero transcript. Screen
 * readers get the plain string; the split copy is decoration.
 */
export function Size({ text, index }: { text: string; index: number }) {
  return (
    <p className="model-size" style={{ "--m": index } as CSSProperties}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {[...text].map((ch, k) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the characters of a fixed string
          <span key={k} className="ch" style={{ "--k": k } as CSSProperties}>
            {ch}
          </span>
        ))}
      </span>
    </p>
  );
}

export function Asr({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <section id="asr" className="section" aria-labelledby="asr-title" data-watch>
      <Roost on="rule" birds={ASR_RULE} />
      <Crossing />
      <div className="wrap">
        <div className="section-head">
          <h2 id="asr-title" className="keep-words">
            {t.asr.title}
          </h2>
          <p className="lede">{t.asr.lede}</p>
        </div>
        {/* What the model writes: a code-switched sentence on its tone staff, flown by the koel. */}
        <Melody
          text={t.hero.sample}
          jyutping={t.hero.sampleJyutping}
          caption={t.hero.sampleLabel}
        />
        <ul className="models" data-watch>
          {t.asr.cards.map((c, i) => (
            <li key={c.size} className="model">
              {i === 0 && <Roost on="rule" birds={SIZES_RULE} />}
              <Size text={c.size} index={i} />
              <p className="model-title">{c.title}</p>
            </li>
          ))}
        </ul>
        <div className="actions">
          <StarButton t={t} />
          <a className="more" href={pagePath(locale, "asr")}>
            {t.asr.more}
          </a>
        </div>
      </div>
    </section>
  );
}
