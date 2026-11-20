/** Site-wide constants. Change a URL here and every page, link and SEO tag follows. */
export const SITE_URL = "https://koelony.com";
export const SITE_NAME = "Koelony";

/**
 * In-browser demo of the 0.6B model. Once `demo.koelony.com` redirects (see README),
 * point this at it instead.
 */
export const DEMO_URL = "https://hkasr.joe2643.work";

export const LINKS = {
  githubOrg: "https://github.com/koelony",
  asrRepo: "https://github.com/joe2643/qwen3-asr-cantonese-hk",
  hf17: "https://huggingface.co/joe2643/Qwen3-ASR-1.7B-Cantonese-HK",
  hf06: "https://huggingface.co/joe2643/Qwen3-ASR-0.6B-Cantonese-HK",
  oratype: "https://github.com/sennett-lau/oratype",
  oratypeSite: "https://oratype.sennettlau.me",
} as const;

export type Locale = "en" | "zh-hk";

export const LOCALES: Record<
  Locale,
  { path: string; htmlLang: string; hreflang: string; ogLocale: string; label: string }
> = {
  en: { path: "/", htmlLang: "en", hreflang: "en", ogLocale: "en_US", label: "English" },
  "zh-hk": {
    path: "/zh-hk/",
    htmlLang: "zh-Hant-HK",
    hreflang: "zh-HK",
    ogLocale: "zh_HK",
    label: "廣東話",
  },
};

export const DEFAULT_LOCALE: Locale = "en";
