import type { CSSProperties } from "react";
import type { Dict } from "../i18n";
import { type Locale, pagePath } from "../site";
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
      <div className="wrap">
        <div className="section-head">
          <h2 id="asr-title">{t.asr.title}</h2>
          <p className="lede">{t.asr.lede}</p>
        </div>
        <ul className="models" data-watch>
          {t.asr.cards.map((c, i) => (
            <li key={c.size} className="model">
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
