import { type CSSProperties, lazy, Suspense, useEffect, useState } from "react";
import { BRAND } from "./brand";
import { Asr } from "./components/Asr";
import { Demo } from "./components/Demo";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NameStory } from "./components/NameStory";
import { Nest } from "./components/Nest";
import { UsedBy } from "./components/UsedBy";
import { DICTS, type Dict } from "./i18n";
import type { Locale } from "./site";

// The koel (and Motion, which only it uses) is not needed to read the page, so it loads after the
// page has hydrated: the prerendered markup never contains the bird.
const KoelCompanion = lazy(() => import("./koel/Companion"));

function Koel({ t }: { t: Dict }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <KoelCompanion t={t} />
    </Suspense>
  );
}

/** The one colour the page takes from the brand folder: the red of the koel's eye. */
const brandVars = { "--brand-red": BRAND.red } as CSSProperties;

export function App({ locale }: { locale: Locale }) {
  const t = DICTS[locale];
  return (
    <div className="site" style={brandVars}>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <Header t={t} locale={locale} />
      <main id="main">
        <Hero t={t} />
        <Asr t={t} />
        <Demo t={t} />
        <Nest t={t} />
        <UsedBy t={t} />
        <NameStory t={t} />
      </main>
      <Footer t={t} locale={locale} />
      <Koel t={t} />
    </div>
  );
}
