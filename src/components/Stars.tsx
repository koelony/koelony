import { useEffect, useState } from "react";
import type { Dict } from "../i18n";
import { ASR_REPO, LINKS } from "../site";

const CACHE_KEY = "koelony:asr-stars";
/** GitHub allows 60 unauthenticated API calls an hour per visitor; one an hour is plenty. */
const CACHE_MS = 60 * 60 * 1000;

/** 77 → "77", 1234 → "1.2k". Written out by hand so server and browser format it the same. */
const short = (n: number) =>
  n < 1000 ? String(n) : `${(n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, "")}k`;

function readCache(): number | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { n, at } = JSON.parse(raw) as { n: number; at: number };
    return Date.now() - at < CACHE_MS && typeof n === "number" ? n : null;
  } catch {
    return null;
  }
}

/**
 * The live star count of the ASR repo. Starts at the count from build time (so the prerendered page
 * already shows it), then asks GitHub once an hour at most. Any failure keeps the last good number.
 */
function useStars(): number | null {
  const [stars, setStars] = useState<number | null>(__ASR_STARS__);
  useEffect(() => {
    const cached = readCache();
    if (cached !== null) {
      setStars(cached);
      return;
    }
    const ctl = new AbortController();
    fetch(`https://api.github.com/repos/${ASR_REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: ctl.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { stargazers_count?: unknown } | null) => {
        const n = json?.stargazers_count;
        if (typeof n !== "number") return;
        setStars(n);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ n, at: Date.now() }));
        } catch {}
      })
      .catch(() => {});
    return () => ctl.abort();
  }, []);
  return stars;
}

/** The one button to the ASR repo, with its star count when known. */
export function StarButton({ t }: { t: Dict }) {
  const stars = useStars();
  return (
    <a className="btn btn-solid btn-stars" href={LINKS.asrRepo} rel="noopener">
      <span>{t.repo.cta}</span>
      {stars !== null && (
        <span className="stars">
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M8 1.2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12l-4.2 2.2.8-4.7-3.4-3.3 4.7-.7z" />
          </svg>
          <span aria-hidden="true">{short(stars)}</span>
          <span className="sr-only">{`, ${t.repo.stars.replace("{n}", String(stars))}`}</span>
        </span>
      )}
    </a>
  );
}
