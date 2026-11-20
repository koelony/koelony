import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import type { Locale } from "./site";

export { buildHead } from "./seo";
export { LOCALES, SITE_URL } from "./site";

export function render(locale: Locale): string {
  return renderToString(
    <StrictMode>
      <App locale={locale} />
    </StrictMode>,
  );
}
