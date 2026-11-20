/**
 * Everything the site takes from `brand/` (see brand/README.md), read at build time. Replace the
 * files there and rebuild: the header, the footer and the perched koel follow, with no edits here.
 * Nothing in this module touches the DOM, so the prerendered and hydrated markup are identical.
 */
const svgs = import.meta.glob<string>(
  [
    "../brand/logo-mark.svg",
    "../brand/logo-mark-mono.svg",
    "../brand/logo-lockup.svg",
    "../brand/koel.svg",
  ],
  { query: "?raw", import: "default", eager: true },
);
const palettes = import.meta.glob<Record<string, string>>("../brand/colors.json", {
  import: "default",
  eager: true,
});

const read = (name: string): string | undefined => svgs[`../brand/${name}.svg`];

/** Brand colours as shipped in the artwork. The page maps them onto its own theme tokens. */
export const BRAND = {
  ink: "#0c0c0c",
  paper: "#f4f1ea",
  red: "#d0201a",
  ...palettes["../brand/colors.json"],
};

const attr = (tag: string, name: string): string | undefined =>
  tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

/**
 * Makes a standalone SVG file safe to inline: drops the prolog, comments, scripts, <title> and the
 * root width/height (CSS sizes it) and hides it from assistive tech (the wrapper carries the name).
 */
function inline(svg: string): string {
  return svg
    .replace(/<\?xml[\s\S]*?\?>|<!DOCTYPE[\s\S]*?>|<!--[\s\S]*?-->/gi, "")
    .replace(/<script[\s\S]*?<\/script>|<title[\s\S]*?<\/title>/gi, "")
    .replace(/>\s+</g, "><")
    .trim()
    .replace(/<svg\b([^>]*)>/i, (_, attrs: string) => {
      const kept = attrs.replace(/\s(?:width|height|role|aria-[\w-]+|focusable)="[^"]*"/gi, "");
      return `<svg${kept} aria-hidden="true" focusable="false">`;
    });
}

/**
 * Re-points the three brand colours at theme tokens, so one full-colour file follows light and dark:
 * ink becomes the text colour, paper the page colour, red the koel's eye.
 */
function themed(svg: string): string {
  const map: [string, string][] = [
    [BRAND.ink, "currentColor"],
    [BRAND.paper, "var(--paper)"],
    [BRAND.red, "var(--eye)"],
  ];
  return svg.replace(
    /\s(fill|stroke)="(#[0-9a-f]{3,8})"/gi,
    (whole, prop: string, value: string) => {
      const token = map.find(([hex]) => hex.toLowerCase() === value.toLowerCase())?.[1];
      return token ? ` ${prop}="${token}"` : whole;
    },
  );
}

/**
 * The mono mark is one colour by contract, which would leave the eye the colour of the K. Whatever
 * is red in the full-colour mark is the eye, so the same shape in the mono file is given the eye
 * token back.
 */
function withEye(mono: string, colour: string | undefined): string {
  if (!colour) return mono;
  const eyes = (colour.match(/<[a-z]+\b[^>]*>/gi) ?? [])
    .filter((tag) => attr(tag, "fill")?.toLowerCase() === BRAND.red.toLowerCase())
    .map((tag) => tag.replace(/\sfill="[^"]*"/, ""));
  return mono.replace(/<[a-z]+\b[^>]*>/gi, (tag) =>
    eyes.includes(tag.replace(/\sfill="[^"]*"/, ""))
      ? tag.replace(/\sfill="[^"]*"/, ' fill="var(--eye)"')
      : tag,
  );
}

const mono = read("logo-mark-mono");
const mark = read("logo-mark");
const lockup = read("logo-lockup");

/** The symbol alone: `logo-mark-mono.svg`, else `logo-mark.svg`. Follows the theme either way. */
export const MARK_SVG = mono
  ? inline(withEye(mono, mark))
  : mark
    ? inline(themed(mark))
    : undefined;
/** Symbol plus wordmark (`logo-lockup.svg`), if the brand folder has one. */
export const LOCKUP_SVG = lockup ? inline(themed(lockup)) : undefined;

export type KoelArt = {
  /** Square-ish viewBox as [minX, minY, width, height]. */
  box: [number, number, number, number];
  /** Every path of the silhouette, joined. */
  d: string;
  eye: { cx: number; cy: number; r: number } | null;
};

/** The official standalone koel (`brand/koel.svg`): the perched pose of the bird that flies around. */
export const KOEL_SVG: KoelArt | undefined = (() => {
  const svg = read("koel");
  const box = svg
    ?.match(/viewBox="([^"]+)"/)?.[1]
    .split(/[\s,]+/)
    .map(Number);
  const paths = [...(svg?.matchAll(/<path\b[^>]*\sd="([^"]+)"/g) ?? [])].map((m) => m[1]);
  if (!svg || box?.length !== 4 || paths.length === 0) return undefined;
  const circles = svg.match(/<circle\b[^>]*>/g) ?? [];
  const eye =
    circles.find((tag) => attr(tag, "fill")?.toLowerCase() === BRAND.red.toLowerCase()) ??
    circles[0];
  return {
    box: box as [number, number, number, number],
    d: paths.join(""),
    eye: eye
      ? { cx: Number(attr(eye, "cx")), cy: Number(attr(eye, "cy")), r: Number(attr(eye, "r")) }
      : null,
  };
})();
