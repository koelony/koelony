import type { CSSProperties } from "react";
import { type BirdSpec, Roost } from "./Flock";

/**
 * A banyan bough behind the page: where the koel actually lives in Hong Kong, high in fruiting
 * figs (榕樹), heard far more than seen. One tapering limb grows in from the edge of the sheet,
 * with side branches, lens-shaped leaves made of two arcs (the logo's own construction), a few red
 * figs, and the aerial roots that hang from every old banyan in the city.
 *
 * It is drawn a shade off the paper (`--bough`, `--leaf`), so it is felt more than read, and it is
 * generated from a seed, so the server and the browser draw the same tree. Leaf clusters and roots
 * sway while the bough is on screen; a few little koels perch on the side branches (not on phones,
 * where the bough lies under the text).
 * Decoration only: aria-hidden, no pointer events, still under reduced motion.
 */

type Pt = { x: number; y: number };

const n = (v: number) => Math.round(v * 10) / 10;

function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const bez = (p: Pt[], t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * u * p[0].x + 3 * u * u * t * p[1].x + 3 * u * t * t * p[2].x + t * t * t * p[3].x,
    y: u * u * u * p[0].y + 3 * u * u * t * p[1].y + 3 * u * t * t * p[2].y + t * t * t * p[3].y,
  };
};
const tangent = (p: Pt[], t: number): Pt => {
  const a = bez(p, Math.max(0, t - 0.01));
  const b = bez(p, Math.min(1, t + 0.01));
  const l = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: (b.x - a.x) / l, y: (b.y - a.y) / l };
};

/** A limb as one filled outline: the curve, thick at its base and thin at its tip, tip rounded. */
function limb(p: Pt[], w0: number, w1: number): string {
  const steps = 22;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const c = bez(p, t);
    const d = tangent(p, t);
    const w = (w0 + (w1 - w0) * t ** 0.8) / 2;
    left.push({ x: c.x - d.y * w, y: c.y + d.x * w });
    right.push({ x: c.x + d.y * w, y: c.y - d.x * w });
  }
  const tip = w1 / 2;
  const pts = left.map((q) => `${n(q.x)} ${n(q.y)}`);
  const back = right.reverse().map((q) => `${n(q.x)} ${n(q.y)}`);
  return `M${pts.join("L")}A${n(tip)} ${n(tip)} 0 0 1 ${back.join("L")}Z`;
}

/** A banyan leaf: a lens of two arcs from the stalk, `len` long, pointing along `a` radians. */
function leaf(at: Pt, a: number, len: number): string {
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const s = { x: at.x + ux * 3, y: at.y + uy * 3 };
  const e = { x: s.x + ux * len, y: s.y + uy * len };
  const h = len * 0.24;
  const r = (len * len) / 4 / (2 * h) + h / 2;
  return `M${n(s.x)} ${n(s.y)}A${n(r)} ${n(r)} 0 0 1 ${n(e.x)} ${n(e.y)}A${n(r)} ${n(r)} 0 0 1 ${n(s.x)} ${n(s.y)}Z`;
}

type Cluster = { at: Pt; leaves: string[]; figs: Pt[] };
type Root = { d: string; top: Pt };

