import type { Locale } from "./site";

export const localeFromPath = (pathname: string): Locale =>
  /^\/zh-hk(\/|$)/i.test(pathname) ? "zh-hk" : "en";
