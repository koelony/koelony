import { DICTS } from "./i18n";
import { DEFAULT_LOCALE, LINKS, LOCALES, type Locale, SITE_NAME, SITE_URL } from "./site";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const pageUrl = (locale: Locale) => `${SITE_URL}${LOCALES[locale].path}`;

/** Every <head> tag that differs per language. Emitted at build time by scripts/prerender.ts. */
export function buildHead(locale: Locale): string {
  const t = DICTS[locale].meta;
  const l = LOCALES[locale];
  const url = pageUrl(locale);
  const og = `${SITE_URL}/og-${locale}.png`;

  const alternates = (Object.keys(LOCALES) as Locale[])
    .map((k) => `<link rel="alternate" hreflang="${LOCALES[k].hreflang}" href="${pageUrl(k)}" />`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${pageUrl(DEFAULT_LOCALE)}" />`);

  const otherLocales = (Object.keys(LOCALES) as Locale[])
    .filter((k) => k !== locale)
    .map((k) => `<meta property="og:locale:alternate" content="${LOCALES[k].ogLocale}" />`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon-512.png`,
        description: DICTS.en.footer.tagline,
        foundingLocation: { "@type": "Place", name: "Hong Kong" },
        sameAs: [LINKS.githubOrg, LINKS.asrRepo],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#org` },
        inLanguage: Object.values(LOCALES).map((x) => x.htmlLang),
      },
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: t.title,
        description: t.description,
        inLanguage: l.htmlLang,
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "SoftwareSourceCode",
        name: "Qwen3-ASR Cantonese (Hong Kong)",
        description:
          "Fine-tunes of Qwen3-ASR 1.7B and 0.6B for Hong Kong colloquial Cantonese with English code-switching.",
        codeRepository: LINKS.asrRepo,
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        programmingLanguage: "Python",
        sameAs: [LINKS.hf17, LINKS.hf06],
        publisher: { "@id": `${SITE_URL}/#org` },
      },
    ],
  };

  return [
    `<title>${esc(t.title)}</title>`,
    `<meta name="description" content="${esc(t.description)}" />`,
    `<meta name="keywords" content="${esc(t.keywords.join(", "))}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...alternates,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${esc(t.title)}" />`,
    `<meta property="og:description" content="${esc(t.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${og}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(t.ogAlt)}" />`,
    `<meta property="og:locale" content="${l.ogLocale}" />`,
    ...otherLocales,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(t.title)}" />`,
    `<meta name="twitter:description" content="${esc(t.description)}" />`,
    `<meta name="twitter:image" content="${og}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
}
