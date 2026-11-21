import type { Dict } from "../i18n";
import { CHORUS } from "../koel/colony";
import { Roost } from "../koel/Flock";
import { DEMO_URL, LINKS, LOCALES, type Locale, type Page, pagePath, SITE_NAME } from "../site";
import { Logo } from "./Logo";

export function Footer({ t, locale, page }: { t: Dict; locale: Locale; page: Page }) {
  return (
    <footer className="site-footer" data-watch>
      <div className="wrap footer-grid">
        <div className="footer-about">
          <a className="brand" href={LOCALES[locale].path}>
            <Logo height={44} />
          </a>
          <p>{t.footer.tagline}</p>
        </div>
        <nav aria-label={t.footer.links} className="footer-links">
          <a href={LINKS.githubOrg} rel="noopener">
            {t.nav.github}
          </a>
          <a href={LINKS.asrRepo} rel="noopener">
            qwen3-asr-cantonese-hk
          </a>
          <a href={LINKS.hf17} rel="noopener">
            Hugging Face
          </a>
          <a href={DEMO_URL} rel="noopener">
            {t.nav.demo}
          </a>
          {(Object.keys(LOCALES) as Locale[]).map((k) => (
            <a
              key={k}
              href={pagePath(k, page)}
              hrefLang={LOCALES[k].hreflang}
              lang={LOCALES[k].htmlLang}
              aria-current={k === locale ? "page" : undefined}
            >
              {LOCALES[k].label}
            </a>
          ))}
        </nav>
        <ul className="footer-fine">
          <li>{t.footer.license}</li>
          <li>
            © {__BUILD_YEAR__} {SITE_NAME}
          </li>
        </ul>
      </div>
      {/* The page ends as it began, on a staff: this one has the whole colony on it. */}
      <div className="chorus" aria-hidden="true">
        <Roost on="staff" birds={CHORUS} />
      </div>
    </footer>
  );
}
