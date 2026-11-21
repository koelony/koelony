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
  asr: {
    title: string;
    lede: string;
    /** One line per model size. */
    cards: { size: string; title: string }[];
    ctaRepo: string;
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
