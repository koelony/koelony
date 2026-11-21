import { FLYING, LITTLE, PERCHED } from "./koel/art";

/**
 * The pointer is a little koel. The tip of its beak is the exact point you click with. It faces the
 * way you move; moving fast it takes off and flaps, leaving a short ink trail that fades like a
 * pitch contour on the staff; slowing down it perches again and now and then blinks. Reaching a
 * link or a button it pecks at it, and a click is a little hop.
 *
 * Only for a mouse or trackpad (hover + fine pointer) and only with motion allowed; everyone else
 * keeps the system cursor. It is decoration: aria-hidden, pointer-events none, and the system cursor
 * is hidden only while the bird is on screen.
 */

/** Size of the bird's 512-unit box on screen, in px. */
const SIZE = 46;
/** Where the beak tip is in the 512-unit drawing (perched, facing right). The hot spot. */
const TIP = { x: 466.722, y: 78.843 };
/** Beak tip of the flying drawing, so it can be moved onto the same hot spot. */
const FLY_TIP = { x: 474, y: 190 };
const TIP_PX = { x: (TIP.x / 512) * SIZE, y: (TIP.y / 512) * SIZE };

/** Speed (px per ms, smoothed) above which it flies, and below which it settles. */
const TAKE_OFF = 0.85;
const SETTLE = 0.25;
/** How long a point of the trail lives, in ms. */
const TRAIL_MS = 240;
const INTERACTIVE =
  "a, button, [role='button'], summary, label, select, [tabindex]:not([tabindex='-1'])";

const n = (v: number) => Number(v.toFixed(2));

/**
 * The bird as two SVG layers: the silhouette (blended against the page, so it is black on white and
 * white on black) and the red eye. The head (`.cb-head`) turns about LITTLE.pivot for the peck;
 * interaction.css carries that point.
 */
function art(part: "body" | "eye"): string {
  const fly = `translate(${n(TIP.x - FLY_TIP.x)} ${n(TIP.y - FLY_TIP.y)})`;
  if (part === "eye") {
    const eye = LITTLE.eye ?? PERCHED.eye;
    const perched = eye
      ? `<circle class="cb-blink" cx="${eye.cx}" cy="${eye.cy}" r="${n(eye.r * 1.35)}"/>`
      : "";
    return [
      `<svg viewBox="0 0 512 512" focusable="false">`,
      `<g class="cb-perch"><g class="cb-head">${perched}</g></g>`,
      `<g class="cb-fly" transform="${fly}">`,
      `<circle cx="${FLYING.eye.cx}" cy="${FLYING.eye.cy}" r="${n(FLYING.eye.r * 1.6)}"/>`,
      `</g></svg>`,
    ].join("");
  }
  const s = FLYING.shoulder;
  return [
    `<svg viewBox="0 0 512 512" focusable="false">`,
    `<g class="cb-perch"><path d="${LITTLE.body}"/>`,
    LITTLE.beak ? `<g class="cb-head"><path d="${LITTLE.beak}"/></g>` : "",
    `</g>`,
    `<g class="cb-fly" transform="${fly}">`,
    `<g transform="translate(26 -2) rotate(16 ${s.x} ${s.y})">`,
    `<path class="cb-wing cb-wing-far" d="${FLYING.wing}"/></g>`,
    `<path d="${FLYING.body}"/>`,
    `<path class="cb-wing" d="${FLYING.wing}"/>`,
    `</g></svg>`,
  ].join("");
}

