import type { Dict } from "../i18n";
import { HEADER } from "../koel/colony";
import { Roost } from "../koel/Flock";
import { DEMO_URL, LINKS, LOCALES, type Locale, type Page, pagePath } from "../site";
import { Logo } from "./Logo";

export function Header({ t, locale, page }: { t: Dict; locale: Locale; page: Page }) {
  const other: Locale = locale === "en" ? "zh-hk" : "en";
  // The roadmap is only on the home page; the demo opens directly.
  const home = page === "home" ? "" : LOCALES[locale].path;
  return (
    <header className="site-header">
      <Roost on="floor" birds={HEADER} />
      {/* How far down the page the reader is: the header's own rule, inked as they go (progress.ts). */}
      <span className="read-progress" aria-hidden="true" />
      <div className="wrap header-row">
        <a className="brand" href={LOCALES[locale].path}>
          <Logo height={36} />
        </a>
        <nav aria-label={t.nav.primary} className="nav">
          <a
            href={pagePath(locale, "asr")}
            aria-current={page === "asr" ? "page" : undefined}
            data-section="asr"
          >
            {t.nav.asr}
          </a>
          <a href={DEMO_URL} rel="noopener">
            {t.nav.demo}
          </a>
          <a href={`${home}#nest`} data-section="nest">
            {t.nav.nest}
          </a>
          <a href={LINKS.githubOrg} rel="noopener">
            {t.nav.github}
          </a>
        </nav>
        <a
          className="lang"
          href={pagePath(other, page)}
          hrefLang={LOCALES[other].hreflang}
          lang={LOCALES[other].htmlLang}
          aria-label={`${t.nav.switchLabel}: ${LOCALES[other].label}`}
        >
          {LOCALES[other].label}
        </a>
      </div>
    </header>
  );
}
