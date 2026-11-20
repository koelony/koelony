import { useState } from "react";
import { BENCHMARKS, CHECKPOINTS } from "../data/models";
import type { Dict } from "../i18n";
import { LINKS } from "../site";

type Model = "1.7B" | "0.6B";

export function Asr({ t }: { t: Dict }) {
  const [model, setModel] = useState<Model>("1.7B");
  const rows = BENCHMARKS.map((b) => ({
    set: b.set,
    stock: model === "1.7B" ? b.stock17 : b.stock06,
    ours: model === "1.7B" ? b.ours17 : b.ours06,
    whisper: b.whisper,
  }));
  const max = Math.max(...rows.map((r) => r.whisper));

  return (
    <section id="asr" className="section" aria-labelledby="asr-title">
      <div className="container">
        <p className="kicker">{t.asr.kicker}</p>
        <h2 id="asr-title">{t.asr.title}</h2>
        <p className="lede">{t.asr.lede}</p>

        <div className="cards">
          {t.asr.cards.map((c) => (
            <article key={c.size} className="card model-card">
              <p className="model-size">
                {c.size} <span className="badge">{c.badge}</span>
              </p>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </article>
          ))}
        </div>

        <ul className="stats">
          {t.asr.stats.map((s) => (
            <li key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>

        <div className="bench">
          <div className="bench-head">
            <h3>{t.asr.benchTitle}</h3>
            <fieldset className="toggle">
              <legend className="sr-only">{t.asr.benchTitle}</legend>
              {(["1.7B", "0.6B"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={model === m}
                  onClick={() => setModel(m)}
                >
                  {m === "1.7B" ? t.asr.benchToggle.m17 : t.asr.benchToggle.m06}
                </button>
              ))}
            </fieldset>
          </div>
          <table className="bench-table">
            <caption>
              {t.asr.benchTitle} ({model}). {t.asr.benchCaption}
            </caption>
            <thead>
              <tr>
                <th scope="col">{t.asr.benchCols.set}</th>
                <th scope="col">{t.asr.benchCols.ours}</th>
                <th scope="col">{t.asr.benchCols.stock}</th>
                <th scope="col">{t.asr.benchCols.whisper}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.set}>
                  <th scope="row">{r.set}</th>
                  {(["ours", "stock", "whisper"] as const).map((k) => (
                    <td key={k} data-series={k}>
                      <span className="bar" style={{ width: `${(r[k] / max) * 100}%` }} />
                      <span className="num">{r[k].toFixed(2)}%</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="fine">{t.asr.benchNote}</p>
        </div>

        <h3 className="table-title">{t.asr.formatsTitle}</h3>
        <div className="table-scroll">
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
                  <td>{c.runtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cta-row">
          <a className="btn btn-primary" href={LINKS.asrRepo} rel="noopener">
            {t.asr.ctaRepo}
          </a>
          <a className="btn btn-ghost" href={LINKS.hf17} rel="noopener">
            {t.asr.ctaHf}
          </a>
        </div>
      </div>
    </section>
  );
}
