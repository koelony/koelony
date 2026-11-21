import type { Dict } from "../i18n";
import { LINKS, LOCALES, type Locale, type Page, pagePath } from "../site";
import { Logo } from "./Logo";

export function Header({ t, locale, page }: { t: Dict; locale: Locale; page: Page }) {
  const other: Locale = locale === "en" ? "zh-hk" : "en";
  // Both pages carry the demo band; the roadmap is only on the home page.
  const home = page === "home" ? "" : LOCALES[locale].path;
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <a className="brand" href={LOCALES[locale].path}>
          <Logo height={36} />
        </a>
        <nav aria-label={t.nav.primary} className="nav">
          <a href={pagePath(locale, "asr")} aria-current={page === "asr" ? "page" : undefined}>
            {t.nav.asr}
          </a>
          <a href="#demo">{t.nav.demo}</a>
          <a href={`${home}#nest`}>{t.nav.nest}</a>
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
