import type { Dict } from "../i18n";
import { LINKS, LOCALES, type Locale } from "../site";
import { Logo } from "./Logo";

export function Header({ t, locale }: { t: Dict; locale: Locale }) {
  const other: Locale = locale === "en" ? "zh-hk" : "en";
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href={LOCALES[locale].path} aria-label="Koelony">
          <Logo size={30} />
          <span className="brand-word">Koelony</span>
        </a>
        <nav aria-label="Primary" className="nav">
          <a href="#asr">{t.nav.asr}</a>
          <a href="#demo">{t.nav.demo}</a>
          <a href="#nest">{t.nav.nest}</a>
          <a href="#name">{t.nav.name}</a>
          <a href={LINKS.githubOrg} rel="noopener">
            {t.nav.github}
          </a>
        </nav>
        <a
          className="lang-switch"
          href={LOCALES[other].path}
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
