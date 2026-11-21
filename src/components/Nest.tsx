import type { CSSProperties } from "react";
import type { Dict } from "../i18n";
import type { Status } from "../i18n/types";
import { type Locale, pagePath } from "../site";

/** Left to right on the track: how far each model has come. */
const STAGES: Status[] = ["research", "training", "released"];

/**
 * The roadmap as a progress track. Every model has a line from the left edge to the stage it has
 * reached, ending in a dot: red while it is live (released or training), an open ring in research.
 * Furthest along first, so the lines step down like a staircase.
 */
export function Nest({ t, locale }: { t: Dict; locale: Locale }) {
  const items = [...t.nest.items].sort(
    (a, b) => STAGES.indexOf(b.status) - STAGES.indexOf(a.status),
  );
  return (
    <section id="nest" className="section" aria-labelledby="nest-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="nest-title">{t.nest.title}</h2>
          <p className="lede">{t.nest.lede}</p>
        </div>
        <div className="roadmap" data-watch>
          <div className="roadmap-stages" aria-hidden="true">
            <div className="stage-labels">
              {STAGES.map((s) => (
                <span key={s}>{t.nest.status[s]}</span>
              ))}
            </div>
          </div>
          <ul className="roadmap-list">
            {items.map((it, i) => (
              <li
                key={it.title}
                className={`stage-${it.status}`}
                style={{ "--i": i, "--stage": STAGES.indexOf(it.status) } as CSSProperties}
              >
                <div className="roadmap-text">
                  <h3>{it.page ? <a href={pagePath(locale, it.page)}>{it.title}</a> : it.title}</h3>
                  <p>{it.body}</p>
                  <p className="sr-only">{t.nest.status[it.status]}</p>
                </div>
                <div className="track" aria-hidden="true">
                  <span className="track-line" />
                  <span className="track-dot" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
