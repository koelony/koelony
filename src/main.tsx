import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { DICTS } from "./i18n";
import { localeFromPath } from "./locale";
import "./styles.css";

// Start fetching the deferred chunk now, so the koel is ready as soon as the page has hydrated.
void import("./koel/Companion");

const locale = localeFromPath(window.location.pathname);
const root = document.getElementById("root");
if (!root) throw new Error("#root missing");

const app = (
  <StrictMode>
    <App locale={locale} />
  </StrictMode>
);

// Production pages are prerendered (scripts/prerender.ts), so hydrate them; the dev server renders fresh.
if (root.firstElementChild) {
  hydrateRoot(root, app);
} else {
  document.title = DICTS[locale].meta.title;
  createRoot(root).render(app);
}
