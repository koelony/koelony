import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import type { Locale, Page } from "./site";

export { buildHead } from "./seo";
export { LOCALES, PAGES, pagePath, SITE_URL } from "./site";

export function render(locale: Locale, page: Page = "home"): string {
  return renderToString(
    <StrictMode>
      <App locale={locale} page={page} />
    </StrictMode>,
  );
}
