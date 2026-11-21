import type { Locale, Page } from "./site";

export const localeFromPath = (pathname: string): Locale =>
  /^\/zh-hk(\/|$)/i.test(pathname) ? "zh-hk" : "en";

export const pageFromPath = (pathname: string): Page =>
  /^(\/zh-hk)?\/asr(\/|$)/i.test(pathname) ? "asr" : "home";