function grow(seed: number, w: number, h: number, from: "left" | "right") {
  const rand = rng(seed);
  const r = (a: number, b: number) => a + (b - a) * rand();
  const flip = (q: Pt): Pt => (from === "right" ? q : { x: w - q.x, y: q.y });
  const y0 = h * r(0.16, 0.3);
  const main: Pt[] = [
    { x: w + 40, y: y0 },
    { x: w * 0.72, y: y0 - h * r(0.06, 0.14) },
    { x: w * 0.42, y: y0 + h * r(0.16, 0.26) },
    { x: w * r(0.06, 0.16), y: y0 + h * r(0.1, 0.2) },
  ].map(flip);

  const limbs: string[] = [limb(main, 30, 6)];
  const clusters: Cluster[] = [];
  const roots: Root[] = [];
  const perches: { at: Pt; face: 1 | -1 }[] = [];

  const addCluster = (at: Pt, dir: number, count: number) => {
    const leaves: string[] = [];
    for (let i = 0; i < count; i += 1) {
      // Leaves fan out from the twig and droop a little under their own weight.
      const a = dir + r(-1.2, 1.2) + 0.35;
      const off = { x: at.x + r(-6, 6), y: at.y + r(-5, 5) };
      leaves.push(leaf(off, a, r(15, 27)));
    }
    const figs: Pt[] = [];
    const nf = rand() < 0.55 ? Math.floor(r(1, 3.6)) : 0;
    for (let i = 0; i < nf; i += 1) figs.push({ x: at.x + r(-12, 12), y: at.y + r(-4, 14) });
    clusters.push({ at, leaves, figs });
  };

  // Side branches, alternately up and down the limb, each ending in leaves.
  const sides = Math.floor(r(4, 6.99));
  for (let i = 0; i < sides; i += 1) {
    const t = 0.22 + (0.68 * (i + r(0.1, 0.8))) / sides;
    const base = bez(main, t);
    const d = tangent(main, t);
    const up = i % 2 === 0 ? -1 : 1;
    const ang = Math.atan2(d.y, d.x) + up * r(0.45, 0.95);
    const len = r(0.2, 0.34) * Math.min(w, h * 1.6);
    const end = { x: base.x + Math.cos(ang) * len, y: base.y + Math.sin(ang) * len + r(4, 26) };
    const ctl: Pt[] = [
      base,
      { x: base.x + Math.cos(ang) * len * 0.35, y: base.y + Math.sin(ang) * len * 0.35 },
      { x: base.x + Math.cos(ang) * len * 0.7, y: base.y + Math.sin(ang) * len * 0.7 + 12 },
      end,
    ];
    const wBase = 30 + (6 - 30) * t ** 0.8;
    limbs.push(limb(ctl, wBase * 0.55, 2.5));
    for (const tt of [0.55, 0.78, 1]) {
      const q = bez(ctl, tt);
      addCluster(q, Math.atan2(end.y - base.y, end.x - base.x), tt === 1 ? 7 : 4);
    }
    // A bird can stand on the top of a side branch that does not climb too steeply.
    const mid = bez(ctl, 0.32);
    const dm = tangent(ctl, 0.32);
    if (Math.abs(dm.y) < 0.6) {
      const wm = (wBase * 0.55 + (2.5 - wBase * 0.55) * 0.32 ** 0.8) / 2;
      perches.push({
        at: { x: mid.x + dm.y * wm, y: mid.y - Math.abs(dm.x) * wm },
        face: dm.x > 0 ? 1 : -1,
      });
    }
  }
  addCluster(bez(main, 1), Math.atan2(tangent(main, 1).y, tangent(main, 1).x), 9);
  addCluster(bez(main, 0.9), Math.PI / 2, 5);

  // Aerial roots hang from the underside of the limb, some splitting in two near the bottom.
  const nr = Math.floor(r(3, 5.99));
  for (let i = 0; i < nr; i += 1) {
    const t = 0.12 + (0.7 * (i + r(0.1, 0.9))) / nr;
    const c = bez(main, t);
    const wl = (30 + (6 - 30) * t ** 0.8) / 2;
    const top = { x: c.x, y: c.y + wl * 0.6 };
    const len = Math.min(h - top.y - 4, r(90, 300));
    if (len < 40) continue;
    const sway = r(-14, 14);
    roots.push({
      top,
      d: `M${n(top.x)} ${n(top.y)}Q${n(top.x + sway)} ${n(top.y + len * 0.55)} ${n(top.x + sway * 0.4)} ${n(top.y + len)}`,
    });
    if (rand() < 0.5) {
      const split = top.y + len * r(0.45, 0.7);
      roots.push({
        top,
        d: `M${n(top.x + sway * 0.5)} ${n(split)}Q${n(top.x + sway + r(4, 10))} ${n(split + len * 0.25)} ${n(top.x + sway * 0.6 + r(8, 16))} ${n(top.y + len * r(0.8, 0.95))}`,
      });
    }
  }
  return { limbs, clusters, roots, perches };
}

export function Canopy({
  seed,
  w,
  h,
  from,
  className,
  birds = [],
}: {
  seed: number;
  w: number;
  h: number;
  from: "left" | "right";
  className?: string;
  /** Which perches (side branches, in order) get a bird, and how it behaves there. */
  birds?: (Omit<BirdSpec, "x"> & { on: number })[];
}) {
  const { limbs, clusters, roots, perches } = grow(seed, w, h, from);
  const style = { "--cw": `${w}px`, "--ch": `${h}px` } as CSSProperties;
  return (
    <div
      className={`canopy canopy-${from}${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden="true"
      data-watch
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
        {roots.map((root, i) => (
          <path
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed drawing, never reordered
            key={i}
            className="root sway"
            d={root.d}
            style={
              {
                "--ox": `${n(root.top.x)}px`,
                "--oy": `${n(root.top.y)}px`,
                "--sp": `${5 + (i % 3)}s`,
                "--sd": `${-i * 1.3}s`,
              } as CSSProperties
            }
          />
        ))}
        <path className="bough" d={limbs.join("")} />
        {clusters.map((c, i) => (
          <g
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed drawing, never reordered
            key={i}
            className="sway"
            style={
              {
                "--ox": `${n(c.at.x)}px`,
                "--oy": `${n(c.at.y)}px`,
                "--sp": `${3.2 + (i % 4) * 0.7}s`,
                "--sd": `${-i * 0.9}s`,
              } as CSSProperties
            }
          >
            <path className="leaf" d={c.leaves.join("")} />
            {c.figs.map((f) => (
              <circle key={`${f.x}${f.y}`} className="fig" cx={n(f.x)} cy={n(f.y)} r={4} />
            ))}
          </g>
        ))}
      </svg>
      {birds.map(({ on, ...spec }) => {
        const p = perches[on % Math.max(1, perches.length)];
        if (!p) return null;
        return (
          <span key={on} className="perch" style={{ top: `${n(p.at.y)}px` }}>
            <Roost
              on="bough"
              birds={[{ face: p.face, ...spec, x: `${n(p.at.x)}px`, wide: true }]}
            />
          </span>
        );
      })}
    </div>
  );
}
