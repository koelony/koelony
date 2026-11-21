import type { Dict } from "./types";

export const en: Dict = {
  meta: {
    title: "Koelony: open AI models for Hong Kong Cantonese",
    description:
      "Open speech and language models for Hong Kong Cantonese. Qwen3-ASR fine-tunes (1.7B, 0.6B) that write colloquial Cantonese and keep English in English. GGUF, FP8 and NVFP4 builds.",
    keywords: [
      "Cantonese ASR",
      "Hong Kong Cantonese",
      "speech recognition",
      "Qwen3-ASR",
      "Cantonese speech to text",
      "code-switching",
      "GGUF",
      "open source AI",
      "廣東話語音識別",
    ],
    ogAlt: "Koelony: open AI models for Hong Kong Cantonese",
  },
  skip: "Skip to content",
  nav: {
    asr: "ASR",
    demo: "Demo",
    nest: "Roadmap",
    github: "GitHub",
    switchLabel: "Switch language",
    primary: "Main",
  },
  hero: {
    title: "Cantonese, written the way Hong Kong speaks it.",
    lede: "Koelony is a team in Hong Kong building open speech and language models for Cantonese. First up is speech recognition, free on Hugging Face.",
    ctaDemo: "Try the 0.6B demo",
    ctaGithub: "Open the ASR repo",
    sample: "今朝喺地鐵站等咗成粒鐘，個 schedule 完全 delay 晒。",
    sampleJyutping:
      "gam1 ziu1 hai2 dei6 tit3 zaam6 dang2 zo2 seng4 nap1 zung1 go3 jyun4 cyun4 saai3",
    sampleLabel: "Transcribed by Qwen3-ASR Cantonese HK",
  },
  asr: {
    title: "Qwen3-ASR, fine-tuned for Hong Kong Cantonese",
    lede: "It writes the characters Hong Kong people actually say (係, 喺, 嘅, 咗) and keeps English words in English. On mixed Cantonese and English speech it makes fewer than half the errors of the stock model.",
    cards: [
      { size: "1.7B", title: "Most accurate, for desktops and servers" },
      { size: "0.6B", title: "Small enough to run in a browser" },
    ],
    ctaRepo: "Benchmarks and model card",
    ctaHf: "Download on Hugging Face",
  },
  demo: {
    title: "Runs entirely in your browser.",
    body: "Try the 0.6B model without installing anything. Record from your mic or drop in an audio file; nothing is uploaded.",
    cta: "Open the demo",
    note: "The first visit downloads about 1.2 GB. Works best in desktop Chrome or Edge.",
  },
  nest: {
    title: "Models in progress",
    lede: "Speech recognition is the first release. These come next.",
    status: { released: "Released", training: "In training", research: "Research" },
    items: [
      {
        title: "Cantonese text-to-speech",
        status: "training",
        body: "Hong Kong voices that get all six tones right.",
      },
      {
        title: "Tone & Jyutping judge",
        status: "research",
        body: "Scores pronunciation syllable by syllable.",
      },
      {
        title: "G2P: characters to Jyutping",
        status: "research",
        body: "Written Cantonese to Jyutping, polyphones included.",
      },
      {
        title: "Embeddings & HK-Bench",
        status: "training",
        body: "Search and retrieval for Cantonese and mixed text, with our own benchmark.",
      },
      {
        title: "Tiny on-device ASR",
        status: "research",
        body: "For devices too small for the 0.6B model.",
      },
    ],
  },
  usedBy: {
    title: "Used in OraType",
    body: "OraType, a free and open-source voice typing app for macOS, ships our GGUF model as its built-in Cantonese speech engine.",
    cta: "See OraType",
  },
  footer: {
    tagline: "Open AI models for Hong Kong Cantonese.",
    license: "Models released under Apache-2.0.",
    links: "Links",
  },
};
