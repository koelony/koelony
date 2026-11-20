/**
 * Generates every raster the site and the org profiles need from the artwork in `brand/`
 * (see brand/README.md). Nothing here knows what the logo looks like: replace the SVGs, run
 * `bun run icons`, and all of these are redrawn.
 *
 *   public/favicon.svg            mark; swaps to the inverse mark in dark mode if there is one
 *   public/favicon-32.png         mark on a rounded paper tile
 *   public/apple-touch-icon.png   180, mark on paper
 *   public/icon-192.png, icon-512.png
 *   public/og-en.png, og-zh-hk.png  1200 x 630 link previews with the localized page title
 *   brand/export/avatar-1024.png  square avatar for the GitHub and Hugging Face orgs
 *
 * Required: brand/logo-mark.svg. Optional: logo-mark-inverse.svg, logo-lockup.svg, koel.svg,
 * colors.json. The Open Graph headline is set in scripts/fonts/*.ttf (`bun run fonts`).
 */
import { existsSync, readdirSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { contourOf } from "../src/data/tones";
import { DICTS } from "../src/i18n";
import { ANCHOR } from "../src/koel/anchor";
import { type Locale, SITE_NAME } from "../src/site";

const root = join(import.meta.dir, "..");
const brand = join(root, "brand");
const pub = join(root, "public");
const fontDir = join(import.meta.dir, "fonts");

const optional = async (file: string) =>
  existsSync(join(brand, file)) ? readFile(join(brand, file), "utf8") : undefined;

const mark = await optional("logo-mark.svg");
if (!mark) throw new Error("brand/logo-mark.svg is required (see brand/README.md)");
const inverse = await optional("logo-mark-inverse.svg");
const lockup = await optional("logo-lockup.svg");
const koel = await optional("koel.svg");

/** Tiles (favicon, app icons, avatar) take the brand palette. */
const colors = {
  ink: "#0c0c0c",
  paper: "#f4f1ea",
  red: "#d0201a",
  ...JSON.parse((await optional("colors.json")) ?? "{}"),
} as { ink: string; paper: string; red: string };
/** Link previews look like the page itself, which is plain black on white (src/styles.css). */
const PAGE = { paper: "#ffffff", ink: "#000000", hair: "#c9c9c9" };

type Art = { box: [number, number, number, number]; body: string };

/** Splits a standalone SVG into its viewBox and contents, ready to nest inside another SVG. */
function parse(svg: string, prefix: string): Art {
  const clean = svg
    .replace(/<\?xml[\s\S]*?\?>|<!DOCTYPE[\s\S]*?>|<!--[\s\S]*?-->/gi, "")
    .replace(/<title[\s\S]*?<\/title>|<script[\s\S]*?<\/script>/gi, "");
  const open = clean.match(/<svg\b[^>]*>/i)?.[0] ?? "";
  const viewBox = open
    .match(/viewBox="([^"]+)"/)?.[1]
    .split(/[\s,]+/)
    .map(Number);
  const width = Number(open.match(/\swidth="([\d.]+)/)?.[1]);
  const height = Number(open.match(/\sheight="([\d.]+)/)?.[1]);
  const box = viewBox?.length === 4 ? viewBox : [0, 0, width || 512, height || 512];
  // Two files nested in one document must not share ids.
  const body = clean
    .slice(clean.indexOf(open) + open.length, clean.lastIndexOf("</svg>"))
    .replace(/\bid="([^"]+)"/g, `id="${prefix}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${prefix}$1"`);
  return { box: box as Art["box"], body: body.trim() };
}

/**
 * Places artwork at x, y scaled to the given height (width follows its viewBox). A plain group
 * rather than a nested <svg>, so the output stays one flat, lint-clean document.
 */
function nest(art: Art, x: number, y: number, height: number, attrs = ""): string {
  const k = height / art.box[3];
  const move = `translate(${x - art.box[0] * k} ${y - art.box[1] * k}) scale(${k})`;
  return `<g transform="${move}"${attrs}>${art.body}</g>`;
}

const xmlns = 'xmlns="http://www.w3.org/2000/svg"';
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const fontFiles = existsSync(fontDir)
  ? readdirSync(fontDir)
      .filter((f) => /\.(ttf|otf|ttc)$/i.test(f))
      .map((f) => join(fontDir, f))
  : [];
if (fontFiles.length === 0)
  console.warn(
    "no fonts in scripts/fonts (run `bun run fonts`); Open Graph text uses system fonts",
  );
const FONT_FAMILY = "Chiron GoRound TC";

const resvg = (svg: string, width: number) =>
  new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: { fontFiles, loadSystemFonts: fontFiles.length === 0, defaultFontFamily: FONT_FAMILY },
  });
const png = (svg: string, width: number) => resvg(svg, width).render().asPng();

async function write(file: string, data: string | Uint8Array) {
  await writeFile(file, data);
  console.log(file.replace(`${root}/`, ""));
}

const markArt = parse(mark, "m-");

/** The mark centred on a square of `bg`, filling `scale` of it; `radius` rounds the tile. */
function tile(size: number, scale: number, bg: string, radius = 0): string {
  const inner = size * scale;
  const at = (size - inner) / 2;
  return `<svg ${xmlns} viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${bg}"/>${nest(markArt, at, at, inner)}</svg>`;
}

// --- favicon.svg: the mark as drawn, swapped for the inverse mark in dark mode.
const favicon = inverse
  ? `<svg ${xmlns} viewBox="0 0 512 512"><title>${SITE_NAME}</title><style>.d{display:none}@media (prefers-color-scheme:dark){.l{display:none}.d{display:inline}}</style>${nest(markArt, 0, 0, 512, ' class="l"')}${nest(parse(inverse, "i-"), 0, 0, 512, ' class="d"')}</svg>\n`
  : mark;
await mkdir(pub, { recursive: true });
await write(join(pub, "favicon.svg"), favicon);

// --- raster icons
await write(join(pub, "favicon-32.png"), png(tile(64, 0.94, colors.paper, 14), 32));
await write(join(pub, "apple-touch-icon.png"), png(tile(180, 0.8, colors.paper), 180));
await write(join(pub, "icon-192.png"), png(tile(192, 0.8, colors.paper), 192));
await write(join(pub, "icon-512.png"), png(tile(512, 0.8, colors.paper), 512));
await mkdir(join(brand, "export"), { recursive: true });
await write(join(brand, "export", "avatar-1024.png"), png(tile(1024, 0.74, colors.paper), 1024));

// --- Open Graph cards
const W = 1200;
const H = 630;
const M = 72;

/** Width of a line of headline text, measured by the renderer itself. */
function measure(text: string, size: number): number {
  const svg = `<svg ${xmlns} width="4000" height="400"><text x="0" y="200" font-family="${FONT_FAMILY}" font-weight="900" font-size="${size}">${esc(text)}</text></svg>`;
  return resvg(svg, 4000).getBBox()?.width ?? 0;
}

/** Greedy line breaking: between words, and between any two Chinese characters. */
function wrap(text: string, size: number, max: number): string[] {
  const parts = text.match(/[⺀-鿿＀-￯]|[^\s⺀-鿿＀-￯]+|\s+/g) ?? [];
  const lines: string[] = [];
  let line = "";
  for (const part of parts) {
    const next = line + part;
    if (line.trim() && measure(next.trim(), size) > max) {
      lines.push(line.trim());
      line = part.trim();
    } else line = next;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

/** The page title without the site name in front: the name is already there as the logo. */
function headline(title: string): string {
  const rest = title.replace(new RegExp(`^${SITE_NAME}\\s*[—–|｜:：-]\\s*`), "");
  return rest || title;
}

/** Wraps to as few lines as fit, then narrows the measure so those lines come out even. */
function balance(text: string, size: number, max: number): string[] {
  let lines = wrap(text, size, max);
  for (let width = max - 20; width > max / 2; width -= 20) {
    const tighter = wrap(text, size, width);
    if (tighter.length > lines.length) break;
    lines = tighter;
  }
  return lines;
}

function card(locale: Locale): string {
  const t = DICTS[locale];
  const text = headline(t.meta.title);
  // The headline keeps clear of the right-hand end, where the koel stands.
  const measureWidth = W - 2 * M - 190;
  let size = 96;
  let lines = balance(text, size, measureWidth);
  while (lines.length > 2 && size > 56) {
    size -= 4;
    lines = balance(text, size, measureWidth);
  }
  const leading = size * (locale === "en" ? 1.08 : 1.22);
  const top = 258;

  // The hero's tone staff, with the contours of the sample sentence, and the koel standing on it.
  const staffTop = 482;
  const step = 20;
  const y = (level: number) => staffTop + (5 - level) * step;
  const rules = [5, 4, 3, 2, 1]
    .map((lv) => `<path d="M${M} ${y(lv)}H${W - M}" stroke="${PAGE.hair}" stroke-width="2"/>`)
    .join("");
  const cell = 62;
  const contours = t.hero.sampleJyutping
    .trim()
    .split(/\s+/)
    .map((jp, i) => {
      const c = contourOf(jp);
      if (!c) return "";
      const x0 = M + i * cell + 6;
      const x1 = x0 + (c.stop ? 18 : 38);
      return `<path d="M${x0} ${y(c.from)}L${x1} ${y(c.to)}" stroke="${PAGE.ink}" stroke-width="7" stroke-linecap="round"/>`;
    })
    .join("");

  const logoHeight = 84;
  const logo = lockup
    ? nest(parse(lockup, "l-"), M - 9, 56, logoHeight)
    : `${nest(markArt, M - 8, 52, 92)}<text x="${M + 100}" y="118" font-family="${FONT_FAMILY}" font-weight="900" font-size="64" fill="${PAGE.ink}">${SITE_NAME}</text>`;

  const birdSize = 196;
  const bird = koel
    ? // Facing into the card, feet on the top line at the right-hand end.
      `<g transform="translate(${W - M - 118} ${y(5)}) scale(-1 1)">${nest(parse(koel, "k-"), -ANCHOR.x * birdSize, -ANCHOR.y * birdSize, birdSize)}</g>`
    : "";

  return `<svg ${xmlns} viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${PAGE.paper}"/>${logo}${lines
    .map(
      (line, i) =>
        `<text x="${M}" y="${top + i * leading}" font-family="${FONT_FAMILY}" font-weight="900" font-size="${size}" fill="${PAGE.ink}"${locale === "en" ? ' letter-spacing="-1.5"' : ""}>${esc(line)}</text>`,
    )
    .join("")}${rules}${contours}${bird}</svg>`;
}

for (const locale of Object.keys(DICTS) as Locale[]) {
  await write(join(pub, `og-${locale}.png`), png(card(locale), W));
}
