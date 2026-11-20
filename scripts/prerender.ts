/**
 * Static site generation: renders every locale to its own HTML file after `vite build`, so crawlers
 * and link previews get the full page, title, description, hreflang and JSON-LD without running JS.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { Locale } from "../src/site";

const root = join(import.meta.dir, "..");
const dist = join(root, "dist");
const ssr = await import(join(root, "dist-ssr", "entry-server.js"));
const { render, buildHead, LOCALES, SITE_URL } = ssr as typeof import("../src/entry-server");

const template = await readFile(join(dist, "index.html"), "utf8");
const locales = Object.keys(LOCALES) as Locale[];

const page = (locale: Locale, extraHead = "") =>
  template
    .replace('<html lang="en">', `<html lang="${LOCALES[locale].htmlLang}">`)
    .replace("<!--app-head-->", `${buildHead(locale)}${extraHead}`)
    .replace("<!--app-html-->", render(locale));

for (const locale of locales) {
  const file = join(dist, LOCALES[locale].path, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page(locale));
  console.log(`prerendered ${LOCALES[locale].path}`);
}

// Served by Cloudflare for unknown paths (wrangler.jsonc: not_found_handling = "404-page").
await writeFile(
  join(dist, "404.html"),
  page("en", '\n    <meta name="robots" content="noindex" />').replace(
    /<link rel="canonical"[^>]*>/,
    "",
  ),
);

const today = new Date().toISOString().slice(0, 10);
const alternates = locales
  .map(
    (k) =>
      `    <xhtml:link rel="alternate" hreflang="${LOCALES[k].hreflang}" href="${SITE_URL}${LOCALES[k].path}" />`,
  )
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`)
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${locales
  .map(
    (k) => `  <url>
    <loc>${SITE_URL}${LOCALES[k].path}</loc>
    <lastmod>${today}</lastmod>
${alternates}
  </url>`,
  )
  .join("\n")}
</urlset>
`;
await writeFile(join(dist, "sitemap.xml"), sitemap);
await rm(join(root, "dist-ssr"), { recursive: true, force: true });
console.log("wrote 404.html, sitemap.xml");
