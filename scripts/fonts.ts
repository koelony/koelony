/**
 * Display face: Chiron GoRound TC (SIL OFL 1.1), a Hong Kong rounded gothic. The full family is
 * tens of MB, so this fetches it from Google Fonts cut down to exactly the characters the site sets
 * in it (see src/fonts/display-text.ts) and stores the result in the repo:
 *
 *   src/fonts/*.woff2    for the site, one file per weight and script
 *   scripts/fonts/*.ttf  for the Open Graph images (`bun run icons`)
 *
 *   bun run fonts                   refetch everything
 *   bun scripts/fonts.ts --ensure   refetch only if the copy now uses characters the files lack
 *                                   (part of `bun run build`; offline it warns and carries on,
 *                                   and the missing characters fall back to the system font)
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DISPLAY_TEXT } from "../src/fonts/display-text";
import { DICTS } from "../src/i18n";

const root = join(import.meta.dir, "..");
const webDir = join(root, "src", "fonts");
const ogDir = join(import.meta.dir, "fonts");
const manifestFile = join(webDir, "display-chars.json");

const FAMILY = "Chiron GoRound TC";
const LATIN =
  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~" +
  " ©·×–—‘’“”…−";
const UA_WOFF2 =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const uniq = (s: string) => [...new Set(s)].sort().join("");
const cjkOnly = (s: string) =>
  uniq([...s].filter((c) => (c.codePointAt(0) ?? 0) > 0x2e7f).join(""));

const want = {
  "cjk-700": cjkOnly(DISPLAY_TEXT.w700),
  "cjk-900": cjkOnly(DISPLAY_TEXT.w900),
  // Open Graph headline: the page titles.
  "og-900": uniq(
    LATIN +
      Object.values(DICTS)
        .map((t) => t.meta.title)
        .join(""),
  ),
};

async function fetchFont(weight: number, text: string, format: "woff2" | "truetype") {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(FAMILY)}:wght@${weight}&text=${encodeURIComponent(text)}`;
  // Google serves woff2 to current browsers and plain TrueType to clients it does not recognise.
  const css = await fetch(url, {
    headers: { "User-Agent": format === "woff2" ? UA_WOFF2 : "koelony-font-fetch" },
  }).then((r) => {
    if (!r.ok) throw new Error(`Google Fonts CSS ${r.status} for weight ${weight}`);
    return r.text();
  });
  const src = css.match(/url\((https:[^)]+)\)\s*format\('([^']+)'\)/);
  if (!src || src[2] !== format)
    throw new Error(`expected a ${format} file, got: ${css.slice(0, 200)}`);
  const file = await fetch(src[1]);
  if (!file.ok) throw new Error(`font file ${file.status}`);
  return new Uint8Array(await file.arrayBuffer());
}

async function stale(): Promise<string[]> {
  let have: Record<string, string> = {};
  try {
    have = JSON.parse(await readFile(manifestFile, "utf8"));
  } catch {
    return Object.keys(want);
  }
  return Object.entries(want)
    .filter(([key, chars]) => [...chars].some((c) => !(have[key] ?? "").includes(c)))
    .map(([key]) => key);
}

async function refresh() {
  await mkdir(webDir, { recursive: true });
  await mkdir(ogDir, { recursive: true });
  const jobs: [string, Promise<Uint8Array>][] = [
    [join(webDir, "goround-latin-700.woff2"), fetchFont(700, LATIN, "woff2")],
    [join(webDir, "goround-latin-900.woff2"), fetchFont(900, LATIN, "woff2")],
    [join(webDir, "goround-cjk-700.woff2"), fetchFont(700, want["cjk-700"], "woff2")],
    [join(webDir, "goround-cjk-900.woff2"), fetchFont(900, want["cjk-900"], "woff2")],
    [join(ogDir, "goround-og-900.ttf"), fetchFont(900, want["og-900"], "truetype")],
  ];
  for (const [file, job] of jobs) {
    const bytes = await job;
    await writeFile(file, bytes);
    console.log(`${file.replace(`${root}/`, "")}  ${(bytes.length / 1024).toFixed(1)} kB`);
  }
  await writeFile(manifestFile, `${JSON.stringify(want, null, 2)}\n`);
}

if (process.argv.includes("--ensure")) {
  const missing = await stale();
  if (missing.length === 0) process.exit(0);
  console.log(`display font is missing characters for: ${missing.join(", ")}; refetching`);
  try {
    await refresh();
  } catch (error) {
    console.warn(
      `could not refresh the display font (${(error as Error).message}). ` +
        "New characters will show in the system font until `bun run fonts` succeeds.",
    );
  }
} else {
  await refresh();
}
