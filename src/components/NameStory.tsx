import type { ReactNode } from "react";
import { KOEL_CALL, RUBY, TONES } from "../data/tones";
import type { Dict } from "../i18n";
import { Contour } from "./Staff";

/** Sets Jyutping over the words in `RUBY` wherever they occur in a heading. */
function annotate(text: string): ReactNode[] {
  const words = Object.keys(RUBY);
  if (words.length === 0) return [text];
  return text.split(new RegExp(`(${words.join("|")})`)).map((part, i) => {
    const jp = RUBY[part];
    if (!jp) return part;
    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: parts of one fixed string, never reordered
      <span key={i} className="ruby-word">
        {[...part].map((zi, n) => (
          <ruby key={zi}>
            {zi}
            <rt>{jp[n]}</rt>
          </ruby>
        ))}
      </span>
    );
  });
}

export function NameStory({ t }: { t: Dict }) {
  return (
    <section id="name" className="section" aria-labelledby="name-title">
      <div className="wrap">
        <h2 id="name-title" className="name-title">
          {annotate(t.name.title)}
        </h2>
        <div className="name-body">
          {t.name.body.map((p) => (
            <p key={p} className="lede">
              {p}
            </p>
          ))}
        </div>
        <figure className="tones">
          <div className="staff tones-staff" data-perch="tones">
            {TONES.map((tone) => (
              <ruby key={tone.n} className="note" lang="zh-Hant-HK">
                <Contour strokes={[[tone.from, tone.to]]} />
                <span className="zi">{tone.zi}</span>
                <rt>{tone.jp}</rt>
                <span className="chao" aria-hidden="true">
                  {tone.chao}
                </span>
              </ruby>
            ))}
            <span className="note note-call">
              <Contour strokes={KOEL_CALL} />
              <span className="zi">{t.koel.call}</span>
            </span>
          </div>
          <figcaption>{t.name.tonesCaption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