export function startCursor(): () => void {
  const root = document.documentElement;
  const body = document.createElement("div");
  const eye = document.createElement("div");
  const trail = document.createElement("canvas");
  body.className = "cb cb-body";
  eye.className = "cb cb-eye";
  trail.className = "cur-trail";
  body.innerHTML = art("body");
  eye.innerHTML = art("eye");
  for (const el of [body, eye]) el.style.transformOrigin = `${n(TIP_PX.x)}px ${n(TIP_PX.y)}px`;
  for (const el of [trail, body, eye]) {
    el.setAttribute("aria-hidden", "true");
    el.style.setProperty("--cb", `${SIZE}px`);
    document.body.append(el);
  }
  root.classList.add("has-cursor");

  const ctx = trail.getContext("2d");
  const points: { x: number; y: number; t: number }[] = [];
  let raf = 0;
  let x = -100;
  let y = -100;
  let last = { x: -100, y: -100, t: 0 };
  let speed = 0;
  let vy = 0;
  let face = 1;
  let wantFace = 1;
  let tilt = 0;
  let flying = false;
  let calm = 0;
  let width = 0;
  let height = 0;

  const size = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    width = window.innerWidth;
    height = window.innerHeight;
    trail.width = Math.round(width * dpr);
    trail.height = Math.round(height * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();

  const setPose = (fly: boolean) => {
    flying = fly;
    body.dataset.pose = fly ? "fly" : "perch";
    eye.dataset.pose = body.dataset.pose;
  };
  setPose(false);

  const frame = (now: number) => {
    raf = 0;
    // Speed decays when the pointer stops sending moves, so the bird lands by itself.
    if (now - last.t > 60) speed *= 0.82;
    if (flying && speed < SETTLE) {
      calm += 16;
      if (calm > 180) setPose(false);
    } else calm = 0;

    face += (wantFace - face) * 0.28;
    // Nose up when climbing, down when diving; level when perched.
    const wantTilt = flying ? Math.max(-24, Math.min(24, vy * 14)) * Math.sign(face || 1) : 0;
    tilt += (wantTilt - tilt) * 0.2;
    // Turning round passes through edge-on; never quite zero, so the bird never vanishes.
    const k = Math.abs(face) < 0.05 ? 0.05 * Math.sign(face || 1) : face;
    const transform = `translate3d(${n(x - TIP_PX.x)}px, ${n(y - TIP_PX.y)}px, 0) rotate(${n(tilt)}deg) scaleX(${n(k)})`;
    body.style.transform = transform;
    eye.style.transform = transform;

    while (points.length > 0 && now - points[0].t > TRAIL_MS) points.shift();
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";
      ctx.strokeStyle = "#fff";
      for (let i = 1; i < points.length; i += 1) {
        const a = points[i - 1];
        const b = points[i];
        // Older segments are thinner and fainter: the contour is written, then dries away.
        const life = 1 - (now - b.t) / TRAIL_MS;
        ctx.globalAlpha = Math.max(0, life) * 0.85;
        ctx.lineWidth = 1 + 2 * life;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    const settled =
      points.length === 0 &&
      !flying &&
      Math.abs(wantFace - face) < 0.01 &&
      Math.abs(tilt) < 0.1 &&
      speed < 0.01;
    if (!settled) raf = requestAnimationFrame(frame);
  };
  const queue = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const now = performance.now();
    x = event.clientX;
    y = event.clientY;
    const dt = Math.max(1, now - last.t);
    const dx = x - last.x;
    const dy = y - last.y;
    if (last.t > 0 && dt < 100) {
      speed += (Math.hypot(dx, dy) / dt - speed) * 0.35;
      vy += (dy / dt - vy) * 0.3;
      // Turn round only on a clear move sideways, not on a wobble.
      if (Math.abs(dx) > 2.5 && Math.abs(dx) > Math.abs(dy) * 0.5) wantFace = dx > 0 ? 1 : -1;
    }
    last = { x, y, t: now };
    if (!flying && speed > TAKE_OFF) setPose(true);
    // The trail is the flight path: it is only written while flying.
    if (flying) points.push({ x, y, t: now });
    root.classList.add("cursor-in");
    const target = event.target instanceof Element ? event.target : null;
    root.classList.toggle("cursor-link", Boolean(target?.closest(INTERACTIVE)));
    // On a red button the inverted bird would turn cyan; there it is drawn plain white.
    root.classList.toggle("cursor-solid", Boolean(target?.closest(".btn-solid")));
    queue();
  };
  const onDown = () => root.classList.add("cursor-down");
  const onUp = () => root.classList.remove("cursor-down");
  const onLeave = () => {
    root.classList.remove("cursor-in", "cursor-link", "cursor-solid", "cursor-down");
    points.length = 0;
    speed = 0;
    setPose(false);
    queue();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  window.addEventListener("resize", size);
  root.addEventListener("pointerleave", onLeave);
  window.addEventListener("blur", onLeave);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("resize", size);
    root.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("blur", onLeave);
    root.classList.remove("has-cursor", "cursor-in", "cursor-link", "cursor-solid", "cursor-down");
    for (const el of [trail, body, eye]) el.remove();
  };
}
