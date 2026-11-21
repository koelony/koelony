import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { DICTS } from "./i18n";
import { localeFromPath, pageFromPath } from "./locale";
import "./styles.css";

const locale = localeFromPath(window.location.pathname);
const page = pageFromPath(window.location.pathname);

// Start fetching the deferred chunk now, so the koel is ready as soon as the page has hydrated.
if (page === "home") void import("./koel/Companion");

const root = document.getElementById("root");
if (!root) throw new Error("#root missing");

const app = (
  <StrictMode>
    <App locale={locale} page={page} />
  </StrictMode>
);

// Production pages are prerendered (scripts/prerender.ts), so hydrate them; the dev server renders fresh.
if (root.firstElementChild) {
  hydrateRoot(root, app);
} else {
  document.title = (page === "asr" ? DICTS[locale].asrPage.meta : DICTS[locale].meta).title;
  createRoot(root).render(app);
}
