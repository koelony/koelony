import { mkdir, readFile, writeFile } from "node:fs/promises";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ASR_REPO } from "./src/site.ts";

/**
 * Star count of the ASR repo at build time, baked into the prerendered pages. The browser refreshes
 * it (src/components/Stars.tsx). If GitHub cannot be reached the count is left out, not faked.
 */
const STARS_CACHE = "node_modules/.cache/koelony-asr-stars.json";

/**
 * `bun run build` runs Vite twice (browser, then SSR). Both must bake in the same number or the
 * prerendered page would not match on hydration, so the first fetch is reused for ten minutes.
 */
async function repoStars(): Promise<number | null> {
  try {
    const { n, at } = JSON.parse(await readFile(STARS_CACHE, "utf8"));
    if (Date.now() - at < 10 * 60 * 1000) return n;
  } catch {}
  const n = await fetchStars();
  try {
    await mkdir("node_modules/.cache", { recursive: true });
    await writeFile(STARS_CACHE, JSON.stringify({ n, at: Date.now() }));
  } catch {}
  return n;
}

async function fetchStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${ASR_REPO}`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "koelony-site-build" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { stargazers_count?: unknown };
    return typeof json.stargazers_count === "number" ? json.stargazers_count : null;
  } catch {
    return null;
  }
}

export default defineConfig(async () => ({
  plugins: [react()],
  define: {
    __BUILD_YEAR__: new Date().getFullYear(),
    __ASR_STARS__: JSON.stringify(await repoStars()),
  },
  build: {
    target: "es2022",
    cssMinify: true,
  },
}));
