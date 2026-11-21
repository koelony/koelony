import {
  domMin,
  LazyMotion,
  type MotionValue,
  m,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { KoelArtwork } from "./art";

/**
 * The koel that lives on the page.
 *
 * On load it flies the pitch of the hero sentence: each `[data-note]` in the `[data-melody]` staff
 * has a start and end tone level, the bird's flight passes through them in reading order, and each
 * syllable is confirmed (`data-on`) as the bird goes over it. Then it lands on the staff's perch
 * and stays there: it does not follow the reader down the page.
 *
 * Once landed it calls, and the staff takes the call down like it took the sentence: a low note and
 * a long rise, three times, each a little higher, written in the same strokes and climbing off the
 * top of the five lines. Nothing says what it is; the strokes die away and the staff is clean again.
 * It calls once more when the reader comes back to the hero after a while.
 *
 * It is positioned in page coordinates inside `.site`, so a perched bird scrolls with the page for
 * free. Only transforms are animated. It is loaded and mounted on the client only (see App.tsx);
 * with reduced motion it just sits on the perch.
 */

type Pose = "fly" | "perch";
type Point = { x: number; y: number };
type Perch = Point & {
  id: string;
  face: 1 | -1;
  /** Tone level the bird stands on: 5 is the staff's top line, above that are ledger lines. */
  level: number;
  /** Top line of the staff it stands on, and the distance between two lines (0 if not a staff). */
  top: number;
  rail: number;
};
/** Ledger lines, in page coordinates. */
type Rails = { x0: number; x1: number; ys: number[] };
type Call = {
  id: number;
  rails: Rails | null;
  /** One "ko-EL": when it starts (ms), the short low note and the long rise, as path data. */
  notes: { at: number; ko: string; el: string }[];
};

/** When each of the three calls starts, in ms: a koel speeds up as it climbs. */
const CALL = [240, 860, 1440];
const CALL_OVER = 3300;
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

function Ledger({ rails }: { rails: Rails }) {
  return rails.ys.map((y) => (
    <line key={y} className="koel-rail" x1={rails.x0} x2={rails.x1} y1={y} y2={y} />
  ));
}

export default function KoelCompanion() {
  const reduce = useReducedMotion();
  return (
    <LazyMotion features={domMin} strict>
      <Flight still={Boolean(reduce)} />
    </LazyMotion>
  );
}

function Flight({ still }: { still: boolean }) {
  const layer = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const face = useMotionValue(1);
  const squash = useMotionValue(1);
  const [pose, setPose] = useState<Pose>("fly");
  const [shown, setShown] = useState(false);
  const [stub, setStub] = useState<Rails | null>(null);
  const [home, setHome] = useState(false);
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    const el = layer.current;
    const site = el?.parentElement;
    if (!el || !site) return;

    let perches: Perch[] = [];
    let size = el.offsetWidth;
    let pos: Point | null = null;
    let target: string | null = null;
    let mode: "idle" | "waiting" | "fly" | "melody" | "perched" = "idle";
    let run: Run | null = null;
    let raf = 0;
    let scrollRaf = 0;
    let measureRaf = 0;
    let last = 0;
    let tilt = 0;
    let alive = true;
    let sung = Number.NEGATIVE_INFINITY;
    let calls = 0;
    let stubKey = "";
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
    /** Height of a tone level on a perch's staff. Lines are 1px, so their middle is half a pixel in. */
    const pitch = (p: Perch, level: number) => p.top + 0.5 - (level - 5) * p.rail;
    const ledger = (p: Perch) =>
      Array.from({ length: Math.max(0, Math.ceil(p.level) - 5) }, (_, i) => pitch(p, 6 + i));

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
        // On a staff the bird can stand above the top line, on ledger lines (`--perch-level`).
        const line = node.querySelector(".contour");
        const rail = line ? (Number.parseFloat(getComputedStyle(line).height) - 1) / 4 : 0;
        const level = rail ? Number.parseFloat(style.getPropertyValue("--perch-level")) || 5 : 5;
        // Keep the whole bird inside the page: its tail is the long side.
        const tail = size * 0.63;
        const beak = size * 0.33;
        perches.push({
          id: node.dataset.perch ?? "",
          face: facing,
          level,
          rail,
          top: r.top - origin.top,
          x: clamp(
            r.left - origin.left + r.width * (Number.isFinite(fx) ? fx : 1),
            facing > 0 ? tail : beak,
            origin.width - (facing > 0 ? beak : tail),
          ),
          // A perch is the top edge of its element, or the bottom rule when it says so.
          y:
            (node.dataset.perchEdge === "bottom" ? r.bottom - 1 : r.top) -
            origin.top +
            (Number.isFinite(dy) ? dy : 0) -
            (level - 5) * rail,
        });
      }
      // The ledger lines under a bird that stands above the staff: short, and clear of its tail.
      const hero = perch("hero");
      const next =
        hero && hero.level > 5
          ? {
              x0: Math.round(hero.x - size * 0.5),
              x1: Math.round(hero.x - size * 0.08),
              ys: ledger(hero),
            }
          : null;
      const key = JSON.stringify(next);
      if (key !== stubKey) {
        stubKey = key;
        setStub(next);
      }
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

    const land = (id: string) => {
      const p = perch(id);
      if (!p) return;
      mode = "perched";
      place({ x: p.x, y: p.y });
      tilt = 0;
      target = id;
      setPose("perch");
      setShown(true);
      setHome(true);
      tween(rotate, [0], 220);
      if (face.get() !== p.face) tween(face, [p.face], 260, 140);
      tween(squash, [0.84, 1.06, 1], 480);
    };

    /**
     * The call, written on the staff the bird stands on, to the left of its beak and ending there.
     * Where that stretch of staff is free it starts inside the five lines and climbs out of them;
     * where the row is full of syllables (narrow screens) it is written on the ledger lines above.
     */
    const sing = () => {
      const p = perch("hero");
      const staff = document.querySelector<HTMLElement>('[data-perch="hero"]');
      if (!p || !staff || mode !== "perched" || target !== "hero" || p.face > 0 || !p.rail) return;
      const origin = site.getBoundingClientRect();
      const box = staff.getBoundingClientRect();
      const above = p.level > 5;
      const end = p.x - size * (above ? 0.5 : 0.4);
      let from = box.left - origin.left;
      if (!above) {
        // Not over the row's syllables and words. Punctuation has no tone: its staff is free.
        for (const note of staff.querySelectorAll<HTMLElement>("[data-note]")) {
          const r = note.getBoundingClientRect();
          if (note.dataset.note !== "rest" && Math.abs(r.top - box.top) < 4) {
            from = Math.max(from, r.right - origin.left + p.rail);
          }
        }
      }
      const each = Math.min((end - from) / CALL.length, size * 0.6);
      if (each < 34) return;
      const start = end - each * CALL.length;
      // Each call starts higher than the last and rises further: [first low note, step up, rise, more].
      const [base, up, rise, more] = above ? [6, 0.75, 2.4, 0.4] : [2, 1, 3, 0.5];
      const n = (v: number) => Math.round(v * 10) / 10;
      const notes = CALL.map((at, k) => {
        const x = start + k * each;
        const low = base + k * up;
        const a = { x: x + each * 0.34, y: pitch(p, low + 0.55) };
        const b = { x: x + each * 0.82, y: pitch(p, low + 0.55 + rise + k * more) };
        // The rise is a swoop, not a ruled line: it leaves level and steepens.
        const c = { x: a.x + (b.x - a.x) * 0.62, y: a.y + (b.y - a.y) * 0.1 };
        return {
          at,
          ko: `M${n(x)} ${n(pitch(p, low))}L${n(x + each * 0.2)} ${n(pitch(p, low + 0.25))}`,
          el: `M${n(a.x)} ${n(a.y)}Q${n(c.x)} ${n(c.y)} ${n(b.x)} ${n(b.y)}`,
        };
      });
      sung = performance.now();
      calls += 1;
      const id = calls;
      setCall({
        id,
        notes,
        rails: above
          ? { x0: Math.round(start - p.rail), x1: Math.round(end), ys: ledger(p) }
          : null,
      });
      for (const at of CALL) {
        // It dips on the low note and stretches up into the rise.
        later(() => {
          if (mode !== "perched" || calls !== id) return;
          tween(squash, [0.96, 1.07, 1], 480);
          tween(rotate, [3, -9, 0], 480);
        }, at);
      }
      later(() => setCall((now) => (now?.id === id ? null : now)), CALL_OVER);
    };

    const flyTo = (id: string, hop = false, then?: () => void) => {
      const p = perch(id);
      if (!p) return;
      target = id;
      mode = "fly";
      setPose("fly");
      setHome(true);
      setCall(null);
      calls += 1;
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
        done: () => {
          land(id);
          then?.();
        },
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
      // The staff lines may still be ruling themselves (a transform), so read each note's own box:
      // its first row is the staff.
      const line = staff.querySelector(".contour");
      const staffH = line ? Number.parseFloat(getComputedStyle(line).height) : 0;
      for (const note of notes) {
        const whole = note.getBoundingClientRect();
        const box = { left: whole.left, top: whole.top, width: whole.width, height: staffH };
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
          flyTo("hero", false, () => later(sing, 520));
        },
      });
      return true;
    };

    /** Scrolled away mid-sentence: confirm the rest and settle on the perch without the flight. */
    const abandon = () => {
      if (mode !== "melody") return;
      const r = host()?.getBoundingClientRect();
      if (r && r.bottom > headerHeight() && r.top < window.innerHeight) return;
      finishMelody();
      run = null;
      land("hero");
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
      } else if (mode === "idle") {
        flyTo("hero");
      }
    };
    const queueMeasure = () => {
      if (!measureRaf) measureRaf = requestAnimationFrame(remeasure);
    };
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        abandon();
      });
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
        setHome(true);
        return;
      }
      const r = staff?.getBoundingClientRect();
      if (staff && r && r.top >= window.innerHeight * 0.92) {
        // Still below the fold (most phones): the sentence waits, unconfirmed, and is flown when
        // the reader gets to it. `data-live` holds off the stylesheet's own fallback.
        mode = "waiting";
        staff.dataset.live = "";
        arrive.observe(staff);
        return;
      }
      const inView = r && r.bottom > headerHeight() + 40;
      if (!inView || !melody()) {
        if (staff) finishMelody();
        land("hero");
      }
    };
    const arrive = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || mode !== "waiting") return;
        arrive.disconnect();
        measure();
        if (!melody()) {
          finishMelody();
          land("hero");
        }
      },
      { rootMargin: "0px 0px -14% 0px" },
    );

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
    // Back at the hero after a while away: it calls again.
    const back = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && mode === "perched" && performance.now() - sung > 20000) {
          later(sing, 500);
        }
      },
      { threshold: 0.6 },
    );
    const staff = host();
    if (!still && staff) back.observe(staff);
    window.addEventListener("resize", queueMeasure);
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
      back.disconnect();
      arrive.disconnect();
      window.removeEventListener("resize", queueMeasure);
      window.removeEventListener("scroll", onScroll);
    };
  }, [still, x, y, rotate, face, squash]);

  const turn = { scaleX: face, scaleY: squash, rotate };
  return (
    <>
      {stub && (
        <svg
          className="koel-score koel-stub"
          data-shown={home || undefined}
          width="1"
          height="1"
          aria-hidden="true"
          focusable="false"
        >
          <Ledger rails={stub} />
        </svg>
      )}
      {call && (
        <svg
          key={call.id}
          className="koel-score koel-call"
          width="1"
          height="1"
          aria-hidden="true"
          focusable="false"
        >
          {call.rails && <Ledger rails={call.rails} />}
          {call.notes.map((note) => (
            <g key={note.at} style={{ "--at": `${note.at}ms` } as CSSProperties}>
              <path
                className="koel-tone"
                pathLength={1}
                d={note.ko}
                style={{ "--at": `${note.at}ms`, "--for": "90ms" } as CSSProperties}
              />
              <path
                className="koel-tone koel-tone-el"
                pathLength={1}
                d={note.el}
                style={{ "--at": `${note.at + 150}ms`, "--for": "300ms" } as CSSProperties}
              />
            </g>
          ))}
        </svg>
      )}
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
        </m.div>
      </m.div>
      <m.div
        className="koel koel-top"
        data-pose={pose}
        data-shown={shown || undefined}
        style={{ x, y }}
        aria-hidden="true"
      >
        <m.div className="koel-turn" style={turn}>
          <KoelArtwork part="eye" />
        </m.div>
      </m.div>
    </>
  );
}
