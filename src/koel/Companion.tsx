import {
  domMin,
  LazyMotion,
  type MotionValue,
  m,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Dict } from "../i18n";
import { KoelArtwork } from "./art";
import { NUDGE_EVENT } from "./signal";

/**
 * The koel that lives on the page.
 *
 * On load it flies the pitch of the hero sentence: each `[data-note]` in the `[data-melody]` staff
 * has a start and end tone level, the bird's flight passes through them in reading order, and each
 * syllable is confirmed (`data-on`) as the bird goes over it. After that it follows the reader:
 * whenever another `[data-perch]` is the one nearest the middle of the window, it flies there.
 *
 * It is positioned in page coordinates inside `.site`, so a perched bird scrolls with the page for
 * free and nothing runs per scroll frame except choosing the perch. Only transforms are animated.
 * It is loaded and mounted on the client only (see App.tsx); with reduced motion it just sits on the
 * first perch.
 */

type Pose = "fly" | "perch" | "call";
type Point = { x: number; y: number };
type Perch = Point & { id: string; face: 1 | -1 };
type Run = {
  t0: number;
  dur: number;
  /** Low-pass time constant in ms; 0 follows the path exactly. */
  smooth: number;
  at: (ms: number) => Point;
  onTick?: (ms: number) => void;
  done: () => void;
};
type Segment = { t0: number; t1: number; a: Point; b: Point; el: HTMLElement; hop: boolean };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);
const lerp = (a: Point, b: Point, u: number): Point => ({
  x: a.x + (b.x - a.x) * u,
  y: a.y + (b.y - a.y) * u,
});
const arc = (a: Point, c: Point, b: Point, u: number): Point => {
  const v = 1 - u;
  return {
    x: v * v * a.x + 2 * v * u * c.x + u * u * b.x,
    y: v * v * a.y + 2 * v * u * c.y + u * u * b.y,
  };
};

export default function KoelCompanion({ t }: { t: Dict }) {
  const reduce = useReducedMotion();
  return (
    <LazyMotion features={domMin} strict>
      <Flight t={t} still={Boolean(reduce)} />
    </LazyMotion>
  );
}

