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
  };
  hero: {
    eyebrow: string;
    title: string;
    lede: string;
    ctaDemo: string;
    ctaGithub: string;
    /** A code-switched Hong Kong Cantonese sentence, shown as a live "transcript". */
    sample: string;
    sampleLabel: string;
  };
  name: { kicker: string; title: string; body: string[] };
  asr: {
    kicker: string;
    title: string;
    lede: string;
    cards: { size: string; badge: string; title: string; body: string }[];
    stats: { value: string; label: string }[];
    formatsTitle: string;
    formatsCols: { repo: string; format: string; size: string; runtime: string };
    benchTitle: string;
    benchCaption: string;
    benchCols: { set: string; stock: string; ours: string; whisper: string };
    benchToggle: { m17: string; m06: string };
    benchNote: string;
    ctaRepo: string;
    ctaHf: string;
  };
  demo: {
    kicker: string;
    title: string;
    body: string;
    points: string[];
    cta: string;
    note: string;
  };
  nest: {
    kicker: string;
    title: string;
    lede: string;
    status: Record<Status, string>;
    items: { title: string; status: Status; body: string }[];
  };
  usedBy: { kicker: string; title: string; body: string; cta: string };
  footer: { tagline: string; license: string; madeIn: string; links: string };
};
