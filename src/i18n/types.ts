export type Status = "released" | "training" | "research";

export type Dict = {
  meta: { title: string; description: string; keywords: string[]; ogAlt: string };
  skip: string;
  nav: {
    asr: string;
    demo: string;
    nest: string;
    github: string;
    switchLabel: string;
    /** Accessible name of the main navigation landmark. */
    primary: string;
  };
  hero: {
    title: string;
    lede: string;
    ctaDemo: string;
    /** A code-switched Hong Kong Cantonese sentence, shown as a live "transcript". */
    sample: string;
    /**
     * Jyutping for `sample`, one syllable per Chinese character in order, space-separated (English
     * words are skipped). If the count does not match, the transcript shows without annotations.
     */
    sampleJyutping: string;
    sampleLabel: string;
  };
  asr: {
    title: string;
    lede: string;
    /** One line per model size. */
    cards: { size: string; title: string }[];
    /** Text link to the ASR page, under the section's one button. */
    more: string;
  };
  /** The button to the ASR repo that shows its GitHub star count. */
  repo: {
    cta: string;
    /** Read out after the label, e.g. "77 stars". `{n}` is replaced by the count. */
    stars: string;
  };
  /** The ASR model's own page (`/asr/`, `/zh-hk/asr/`). */
  asrPage: {
    meta: { title: string; description: string; keywords: string[]; ogAlt: string };
    title: string;
    lede: string;
    modelsTitle: string;
    models: { size: string; badge: string; title: string; body: string }[];
    benchTitle: string;
    /** Headline results, one plain sentence each, every figure inside the sentence it proves. */
    findings: string[];
    benchCaption: string;
    benchCols: { set: string; stock: string; ours: string; whisper: string };
    benchToggle: { m17: string; m06: string };
    /** Accessible name of the 1.7B / 0.6B switch above the benchmark. */
    benchToggleLabel: string;
    benchNote: string;
    formatsTitle: string;
    formatsCols: { repo: string; format: string; size: string; runtime: string };
    ctaHf: string;
  };
  demo: {
    title: string;
    body: string;
    cta: string;
    note: string;
  };
  nest: {
    title: string;
    lede: string;
    status: Record<Status, string>;
    items: { title: string; status: Status; body: string }[];
  };
  usedBy: { title: string; body: string; cta: string };
  footer: { tagline: string; license: string; links: string };
};