function Flight({ t, still }: { t: Dict; still: boolean }) {
  const layer = useRef<HTMLDivElement>(null);
  const poke = useRef<() => void>(() => {});
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const face = useMotionValue(1);
  const squash = useMotionValue(1);
  const [pose, setPose] = useState<Pose>("fly");
  const [shown, setShown] = useState(false);
  const [says, setSays] = useState(true);

  useEffect(() => {
    const el = layer.current;
    const site = el?.parentElement;
    if (!el || !site) return;

    let perches: Perch[] = [];
    let size = el.offsetWidth;
    let pos: Point | null = null;
    let target: string | null = null;
    let mode: "idle" | "fly" | "melody" | "perched" = "idle";
    let run: Run | null = null;
    let raf = 0;
    let scrollRaf = 0;
    let measureRaf = 0;
    let last = 0;
    let tilt = 0;
    let sung = false;
    let alive = true;
    /** Where the staff was when the flight over it was planned. */
    let staffBox = "";
    const timers = new Set<number>();
    /** A small keyframe tween on one motion value (settling, turning round, the landing squash). */
    const tweens = new Map<MotionValue<number>, number>();
    const tween = (value: MotionValue<number>, keys: number[], ms: number, delay = 0) => {
      cancelAnimationFrame(tweens.get(value) ?? 0);
      const from = [value.get(), ...keys];
      const t0 = performance.now() + delay;
      const step = (now: number) => {
        const u = clamp((now - t0) / ms, 0, 1) * keys.length;
        const i = Math.min(keys.length - 1, Math.floor(u));
        value.set(from[i] + (from[i + 1] - from[i]) * ease(u - i));
        if (u < keys.length) tweens.set(value, requestAnimationFrame(step));
      };
      tweens.set(value, requestAnimationFrame(step));
    };
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (alive) fn();
      }, ms);
      timers.add(id);
    };

    const host = () => document.querySelector<HTMLElement>("[data-melody]");
    const boxOf = (node: HTMLElement) => {
      const r = node.getBoundingClientRect();
      const o = site.getBoundingClientRect();
      return [r.left - o.left, r.top - o.top, r.width, r.height].map(Math.round).join();
    };
    const viewTop = () => -site.getBoundingClientRect().top;
    const headerHeight = () => {
      const header = document.querySelector<HTMLElement>(".site-header");
      return header && getComputedStyle(header).position === "sticky" ? header.offsetHeight : 0;
    };
    const place = (p: Point) => {
      pos = p;
      x.set(p.x);
      y.set(p.y);
    };
    const perch = (id: string | null) => perches.find((p) => p.id === id);

    const measure = () => {
      const origin = site.getBoundingClientRect();
      size = el.offsetWidth;
      perches = [];
      for (const node of document.querySelectorAll<HTMLElement>("[data-perch]")) {
        if (!node.offsetParent) continue;
        const r = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        const fx = Number.parseFloat(style.getPropertyValue("--perch-x"));
        const dy = Number.parseFloat(style.getPropertyValue("--perch-y"));
        const facing = node.dataset.perchFace === "right" ? 1 : -1;
        // Keep the whole bird inside the page: its tail is the long side.
        const tail = size * 0.63;
        const beak = size * 0.33;
        perches.push({
          id: node.dataset.perch ?? "",
          face: facing,
          x: clamp(
            r.left - origin.left + r.width * (Number.isFinite(fx) ? fx : 1),
            facing > 0 ? tail : beak,
            origin.width - (facing > 0 ? beak : tail),
          ),
          // A perch is the top edge of its element, or the bottom rule when it says so.
          y:
            (node.dataset.perchEdge === "bottom" ? r.bottom - 1 : r.top) -
            origin.top +
            (Number.isFinite(dy) ? dy : 0),
        });
      }
    };

    /** The perch nearest the reader's eye line, among those fully on screen. */
    const pick = (): Perch | null => {
      const top = viewTop();
      const lo = top + headerHeight() + size * 0.7;
      const hi = top + window.innerHeight - size * 0.4;
      const focus = top + window.innerHeight * 0.46;
      let best: Perch | null = null;
      let bestD = Number.POSITIVE_INFINITY;
      for (const p of perches) {
        if (p.y < lo || p.y > hi) continue;
        const d = Math.abs(p.y - focus);
        if (d < bestD) {
          best = p;
          bestD = d;
        }
      }
      // Stay put unless the other perch is clearly better placed.
      const here = perch(target);
      if (here && best && best !== here && here.y >= lo && here.y <= hi) {
        if (bestD + window.innerHeight * 0.14 > Math.abs(here.y - focus)) return here;
      }
      return best;
    };

    const tick = (now: number) => {
      raf = 0;
      const r = run;
      if (!r || !pos) return;
      const dt = Math.min(64, now - last);
      last = now;
      const ms = Math.min(r.dur, now - r.t0);
      const goal = r.at(ms);
      const k = r.smooth > 0 ? 1 - Math.exp(-dt / r.smooth) : 1;
      const next = { x: pos.x + (goal.x - pos.x) * k, y: pos.y + (goal.y - pos.y) * k };
      const vx = next.x - pos.x;
      const vy = next.y - pos.y;
      if (Math.abs(vx) > 0.35) face.set(vx > 0 ? 1 : -1);
      // Nose follows the direction of travel, in the bird's own frame.
      const want =
        Math.hypot(vx, vy) > 0.2
          ? clamp((Math.atan2(vy, Math.abs(vx)) * 180) / Math.PI, -34, 34) * 0.85
          : 0;
      tilt += (want - tilt) * Math.min(1, dt / 90);
      rotate.set(tilt);
      place(next);
      r.onTick?.(ms);
      if (ms >= r.dur && Math.hypot(goal.x - next.x, goal.y - next.y) < 0.75) {
        run = null;
        r.done();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const start = (r: Omit<Run, "t0">) => {
      const now = performance.now();
      run = { ...r, t0: now };
      last = now;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const call = () => {
      if (mode !== "perched") return;
      // On the tone chart its call is already written out under it.
      setSays(target !== "tones");
      setPose("call");
      later(() => {
        if (mode === "perched") setPose("perch");
      }, 1150);
    };

    const land = (id: string) => {
      const p = perch(id);
      if (!p) return;
      mode = "perched";
      place({ x: p.x, y: p.y });
      tilt = 0;
      setPose("perch");
      tween(rotate, [0], 220);
      if (face.get() !== p.face) tween(face, [p.face], 260, 140);
      tween(squash, [0.84, 1.06, 1], 480);
      // It sings where singing is the point: after the hero sentence, and on the tone chart.
      if (id === "tones" || (id === "hero" && !sung)) {
        sung = sung || id === "hero";
        later(call, 460);
      }
    };

    const flyTo = (id: string, hop = false) => {
      const p = perch(id);
      if (!p) return;
      target = id;
      mode = "fly";
      setPose("fly");
      for (const id of tweens.values()) cancelAnimationFrame(id);
      squash.set(1);
      const top = viewTop();
      const vh = window.innerHeight;
      let from = pos;
      if (!from || from.y < top - size || from.y > top + vh + size) {
        // Off screen: come in across the window, from the far side and a little above.
        from = {
          x: p.x > site.clientWidth / 2 ? -size : site.clientWidth + size,
          y: Math.max(top + size * 0.3, p.y - vh * 0.34),
        };
        tilt = 0;
        place(from);
      }
      const a = from;
      const dist = Math.hypot(p.x - a.x, p.y - a.y);
      const lift = hop ? Math.max(16, dist * 0.4) : clamp(dist * 0.26, 40, 180);
      const dur = hop ? 300 : clamp(dist * 1.35, 520, 1500);
      start({
        dur,
        smooth: 0,
        // Read the perch each frame: the page may still be settling under the flight.
        at: (ms) => {
          const b = perch(id) ?? p;
          const c = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - lift };
          return arc(a, c, b, ease(ms / dur));
        },
        done: () => land(id),
      });
      setShown(true);
    };

    const finishMelody = () => {
      const staff = host();
      if (!staff) return;
      for (const note of staff.querySelectorAll<HTMLElement>("[data-note]")) note.dataset.on = "";
      staff.dataset.done = "";
    };

    /** Flies the sentence: returns false when there is no staff to fly. */
    const melody = (): boolean => {
      const staff = host();
      const notes = staff ? [...staff.querySelectorAll<HTMLElement>("[data-note]")] : [];
      if (!staff || notes.length === 0) return false;
      const origin = site.getBoundingClientRect();
      const segs: Segment[] = [];
      let time = 0;
      let rowTop: number | null = null;
      let level: Point | null = null;
      for (const note of notes) {
        const box = (note.querySelector(".contour") ?? note).getBoundingClientRect();
        const kind = note.dataset.note;
        const from = Number(note.dataset.from ?? 3);
        const to = Number(note.dataset.to ?? from);
        const left = box.left - origin.left;
        const yAt = (lv: number) => box.top - origin.top + (box.height * (5 - lv)) / 4;
        const hop = rowTop !== null && Math.abs(box.top - rowTop) > 4;
        // Punctuation is a breath: the bird holds its height across it.
        const held: number = !hop && level ? level.y : yAt(3);
        const a = { x: left + box.width * 0.2, y: kind === "rest" ? held : yAt(from) };
        const b = {
          x: left + box.width * (note.dataset.stop === undefined ? 0.8 : 0.5),
          y: kind === "rest" ? held : yAt(to),
        };
        if (segs.length > 0) time += hop ? 300 : 24;
        // About eight syllables a second: brisk Cantonese, and the whole sentence in three seconds.
        const dur = kind === "word" ? Math.max(170, box.width * 1.5) : kind === "rest" ? 80 : 104;
        segs.push({ t0: time, t1: time + dur, a, b, el: note, hop });
        time += dur;
        rowTop = box.top;
        level = b;
      }

      staffBox = boxOf(staff);
      staff.dataset.live = "";
      delete staff.dataset.done;
      for (const note of notes) delete note.dataset.on;

      const first = segs[0];
      const entry = pos ?? { x: -size, y: first.a.y - size * 0.25 };
      const lead = pos
        ? clamp(Math.hypot(first.a.x - entry.x, first.a.y - entry.y) * 1.2, 420, 1000)
        : 620;
      place(entry);
      target = "hero";
      mode = "melody";
      setPose("fly");
      setShown(true);

      let cursor = 0;
      let seg = 0;
      const at = (ms: number): Point => {
        if (ms < lead) {
          const c = { x: (entry.x + first.a.x) / 2, y: Math.min(entry.y, first.a.y) - size * 0.3 };
          return arc(entry, c, first.a, ease(ms / lead));
        }
        const now = ms - lead;
        while (seg < segs.length - 1 && now > segs[seg + 1].t0) seg += 1;
        const s = segs[seg];
        if (now <= s.t1) return lerp(s.a, s.b, clamp((now - s.t0) / (s.t1 - s.t0), 0, 1));
        return s.b;
      };
      const between = (ms: number): Point | null => {
        // On the way to the next syllable (or back to the start of the next row).
        const now = ms - lead;
        const s = segs[seg];
        const n = segs[seg + 1];
        if (now <= s.t1 || !n) return null;
        const u = clamp((now - s.t1) / (n.t0 - s.t1), 0, 1);
        const p = lerp(s.b, n.a, n.hop ? ease(u) : u);
        return n.hop ? { x: p.x, y: p.y - Math.sin(Math.PI * u) * size * 0.22 } : p;
      };
      start({
        dur: lead + time,
        smooth: 58,
        at: (ms) => {
          const p = at(ms);
          return (ms >= lead ? between(ms) : null) ?? p;
        },
        onTick: (ms) => {
          while (cursor < segs.length && ms - lead >= segs[cursor].t0) {
            segs[cursor].el.dataset.on = "";
            cursor += 1;
          }
        },
        done: () => {
          finishMelody();
          measure();
          flyTo("hero");
        },
      });
      return true;
    };

    const retarget = () => {
      if (mode === "melody") {
        const r = host()?.getBoundingClientRect();
        if (r && r.bottom > headerHeight() && r.top < window.innerHeight) return;
        finishMelody();
        run = null;
      }
      const best = pick();
      if (best && best.id !== target) flyTo(best.id);
      else if (best && mode === "idle") flyTo(best.id);
    };

    const remeasure = () => {
      measureRaf = 0;
      if (mode === "melody") {
        const staff = host();
        if (staff && boxOf(staff) === staffBox) return;
        // The staff has moved under the flight: finish the sentence rather than fly stale notes.
        finishMelody();
        run = null;
        mode = "idle";
      }
      measure();
      if (still) {
        const p = perch("hero") ?? perches[0];
        if (!p) return;
        face.set(p.face);
        place({ x: p.x, y: p.y });
        return;
      }
      const here = perch(target);
      if (mode === "perched" && here && pos) {
        const moved = Math.hypot(here.x - pos.x, here.y - pos.y);
        if (moved > 80) flyTo(here.id);
        else if (moved > 3) flyTo(here.id, true);
        else place({ x: here.x, y: here.y });
      }
      retarget();
    };
    const queueMeasure = () => {
      if (!measureRaf) measureRaf = requestAnimationFrame(remeasure);
    };
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        retarget();
      });
    };
    const onNudge = (event: Event) => {
      if (mode !== "perched" || (event as CustomEvent<string>).detail !== target) return;
      tween(squash, [0.86, 1.07, 1], 420);
    };

    poke.current = () => {
      if (mode !== "perched") return;
      if (target === "hero" && melody()) return;
      call();
    };

    const begin = () => {
      if (!alive) return;
      measure();
      const staff = host();
      if (still) {
        if (staff) finishMelody();
        const p = perch("hero") ?? perches[0];
        if (!p) return;
        mode = "perched";
        face.set(p.face);
        place({ x: p.x, y: p.y });
        setPose("perch");
        setShown(true);
        return;
      }
      const r = staff?.getBoundingClientRect();
      const inView = r && r.top < window.innerHeight * 0.92 && r.bottom > headerHeight() + 40;
      if (!inView || !melody()) {
        if (staff) finishMelody();
        retarget();
      }
    };

    // Web fonts change the staff's metrics; wait for them (briefly) before reading positions.
    let begun = false;
    const once = () => {
      if (begun) return;
      begun = true;
      begin();
    };
    document.fonts.ready.then(once);
    later(once, 700);

    const observer = new ResizeObserver(() => {
      if (begun) queueMeasure();
    });
    observer.observe(site);
    window.addEventListener("resize", queueMeasure);
    window.addEventListener(NUDGE_EVENT, onNudge);
    if (!still) window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      alive = false;
      run = null;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      cancelAnimationFrame(measureRaf);
      for (const id of tweens.values()) cancelAnimationFrame(id);
      for (const id of timers) window.clearTimeout(id);
      observer.disconnect();
      window.removeEventListener("resize", queueMeasure);
      window.removeEventListener(NUDGE_EVENT, onNudge);
      window.removeEventListener("scroll", onScroll);
    };
  }, [still, x, y, rotate, face, squash]);

  const turn = { scaleX: face, scaleY: squash, rotate };
  return (
    <>
      <m.div
        ref={layer}
        className="koel koel-ink"
        data-pose={pose}
        data-shown={shown || undefined}
        style={{ x, y }}
        aria-hidden="true"
      >
        <m.div className="koel-turn" style={turn}>
          <KoelArtwork part="body" />
          <svg className="koel-note" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
            <path d="M492 76l28-6M536 58q40-18 56-76" />
          </svg>
          {says && (
            <span className="koel-say">
              <m.span style={{ scaleX: face }}>{t.koel.call}</m.span>
            </span>
          )}
        </m.div>
      </m.div>
      <m.div
        className="koel koel-top"
        data-pose={pose}
        data-shown={shown || undefined}
        style={{ x, y }}
      >
        <m.div className="koel-turn" style={turn}>
          <KoelArtwork part="eye" />
          {!still && (
            <button
              type="button"
              className="koel-poke"
              aria-label={t.koel.poke}
              onClick={() => poke.current()}
            />
          )}
        </m.div>
      </m.div>
    </>
  );
}
