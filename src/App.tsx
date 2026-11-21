import { type CSSProperties, lazy, Suspense, useEffect, useState } from "react";
import { BRAND } from "./brand";
import { Asr } from "./components/Asr";
import { AsrPage } from "./components/AsrPage";
import { Demo } from "./components/Demo";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Nest } from "./components/Nest";
import { UsedBy } from "./components/UsedBy";
import { DICTS } from "./i18n";
import { KoelSprite } from "./koel/Flock";
import { watchPage } from "./motion";
import { startProgress } from "./progress";
import type { Locale, Page } from "./site";

// The koel (and Motion, which only it uses) is not needed to read the page, so it loads after the
// page has hydrated: the prerendered markup never contains the bird.
const KoelCompanion = lazy(() => import("./koel/Companion"));

function Koel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <KoelCompanion />
    </Suspense>
  );
}

/** The one colour the page takes from the brand folder: the red of the koel's eye. */
const brandVars = { "--brand-red": BRAND.red } as CSSProperties;

export function App({ locale, page = "home" }: { locale: Locale; page?: Page }) {
  const t = DICTS[locale];
  useEffect(() => watchPage(), []);
  useEffect(() => startProgress(), []);
  return (
    <div className="site" style={brandVars}>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <KoelSprite />
      <Header t={t} locale={locale} page={page} />
      <main id="main">
        {page === "asr" ? (
          <AsrPage t={t} />
        ) : (
          <>
            <Hero t={t} />
            <Asr t={t} locale={locale} />
            <Demo t={t} />
            <Nest t={t} locale={locale} />
            <UsedBy t={t} />
          </>
        )}
      </main>
      <Footer t={t} locale={locale} page={page} />
      {/* The koel flies the home page's transcript; other pages have none. */}
      {page === "home" && <Koel />}
    </div>
  );
}
