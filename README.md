# koelony.com

Source of [koelony.com](https://koelony.com), the site of **Koelony**: open-source models for Hong Kong Cantonese.

English lives at `/`, Hong Kong Cantonese at `/zh-hk/`. Both are prerendered to static HTML at build
time (full content, `hreflang`, Open Graph and JSON-LD in the HTML), then hydrated by React.

## Stack

Vite, React, TypeScript, [Motion](https://motion.dev) (Framer Motion), Biome and Bun, deployed as
Cloudflare Workers static assets. Display type is Chiron GoRound TC, self-hosted and subset.

## Develop

```sh
bun install
bun run dev        # http://localhost:5173  (/zh-hk/ for Cantonese)
bun run check      # biome + tsc + production build
bun run build      # dist/: index.html, zh-hk/index.html, 404.html, sitemap.xml
bun run preview    # serve dist/ on http://127.0.0.1:4173
bun run icons      # favicons, app icons, OG images and the org avatar, from brand/
bun run fonts      # re-subset the display font to the characters the headings use
```

`bun run build` runs `fonts` itself when a heading uses a character the font subset lacks.

## Where things are

| Path                                  | What                                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `src/i18n/en.ts`, `src/i18n/zh-hk.ts` | All copy. Add a string to both, and to `src/i18n/types.ts`                                              |
| `src/data/models.ts`                  | Checkpoints and benchmark numbers shown on the ASR page (`/asr/`, `src/components/AsrPage.tsx`)         |
| `src/components/Stars.tsx`            | The ASR repo button with its GitHub star count (fetched at build, refreshed in the browser)             |
| `src/data/tones.ts`                   | The six Cantonese tones and their pitch contours                                                        |
| `src/koel/`                           | The flying koel: artwork, perches, flight along the tone staff, its call written on the staff           |
| `src/koel/colony.ts`                  | Where every little koel of the colony stands (drawn by `Flock.tsx`, moved by `src/styles.css`)          |
| `src/motion.ts`                       | Marks what the reader has reached; the Motion block in `src/styles.css` moves it                        |
| `src/components/Tape.tsx`             | The demo band's tape: sound arriving as ticks and leaving as tone contours                              |
| `brand/`                              | Official logo files; everything visual is generated from them (see `brand/README.md`)                   |
| `src/site.ts`                         | URLs (demo, repos, Hugging Face) and locale table                                                       |
| `src/seo.ts`                          | Per-language `<head>`: title, description, canonical, hreflang, OG, JSON-LD                             |
| `scripts/prerender.ts`                | Static generation of every locale, `404.html` and `sitemap.xml`                                         |
| `public/_redirects`                   | Short links: `/demo`, `/github`, `/hf`. (`/asr/` is a real page now: the ASR model page)                |
| `github/profile/README.md`            | Source of the GitHub org profile (published in [`koelony/.github`](https://github.com/koelony/.github)) |

Adding a language: add a dictionary in `src/i18n/`, an entry in `LOCALES` in `src/site.ts` and a
branch in `src/locale.ts`. The prerender, sitemap and hreflang tags pick it up.

## Deploy (Cloudflare)

`wrangler.jsonc` deploys `dist/` as Workers static assets on `koelony.com` and `www.koelony.com`.

- **Git integration (recommended):** Cloudflare dashboard → Workers & Pages → Create → Import a
  repository → `koelony/koelony`. Build command `bun run build`, deploy command `bunx wrangler deploy`.
  Every push to `main` deploys; pull requests get preview URLs.
- **From a laptop:** `bunx wrangler login`, then `bun run deploy`.
- **Always-on preview:** `bun run deploy:preview` publishes the current build to
  <https://koelony-preview.koelony-site.workers.dev> (`wrangler.preview.jsonc`: no routes, so it never
  touches koelony.com; pages keep their koelony.com canonical links).

The domain's current redirect (to `koelony-com.l.ink`) and any existing `koelony.com` / `www` DNS
records must be removed first, or the custom domain will not attach.

### Demo subdomain

`https://koelony.com/demo` already redirects to the 0.6B browser demo via `public/_redirects`.
For `demo.koelony.com`: add a proxied DNS record `demo` → `AAAA 100::`, then Rules → Redirect Rules →
"hostname equals `demo.koelony.com`" → static 302 to `https://hkasr.joe2643.work`, preserving the query
string. Then set `DEMO_URL` in `src/site.ts` to `https://demo.koelony.com`.
