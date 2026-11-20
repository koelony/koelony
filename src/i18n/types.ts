export type Status = "released" | "training" | "research";

export type Dict = {
  meta: { title: string; description: string; keywords: string[]; ogAlt: string };
  skip: string;
  nav: {
    asr: string;
    demo: string;
    nest: string;
    name: string;
    github: string;
    switchLabel: string;
    /** Accessible name of the main navigation landmark. */
    primary: string;
  };
  hero: {
    title: string;
    lede: string;
    ctaDemo: string;
    ctaGithub: string;
    /** A code-switched Hong Kong Cantonese sentence, shown as a live "transcript". */
    sample: string;
    /**
     * Jyutping for `sample`, one syllable per Chinese character in order, space-separated (English
     * words are skipped). If the count does not match, the transcript shows without annotations.
     */
    sampleJyutping: string;
    sampleLabel: string;
  };
  name: {
    title: string;
    body: string[];
    /** Caption of the figure that sets the koel's call beside the six Cantonese tones. */
    tonesCaption: string;
  };
  asr: {
    title: string;
    lede: string;
    cards: { size: string; badge: string; title: string; body: string }[];
    /** Headline results, one plain sentence each, every figure inside the sentence it proves. */
    findings: string[];
    formatsTitle: string;
    formatsCols: { repo: string; format: string; size: string; runtime: string };
    benchTitle: string;
    benchCaption: string;
    benchCols: { set: string; stock: string; ours: string; whisper: string };
    benchToggle: { m17: string; m06: string };
    /** Accessible name of the 1.7B / 0.6B switch above the benchmark. */
    benchToggleLabel: string;
    benchNote: string;
    ctaRepo: string;
    ctaHf: string;
  };
  demo: {
    title: string;
    body: string;
    points: string[];
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
  /** The koel that flies around the page. `call` is what it sings, `poke` labels the button on it. */
  koel: { call: string; poke: string };
};
