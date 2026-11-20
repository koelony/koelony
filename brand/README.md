# Koelony brand assets

**This folder is the single source of truth for the logo.** Drop the official files here; everything
the website and GitHub need (favicons, app icons, Open Graph images, the header/footer logo, the org
avatar) is generated from them with one command. Nothing under `public/` should be edited by hand.

## What to drop here

All SVGs: plain SVG with a `viewBox`, text converted to outlines (no fonts), no embedded raster
images, no scripts, no external references. Run them through SVGO if possible.

| File                      | Required?    | What it is                                                                                                                                                                                                                 |
| ------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logo-mark.svg`           | **required** | The symbol alone: the black "K" of rounded lobes with the white koel and the red eye. Full colour, **transparent background**, square `viewBox` (e.g. `0 0 512 512`) with about 6–8% padding. Must still read at 16×16 px. |
| `logo-mark-inverse.svg`   | recommended  | Same symbol for **dark backgrounds** (K in paper white, koel knocked out to dark, red eye kept). Same `viewBox` as `logo-mark.svg`.                                                                                        |
| `logo-mark-mono.svg`      | recommended  | One-colour version using **only `fill="currentColor"`** (no other fills), same `viewBox`. The site inlines it so it follows light/dark theme. Red eye may be dropped or kept as `class="eye"`.                             |
| `logo-lockup.svg`         | optional     | Horizontal lockup: mark + "Koelony" wordmark, transparent background.                                                                                                                                                      |
| `logo-lockup-inverse.svg` | optional     | Same lockup for dark backgrounds.                                                                                                                                                                                          |
| `koel.svg`                | optional     | The koel bird on its own (side profile), if the designer drew one. The site animation can use it.                                                                                                                          |
| `colors.json`             | optional     | Brand colours if they differ from the defaults below, e.g. `{ "ink": "#0c0c0c", "paper": "#f4f1ea", "red": "#d0201a" }`.                                                                                                   |
| `source/`                 | optional     | Anything else worth keeping (AI / Figma exports, high-res PNG concepts, alternates). Not read by the build.                                                                                                                |

Several alternates or rounds? Put them in `source/` (e.g. `source/2026-11-21-round2/…`) and copy the
chosen one to the names above. Only the names above are used.

Only have PNGs? Put them in `source/` at **≥ 1024 px, transparent background**; they will be
vectorised into the SVGs above.

## Default palette (from the concept)

| Token | Hex       | Use                     |
| ----- | --------- | ----------------------- |
| ink   | `#0c0c0c` | the K, text             |
| paper | `#f4f1ea` | the koel, background    |
| red   | `#d0201a` | the koel's eye, accents |

## Generating everything

```sh
bun run icons
```

Reads `brand/logo-mark*.svg` and writes:

- `public/favicon.svg`, `public/favicon-32.png`, `public/apple-touch-icon.png` (180),
  `public/icon-192.png`, `public/icon-512.png`
- `public/og-en.png`, `public/og-zh-hk.png` (1200×630 link previews, with the localized title)
- `brand/export/avatar-1024.png`: square avatar for the GitHub and Hugging Face org profiles
  (upload by hand: GitHub → koelony → Settings → Profile picture)

The header and footer inline `logo-lockup.svg` (falling back to `logo-mark-mono.svg`, then
`logo-mark.svg`) and map its three brand colours to the page's theme tokens, so one file serves
light and dark. The perched koel in the page animation is read from `koel.svg`. Both are inlined at
build time (`src/brand.ts`), so replacing a file and running `bun run build` swaps them.
