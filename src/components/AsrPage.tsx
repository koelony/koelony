import { useState } from "react";
import { BENCHMARKS, CHECKPOINTS } from "../data/models";
import type { Dict } from "../i18n";
import { LINKS } from "../site";
import { Size } from "./Asr";
import { Demo } from "./Demo";
import { StarButton } from "./Stars";

type Model = "1.7B" | "0.6B";
const SERIES = ["ours", "stock", "whisper"] as const;
/** Every bar shares one scale, so lengths compare across columns as well as down them. */
const SCALE = Math.max(...BENCHMARKS.map((b) => b.whisper));

function Bench({ t }: { t: Dict["asrPage"] }) {
  const [model, setModel] = useState<Model>("1.7B");
  const rows = BENCHMARKS.map((b) => ({
    set: b.set,
    stock: model === "1.7B" ? b.stock17 : b.stock06,
    ours: model === "1.7B" ? b.ours17 : b.ours06,
    whisper: b.whisper,
  }));
  return (
    <div className="bench">
      <div className="bench-head">
        <fieldset className="toggle">
          <legend className="sr-only">{t.benchToggleLabel}</legend>
          {(["1.7B", "0.6B"] as const).map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={model === size}
              onClick={() => setModel(size)}
            >
              {size === "1.7B" ? t.benchToggle.m17 : t.benchToggle.m06}
            </button>
          ))}
        </fieldset>
        <p className="fine">{t.benchCaption}</p>
      </div>
      <table className="bench-table">
        <caption className="sr-only">
          {t.benchTitle} ({model}). {t.benchCaption}
        </caption>
        <thead>
          <tr>
            <th scope="col">{t.benchCols.set}</th>
            {SERIES.map((k) => (
              <th key={k} scope="col" data-series={k}>
                {t.benchCols[k]}
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
      <p className="fine bench-note">{t.benchNote}</p>
    </div>
  );
}

/** The ASR model's own page: everything the home page leaves out. One button per section. */
export function AsrPage({ t }: { t: Dict }) {
  const p = t.asrPage;
  return (
    <>
      <section className="hero page-head" aria-labelledby="asr-page-title">
        <div className="wrap">
          <h1 id="asr-page-title" className="keep-words">
            {p.title}
          </h1>
          <div className="hero-sub">
            <p className="lede">{p.lede}</p>
            <div className="actions">
              <StarButton t={t} />
            </div>
          </div>
        </div>
      </section>

      <section id="models" className="section" aria-labelledby="models-title" data-watch>
        <div className="wrap">
          <h2 id="models-title">{p.modelsTitle}</h2>
          <ul className="models models-detail" data-watch>
            {p.models.map((m, i) => (
              <li key={m.size} className="model">
                <Size text={m.size} index={i} />
                <h3>
                  {m.title} <span className="model-version">{m.badge}</span>
                </h3>
                <p>{m.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="benchmarks" className="section" aria-labelledby="bench-title" data-watch>
        <div className="wrap">
          <h2 id="bench-title">{p.benchTitle}</h2>
          <ul className="findings">
            {p.findings.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <Bench t={p} />
        </div>
      </section>

      {/* Unnamed on purpose: the table inside is the region named by this heading. */}
      <section id="weights" className="section" data-watch>
        <div className="wrap">
          <h2 id="formats-title">{p.formatsTitle}</h2>
          {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a region that scrolls sideways on phones has to be reachable by keyboard */}
          <section className="table-scroll" aria-labelledby="formats-title" tabIndex={0}>
            <table className="formats">
              <thead>
                <tr>
                  <th scope="col">{p.formatsCols.repo}</th>
                  <th scope="col">{p.formatsCols.format}</th>
                  <th scope="col">{p.formatsCols.size}</th>
                  <th scope="col">{p.formatsCols.runtime}</th>
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
            <a className="btn btn-solid" href={LINKS.hf17} rel="noopener">
              {p.ctaHf}
            </a>
          </div>
        </div>
      </section>

      <Demo t={t} />
    </>
  );
}
