import type { CSSProperties } from "react";
import { contourOf } from "../data/tones";
import { tokenize } from "./Staff";

/**
 * The demo band's rule: a chart recorder. Sound arrives from the right as level ticks, passes the
 * pen (the red dot) and leaves to the left written as tone contours on the five-line staff. The pen
 * rides the pitch it is writing. It plays the hero sentence, so it needs no copy of its own, and it
 * is decoration: hidden from assistive tech, still (and complete) without script or motion.
 *
 * Everything here is static markup; styles.css moves it. Widths are real pixels, so the roll can be
 * shifted by exactly one sentence (`--tape`) and loop without a seam.
 */

/** Width of one syllable on the tape, and how fast the tape runs (px per second). */
const SLOT = 44;
const SPEED = 40;
/** The sentence is repeated this many times, enough to fill either side of the pen on a wide screen. */
const COPIES = 5;
/** Same box height as `Contour`: level 5 is y = 0, level 1 is y = 48. */
const H = 48;

const n = (v: number) => Number(v.toFixed(2));

function build(text: string, jyutping: string) {
  const tokens = tokenize(text, jyutping);
  const stops: [number, number][] = [];
  let tones = "";
  let wave = "";
  let x = 0;
  // A fixed seed: the same ticks on the server and in the browser.
  let seed = 20261121;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  tokens.forEach((tok, i) => {
    const slots =
      tok.kind === "word"
        ? Math.ceil(tok.text.length / 3)
        : tok.kind === "rest" && i === tokens.length - 1
          ? 2
          : 1;
    const width = slots * SLOT;
    if (tok.kind !== "rest") {
      // Raw audio: one swell of ticks per syllable (an English word has a few).
      const count = Math.round((width - 10) / 5.5);
      for (let k = 0; k < count; k += 1) {
        const swell = Math.abs(Math.sin(Math.PI * ((k + 0.5) / count) * slots)) ** 0.7;
        const reach = 2.5 + 18 * swell * (0.45 + 0.55 * rand());
        wave += `M${n(x + 5 + k * 5.5)} ${n(H / 2 - reach)}V${n(H / 2 + reach)}`;
      }
    }
    const c = tok.kind === "zi" && tok.jp ? contourOf(tok.jp) : null;
    if (c) {
      const x0 = x + SLOT * 0.2;
      const x1 = x + SLOT * (c.stop ? 0.5 : 0.8);
      tones += `M${n(x0)} ${n(((5 - c.from) * H) / 4)}L${n(x1)} ${n(((5 - c.to) * H) / 4)}`;
      stops.push([x0, c.from], [x1, c.to]);
    }
    x += width;
  });
  return { period: x, tones, wave, pen: penFrames(stops, x) };
}

/**
 * Keyframes for the pen over one pass of the sentence: on each stroke it is at that stroke's pitch,
 * between strokes it glides to the next. Percentages are of the staff height.
 */
function penFrames(stops: [number, number][], period: number): string {
  if (stops.length === 0) return "";
  const y = (level: number) => `{transform:translateY(${n(((5 - level) / 4) * 100)}%)}`;
  const [firstAt, firstLevel] = stops[0];
  const [lastAt, lastLevel] = stops[stops.length - 1];
  // Where the pen is as the loop turns over, part-way from the last stroke back to the first.
  const turn =
    lastLevel + ((firstLevel - lastLevel) * (period - lastAt)) / (firstAt + period - lastAt);
  return [
    `0%${y(turn)}`,
    ...stops.map(([at, level]) => `${n((at / period) * 100)}%${y(level)}`),
    `100%${y(turn)}`,
  ].join("");
}

export function Tape({ text, jyutping }: { text: string; jyutping: string }) {
  const { period, tones, wave, pen } = build(text, jyutping);
  if (!tones) return null;
  const width = period * COPIES;
  const repeats = Array.from({ length: COPIES - 1 }, (_, i) => (i + 1) * period);
  const roll = (id: string, d: string) => (
    <svg
      className="tape-roll"
      width={width}
      viewBox={`0 0 ${width} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path id={id} d={d} />
      {repeats.map((dx) => (
        <use key={dx} href={`#${id}`} x={dx} />
      ))}
    </svg>
  );
  const vars = { "--tape": `${period}px`, "--tape-time": `${n(period / SPEED)}s` } as CSSProperties;
  return (
    <div className="tape" style={vars} aria-hidden="true" data-watch>
      <style>{`@keyframes tape-pen{${pen}}`}</style>
      <div className="tape-done">{roll("tape-tones", tones)}</div>
      <div className="tape-raw">{roll("tape-wave", wave)}</div>
      <div className="tape-pen" />
    </div>
  );
}
