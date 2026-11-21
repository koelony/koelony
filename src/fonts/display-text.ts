import type { Dict } from "../i18n";
import { DICTS } from "../i18n";
import { LOCALES, SITE_NAME } from "../site";

/**
 * Which copy is set in the display face (Chiron GoRound TC), per weight. `scripts/fonts.ts` subsets
 * the font to exactly these characters, so headings in new wording need `bun run fonts` (the build
 * runs it for you when something is missing).
 */
const heavy = (t: Dict): string[] => [
  t.hero.title,
  t.asr.title,
  t.demo.title,
  t.nest.title,
  t.usedBy.title,
  t.asrPage.title,
  t.asrPage.modelsTitle,
  t.asrPage.benchTitle,
  t.asrPage.formatsTitle,
];

const bold = (t: Dict): string[] => [
  t.hero.sample,
  t.hero.ctaDemo,
  ...t.asr.cards.map((c) => c.size),
  t.repo.cta,
  "0123456789.k",
  ...t.asrPage.models.flatMap((m) => [m.size, m.badge, m.title]),
  t.asrPage.benchToggle.m17,
  t.asrPage.benchToggle.m06,
  t.asrPage.ctaHf,
  t.demo.cta,
  ...t.nest.items.map((i) => i.title),
  t.usedBy.cta,
  ...Object.values(t.nav),
];

const all = (pick: (t: Dict) => string[]) => Object.values(DICTS).flatMap(pick).join("");

export const DISPLAY_TEXT = {
  w900: all(heavy) + SITE_NAME,
  w700:
    all(bold) +
    Object.values(LOCALES)
      .map((l) => l.label)
      .join(""),
};
