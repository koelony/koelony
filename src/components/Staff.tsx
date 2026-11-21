import { type CSSProperties, Fragment } from "react";
import { contourOf } from "../data/tones";
import { HERO } from "../koel/colony";
import { Roost } from "../koel/Flock";

/** Height of one tone level inside the 40 x 48 contour box: level 5 is the top line, 1 the bottom. */
const levelY = (level: number) => ((5 - level) * 48) / 4;

/**
 * A pitch contour on the five-line staff, for one syllable. The lines themselves are a CSS
 * background on `.contour`, so neighbouring syllables join into one continuous staff.
 */
export function Contour({ strokes, stop }: { strokes?: [number, number][]; stop?: boolean }) {
  const count = strokes?.length ?? 0;
  return (
    <svg className="contour" viewBox="0 0 40 48" preserveAspectRatio="none" aria-hidden="true">
      {strokes?.map(([from, to], i) => {
        // Several strokes share the box left to right (the koel's two notes); a stopped syllable is cut short.
        const x0 = count > 1 ? 6 + (i * 28) / count : 8;
        const x1 = count > 1 ? 6 + ((i + 1) * 28) / count - 3 : stop ? 20 : 32;
        return (
          <line
            // biome-ignore lint/suspicious/noArrayIndexKey: strokes are a fixed, ordered tuple list
            key={i}
            x1={x0}
            y1={levelY(from)}
            x2={x1}
            y2={levelY(to)}
          />
        );
      })}
    </svg>
  );
}

export type Token =
  | { kind: "zi"; text: string; jp?: string }
  | { kind: "word"; text: string }
  | { kind: "rest"; text: string };

/** Position along the staff, for the order its lines rule themselves in (`--i` in styles.css). */
const nth = (i: number) => ({ "--i": i }) as CSSProperties;

/** Splits a code-switched sentence into Chinese characters, Latin words and punctuation. */
export function tokenize(text: string, jyutping: string): Token[] {
  const syllables = jyutping.trim().split(/\s+/);
  const han = text.match(/\p{Script=Han}/gu) ?? [];
  // Annotations are only trustworthy if there is exactly one per character.
  const annotate = han.length === syllables.length;
  const tokens: Token[] = [];
  let n = 0;
  for (const part of text.match(/\p{Script=Han}|[\p{L}\p{N}'’-]+|[^\s\p{L}\p{N}]+/gu) ?? []) {
    if (/\p{Script=Han}/u.test(part)) {
      tokens.push({ kind: "zi", text: part, jp: annotate ? syllables[n] : undefined });
      n += 1;
    } else if (/[\p{L}\p{N}]/u.test(part)) tokens.push({ kind: "word", text: part });
    else tokens.push({ kind: "rest", text: part });
  }
  return tokens;
}

/**
 * The hero transcript: a Hong Kong Cantonese sentence set on a tone staff, each character under its
 * pitch contour and Jyutping, with the English words left in English and off the staff's tones.
 * Everything is in the markup and visible; the koel only confirms the syllables as it flies them.
 */
export function Melody({
  text,
  jyutping,
  caption,
}: {
  text: string;
  jyutping: string;
  caption: string;
}) {
  const tokens = tokenize(text, jyutping);
  // On wide screens the sentence breaks at its first pause instead of wherever the row runs out.
  const pause = tokens.findIndex((tok) => tok.kind === "rest");
  return (
    <figure className="melody" data-melody data-watch>
      <blockquote className="staff" lang="zh-Hant-HK" data-perch="hero">
        {tokens.map((tok, i) => {
          const key = `${i}${tok.text}`;
          if (tok.kind === "zi") {
            const c = tok.jp ? contourOf(tok.jp) : null;
            return (
              <ruby
                key={key}
                className="note"
                style={nth(i)}
                data-note="zi"
                data-from={c?.from}
                data-to={c?.to}
                data-stop={c?.stop ? "" : undefined}
              >
                <Contour strokes={c ? [[c.from, c.to]] : undefined} stop={c?.stop} />
                <span className="zi">{tok.text}</span>
                {tok.jp && <rt>{tok.jp}</rt>}
              </ruby>
            );
          }
          return (
            <Fragment key={key}>
              <span className={`note note-${tok.kind}`} style={nth(i)} data-note={tok.kind}>
                <Contour />
                <span className="zi" lang={tok.kind === "word" ? "en" : undefined}>
                  {tok.text}
                </span>
              </span>
              {i === pause && i < tokens.length - 1 && (
                <>
                  <span className="staff-fill staff-fill-mid" style={nth(i + 1)} />
                  <span className="staff-break" />
                </>
              )}
            </Fragment>
          );
        })}
        {/* The free end of the last row: where the colony lands once the koel has called. */}
        <span className="staff-fill staff-end" style={nth(tokens.length)}>
          <Roost on="late" birds={HERO} />
        </span>
      </blockquote>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
