import { KOEL_SVG, type KoelArt } from "../brand";
import { ANCHOR } from "./anchor";

/**
 * Koel artwork, in a 512-unit box, facing right.
 *
 * PERCHED is the official bird from `brand/koel.svg`: swap that file and this pose follows on the
 * next build. The copy below is only the fallback for a brand folder without one.
 *
 * FLYING is our own drawing, because the brand has no flight pose. It keeps the official
 * construction (circular arcs only, crescents ending in sharp tips, one round eye), so the two read
 * as the same bird. To replace it, redraw `FLYING` here: body, one wing (it is mirrored through the
 * shoulder line to flap, and reused for the far wing) and the eye.
 */
const FALLBACK: KoelArt = {
  box: [0, 0, 512, 512],
  d: "M370.83 72.241A207.824 207.824 0 0 1 466.722 78.843A115.458 115.458 0 0 0 355.298 195.238A256.893 256.893 0 0 1 42.812 448.283A248.234 248.234 0 0 0 303.338 223.095A427.194 427.194 0 0 1 38.073 391.298A326.168 326.168 0 0 1 232.425 136.963A92.366 92.366 0 0 0 279.815 90.889A57.729 57.729 0 0 1 370.83 72.241Z",
  eye: { cx: 345.48, cy: 101.864, r: 16.741 },
};

export const PERCHED = KOEL_SVG ?? FALLBACK;

export const FLYING = {
  body: "M386 170A190 190 0 0 1 474 190A105 105 0 0 0 398 248A330 330 0 0 1 250 292A520 520 0 0 1 30 262A700 700 0 0 0 232 222A300 300 0 0 0 30 222A620 620 0 0 1 250 178A120 120 0 0 0 300 180A52 52 0 0 1 386 170Z",
  wing: "M326 196A262 262 0 0 0 170 20A340 340 0 0 0 208 224Z",
  eye: { cx: 362, cy: 194, r: 14.5 },
  /** Shoulder: the wings flap about this point. Keep in step with `.k-wing` in styles.css. */
  shoulder: { x: 268, y: 208 },
};

/** The flying pose is shifted so its belly passes through the perched bird's anchor point. */
const FLY_BELLY = { x: 268, y: 290 };

const perchTransform = (() => {
  const [minX, minY, w, h] = PERCHED.box;
  const k = 512 / Math.max(w, h);
  return `scale(${k}) translate(${-minX} ${-minY})`;
})();
const flyTransform = `translate(${ANCHOR.x * 512 - FLY_BELLY.x} ${ANCHOR.y * 512 - FLY_BELLY.y})`;

/**
 * The same koel for the little birds of the colony (Flock.tsx), with its beak cut free so a head can
 * nod. The cut follows the drawing's own circles: the head is the r = 57.729 circle about its centre,
 * the throat the r = 115.458 circle, and they meet at (389.83, 111.85). The body keeps the round
 * head and the throat; the beak is the wedge in front of it and turns about the head's centre.
 *
 * This only fits the bird it was measured from. If `brand/koel.svg` is redrawn the little birds
 * take the new drawing whole and their heads keep still, until the cut is measured again here.
 */
const numbers = (d: string) => (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
const measured = (() => {
  const a = numbers(PERCHED.d);
  const b = numbers(FALLBACK.d);
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 0.01);
})();

export const LITTLE = {
  perch: perchTransform,
  fly: flyTransform,
  body: measured
    ? "M370.83 72.241A57.729 57.729 0 0 1 389.83 111.85A115.458 115.458 0 0 0 355.298 195.238A256.893 256.893 0 0 1 42.812 448.283A248.234 248.234 0 0 0 303.338 223.095A427.194 427.194 0 0 1 38.073 391.298A326.168 326.168 0 0 1 232.425 136.963A92.366 92.366 0 0 0 279.815 90.889A57.729 57.729 0 0 1 370.83 72.241Z"
    : PERCHED.d,
  beak: measured
    ? "M370.83 72.241A207.824 207.824 0 0 1 466.722 78.843A115.458 115.458 0 0 0 389.83 111.85L332.2 115.14Z"
    : null,
  // The head turns about its centre, (332.2, 115.14): keep `.b-head` in styles.css in step.
  /** At thirty-odd pixels the official eye is a pixel wide, so the little birds get a bigger one. */
  eye: PERCHED.eye && { ...PERCHED.eye, r: PERCHED.eye.r * 1.4 },
  flyEye: { ...FLYING.eye, r: FLYING.eye.r * 1.25 },
};

/**
 * One layer of the bird. The silhouette and the eye are separate SVGs because the silhouette is
 * blended against the page (so it is black on white and white on black, like the logo) while the eye
 * must stay red.
 */
export function KoelArtwork({ part }: { part: "body" | "eye" }) {
  if (part === "eye") {
    return (
      <svg className="koel-svg" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
        {PERCHED.eye && (
          <g className="k-perch" transform={perchTransform}>
            <circle className="k-eye" cx={PERCHED.eye.cx} cy={PERCHED.eye.cy} r={PERCHED.eye.r} />
          </g>
        )}
        <g className="k-fly" transform={flyTransform}>
          <circle className="k-eye" cx={FLYING.eye.cx} cy={FLYING.eye.cy} r={FLYING.eye.r} />
        </g>
      </svg>
    );
  }
  return (
    <svg className="koel-svg" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
      <g className="k-perch" transform={perchTransform}>
        <path d={PERCHED.d} />
      </g>
      <g className="k-fly" transform={flyTransform}>
        <g transform={`translate(26 -2) rotate(16 ${FLYING.shoulder.x} ${FLYING.shoulder.y})`}>
          <path className="k-wing k-wing-far" d={FLYING.wing} />
        </g>
        <path d={FLYING.body} />
        <path className="k-wing" d={FLYING.wing} />
      </g>
    </svg>
  );
}
