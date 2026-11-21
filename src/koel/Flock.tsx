import { type CSSProperties, Fragment } from "react";
import { FLYING, LITTLE } from "./art";

/**
 * The colony: little koels that stand on the page's lines. The one in the hero flies the sentence
 * and calls; these are the birds that come to it.
 *
 * They are the same drawing as the big one (koel/art.tsx), at about a quarter of its size, and all
 * of it is static markup that styles.css places and moves ("The colony" there): each bird lands
 * when the reader reaches its line and idles only while it is on screen. No script is involved, so
 * the prerendered page already has every bird where it belongs, and with reduced motion or without
 * JavaScript they simply stand there.
 *
 * They are decoration and say nothing: every container is `aria-hidden` and takes no pointer events.
 */

/** The drawing, once per page: every bird is a few `<use>`s of these. */
export function KoelSprite() {
  const { eye, flyEye } = LITTLE;
  const { x, y } = FLYING.shoulder;
  return (
    <svg className="koel-sprite" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <path id="k-b" transform={LITTLE.perch} d={LITTLE.body} />
        {LITTLE.beak && <path id="k-k" transform={LITTLE.perch} d={LITTLE.beak} />}
        {eye && (
          <circle
            id="k-e"
            className="k-eye"
            transform={LITTLE.perch}
            cx={eye.cx}
            cy={eye.cy}
            r={eye.r}
          />
        )}
        <path id="k-f" d={FLYING.body} />
        <path id="k-w" d={FLYING.wing} />
        <g id="k-wf" transform={`translate(26 -2) rotate(16 ${x} ${y})`}>
          <path d={FLYING.wing} />
        </g>
        <circle id="k-fe" className="k-eye" cx={flyEye.cx} cy={flyEye.cy} r={flyEye.r} />
      </defs>
    </svg>
  );
}

export type BirdSpec = {
  /** Where its feet are along the line: any CSS length or percentage (`em` is one bird). */
  x: string;
  /** Which line of its staff, counted down from the top one. 0 is the rule itself. */
  line?: number;
  /** 1 faces right like the drawing, -1 faces left. */
  face?: 1 | -1;
  /** Size, as a multiple of `--bird`. */
  size?: number;
  /** How it holds itself, in degrees: negative stands tall, positive leans forward. */
  lean?: number;
  /** Where its beak points, in degrees: negative is up. */
  look?: number;
  /**
   * What it does while it is on screen: `tilt`, `peck`, `hop`, `turn`, `patrol` or `flit` (one of
   * them), and `nod`, which moves only the head and so can be added to any other ("hop nod").
   * `flit` takes off, flies `reach` along its line, lands, turns round and flies back.
   * Every bird also breathes (a small bob) the whole time it is on screen, so none stands dead still.
   */
  act?: string;
  /** Seconds one round of that takes, and how far into it this bird starts (0 to 1). */
  every?: number;
  phase?: number;
  /** Seconds it waits, after its line is reached, before it comes in to land. */
  wait?: number;
  /** -1: it flies in tail first, from the side it will be facing, and turns round as it lands. */
  from?: 1 | -1;
  /** How far a `flit` goes, as a CSS length (`em` is one bird). */
  reach?: string;
  /** Left out where there is no room for all of them (`.bird-wide` in styles.css). */
  wide?: boolean;
  /** Only on wide desktop screens (`.bird-xl`): the header's birds, which need the gap by the logo. */
  xl?: boolean;
};

/**
 * Over the demo band's edge a bird is two stacked layers, like the big koel: the silhouette blended
 * by difference (black on the page, white where its tail hangs into the band) and the eye on top.
 */
type Layer = "ink" | "eye";

const n = (v: number) => Number(v.toFixed(2));

/** A steady number from 0 to 1 for a bird, so server and browser give it the same breath. */
const seed = (s: string) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 1000) / 1000;
};

