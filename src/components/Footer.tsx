import type { Dict } from "../i18n";
import { DEMO_URL, LINKS, LOCALES, type Locale } from "../site";
import { Logo } from "./Logo";

export function Footer({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <a className="brand" href={LOCALES[locale].path}>
            <Logo size={28} />
            <span className="brand-word">Koelony</span>
          </a>
          <p>{t.footer.tagline}</p>
          <p className="fine">
            {t.footer.license} {t.footer.madeIn} · © {new Date().getFullYear()} Koelony
          </p>
        </div>
        <nav aria-label={t.footer.links} className="footer-links">
          <a href={LINKS.githubOrg} rel="noopener">
            GitHub · koelony
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
              href={LOCALES[k].path}
              hrefLang={LOCALES[k].hreflang}
              lang={LOCALES[k].htmlLang}
            >
              {LOCALES[k].label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
