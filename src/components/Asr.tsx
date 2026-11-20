import { useState } from "react";
import { BENCHMARKS, CHECKPOINTS } from "../data/models";
import type { Dict } from "../i18n";
import { nudgeKoel } from "../koel/signal";
import { LINKS } from "../site";

type Model = "1.7B" | "0.6B";
const SERIES = ["ours", "stock", "whisper"] as const;
/** Every bar shares one scale, so lengths compare across columns as well as down them. */
const SCALE = Math.max(...BENCHMARKS.map((b) => b.whisper));

export function Asr({ t }: { t: Dict }) {
  const [model, setModel] = useState<Model>("1.7B");
  const rows = BENCHMARKS.map((b) => ({
    set: b.set,
    stock: model === "1.7B" ? b.stock17 : b.stock06,
    ours: model === "1.7B" ? b.ours17 : b.ours06,
    whisper: b.whisper,
  }));
  const choose = (next: Model) => {
    if (next === model) return;
    setModel(next);
    nudgeKoel("bench");
  };

  return (
    <section id="asr" className="section" aria-labelledby="asr-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="asr-title">{t.asr.title}</h2>
          <p className="lede">{t.asr.lede}</p>
        </div>

        <div className="split asr-facts">
          <ul className="models">
            {t.asr.cards.map((c) => (
              <li key={c.size} className="model">
                <p className="model-size">
                  {c.size}
                  <span className="model-version">{c.badge}</span>
                </p>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </li>
            ))}
          </ul>
          <ul className="findings">
            {t.asr.findings.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="bench" data-perch="bench">
          <div className="bench-head">
            <h3>{t.asr.benchTitle}</h3>
            <fieldset className="toggle">
              <legend className="sr-only">{t.asr.benchToggleLabel}</legend>
              {(["1.7B", "0.6B"] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={model === size}
                  onClick={() => choose(size)}
                >
                  {size === "1.7B" ? t.asr.benchToggle.m17 : t.asr.benchToggle.m06}
                </button>
              ))}
            </fieldset>
            <p className="fine">{t.asr.benchCaption}</p>
          </div>
          <table className="bench-table">
            <caption className="sr-only">
              {t.asr.benchTitle} ({model}). {t.asr.benchCaption}
            </caption>
            <thead>
              <tr>
                <th scope="col">{t.asr.benchCols.set}</th>
                {SERIES.map((k) => (
                  <th key={k} scope="col" data-series={k}>
                    {t.asr.benchCols[k]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.set}>
                  <th scope="row">{r.set}</th>
                  {SERIES.map((k) => (
                    <td key={k} data-series={k}>
                      <span className="bar-track">
                        <span
                          className="bar"
                          style={{ transform: `scaleX(${(r[k] / SCALE).toFixed(4)})` }}
                        />
                      </span>
                      <span className="num">{r[k].toFixed(2)}%</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="fine bench-note">{t.asr.benchNote}</p>
        </div>

        <h3 id="formats-title" className="table-title">
          {t.asr.formatsTitle}
        </h3>
        {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a region that scrolls sideways on phones has to be reachable by keyboard */}
        <section className="table-scroll" aria-labelledby="formats-title" tabIndex={0}>
          <table className="formats">
            <thead>
              <tr>
                <th scope="col">{t.asr.formatsCols.repo}</th>
                <th scope="col">{t.asr.formatsCols.format}</th>
                <th scope="col">{t.asr.formatsCols.size}</th>
                <th scope="col">{t.asr.formatsCols.runtime}</th>
              </tr>
            </thead>
            <tbody>
              {CHECKPOINTS.map((c) => (
                <tr key={c.repo}>
                  <th scope="row">
                    <a href={c.url} rel="noopener">
                      {c.repo}
                    </a>
                  </th>
                  <td>{c.format}</td>
                  <td className="nowrap">{c.size}</td>
                  <td>{c.runtime.split(" · ").join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="actions">
          <a className="btn btn-solid" href={LINKS.asrRepo} rel="noopener">
            {t.asr.ctaRepo}
          </a>
          <a className="btn btn-line" href={LINKS.hf17} rel="noopener">
            {t.asr.ctaHf}
          </a>
        </div>
      </div>
    </section>
  );
}