function vars(spec: BirdSpec, extra?: Record<string, string | number>): CSSProperties {
  const every = spec.every ?? 9;
  const v: Record<string, string | number> = { "--x": spec.x, ...extra };
  if (spec.line) v["--l"] = spec.line;
  if (spec.face === -1) v["--f"] = -1;
  if (spec.from === -1) v["--u"] = -1;
  if (spec.size && spec.size !== 1) v["--s"] = spec.size;
  if (spec.lean) v["--r"] = `${spec.lean}deg`;
  if (spec.look) v["--n"] = `${spec.look}deg`;
  if (spec.act) {
    v["--p"] = `${every}s`;
    if (spec.phase) v["--d"] = `${n(-every * spec.phase)}s`;
  }
  if (spec.wait) v["--k"] = `${spec.wait}s`;
  if (spec.reach) v["--fd"] = spec.reach;
  // Each breathes at its own pace, 1.7 to 2.7 s, and out of step with its neighbours.
  const r = seed(`${spec.x}${spec.line ?? 0}${spec.act ?? ""}`);
  v["--bp"] = `${n(1.7 + r)}s`;
  v["--bd"] = `${n(-r * 2.7)}s`;
  return v as CSSProperties;
}

function Flying({ layer }: { layer?: Layer }) {
  return (
    <g className="b-fly" transform={LITTLE.fly}>
      {layer !== "eye" && (
        <>
          <use className="k-wing k-wing-far" href="#k-wf" />
          <use href="#k-f" />
          <use className="k-wing" href="#k-w" />
        </>
      )}
      {layer !== "ink" && <use href="#k-fe" />}
    </g>
  );
}

export function Bird({ layer, ...spec }: BirdSpec & { layer?: Layer }) {
  const name = ["bird", spec.wide && "bird-wide", spec.xl && "bird-xl", layer && `bird-${layer}`]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={name} data-act={spec.act} style={vars(spec)}>
      <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false">
        <Flying layer={layer} />
        <g className="b-perch">
          {layer !== "eye" && <use href="#k-b" />}
          <g className={LITTLE.beak ? "b-head" : undefined}>
            {layer !== "eye" && LITTLE.beak && <use href="#k-k" />}
            {layer !== "ink" && LITTLE.eye && <use href="#k-e" />}
          </g>
        </g>
      </svg>
    </span>
  );
}

/**
 * A line with birds on it. `on` says which line (styles.css puts the roost on it):
 * `rule` the rule its parent hangs from (a section, or the first of the model sizes), `edge` the top
 * edge of the demo band, `staff` a five-line staff it is inside, `late` the end of the hero staff,
 * where they come only after the big koel has called, `floor` the bottom line of its parent (the
 * header's rule, so a few birds stay with the reader all the way down).
 */
export function Roost({
  on,
  birds,
}: {
  on: "rule" | "edge" | "staff" | "late" | "floor" | "bough";
  birds: BirdSpec[];
}) {
  return (
    <span
      className={`roost roost-${on}`}
      aria-hidden="true"
      // The hero's birds wait for the koel and the closing staff's for the footer (it is the last
      // thing on the page, where a tall window never counts a thin strip as reached).
      data-watch={on === "rule" || on === "edge" || on === "floor" || on === "bough" || undefined}
    >
      {birds.map((b) =>
        on === "edge" ? (
          // Two layers each, see `Layer`.
          <Fragment key={b.x}>
            <Bird {...b} layer="ink" />
            <Bird {...b} layer="eye" />
          </Fragment>
        ) : (
          <Bird key={b.x} {...b} />
        ),
      )}
    </span>
  );
}

/** A few birds a long way off, crossing the gap above a section each time the reader comes to it. */
const CROSSING: { x: string; y: string; size: number; wait: number; wide?: boolean }[] = [
  { x: "66%", y: "56%", size: 0.74, wait: 0 },
  { x: "60.5%", y: "36%", size: 0.62, wait: 0.36 },
  { x: "58%", y: "78%", size: 0.66, wait: 0.52 },
  { x: "52%", y: "54%", size: 0.54, wait: 0.98, wide: true },
  { x: "47.5%", y: "30%", size: 0.58, wait: 1.34, wide: true },
];

export function Crossing() {
  return (
    <span className="flock" aria-hidden="true" data-watch>
      {CROSSING.map((b) => (
        <span
          key={b.x}
          className={`bird bird-far${b.wide ? " bird-wide" : ""}`}
          style={vars({ x: b.x, size: b.size, wait: b.wait }, { "--y": b.y })}
        >
          <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false">
            <Flying />
          </svg>
        </span>
      ))}
    </span>
  );
}
