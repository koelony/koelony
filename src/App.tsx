import { Asr } from "./components/Asr";
import { Demo } from "./components/Demo";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NameStory } from "./components/NameStory";
import { Nest } from "./components/Nest";
import { UsedBy } from "./components/UsedBy";
import { DICTS } from "./i18n";
import type { Locale } from "./site";

export function App({ locale }: { locale: Locale }) {
  const t = DICTS[locale];
  return (
    <>
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
    </>
  );
}
