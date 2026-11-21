import type { Dict } from "./types";

export const en: Dict = {
  meta: {
    title: "Koelony: open-source models for Hong Kong Cantonese",
    description:
      "Open-source speech and language models for Hong Kong Cantonese. Qwen3-ASR fine-tunes (1.7B, 0.6B) that write colloquial Cantonese and keep English in English. GGUF, FP8 and NVFP4 builds.",
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
    ogAlt: "Koelony: open-source models for Hong Kong Cantonese",
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
    lede: "Koelony is a team based in Hong Kong, founded to build open-source speech and language models specifically for Hong Kong Cantonese. First up is speech recognition, free on Hugging Face.",
    ctaDemo: "Try the 0.6B demo",
    sample: "今朝喺地鐵站等咗成粒鐘，個 schedule 完全 delay 晒。",
    sampleJyutping:
      "gam1 ziu1 hai2 dei6 tit3 zaam6 dang2 zo2 seng4 nap1 zung1 go3 jyun4 cyun4 saai3",
    sampleLabel: "Transcribed by Qwen3-ASR Cantonese HK",
  },
  asr: {
    title: "Qwen3-ASR Cantonese HK",
    lede: "Fine-tuned for Hong Kong Cantonese, written in Traditional Chinese. It handles switching between Cantonese and English the way a Hongkonger does. Not just another Yue ASR.",
    cards: [
      { size: "1.7B", title: "Most accurate, for desktops and servers" },
      { size: "0.6B", title: "Small enough to run in a browser" },
    ],
    more: "Benchmarks, weights and quantizations",
  },
  repo: {
    cta: "Star on GitHub",
    stars: "{n} stars",
  },
  asrPage: {
    meta: {
      title: "Qwen3-ASR for Hong Kong Cantonese: benchmarks and downloads | Koelony",
      description:
        "Qwen3-ASR 1.7B and 0.6B fine-tuned for Hong Kong Cantonese. Character error rates against stock Qwen3-ASR and Whisper large-v3, and BF16, GGUF, FP8 and NVFP4 downloads.",
      keywords: [
        "Qwen3-ASR Cantonese",
        "Cantonese ASR benchmark",
        "Cantonese speech recognition model",
        "Cantonese GGUF",
        "Hong Kong Cantonese ASR",
        "粵語語音識別模型",
      ],
      ogAlt: "Qwen3-ASR for Hong Kong Cantonese, by Koelony",
    },
    title: "Qwen3-ASR for Hong Kong Cantonese",
    lede: "It writes the characters Hong Kong people use when they speak (係, 喺, 嘅, 咗, 㗎), keeps English words in English, and does not drift into Simplified or Mainland written forms. Open weights under Apache-2.0.",
    modelsTitle: "Two sizes",
    models: [
      {
        size: "1.7B",
        badge: "v2.1",
        title: "Most accurate",
        body: "For desktops and servers. Handles short voice commands, and takes a hotword list without repeating it back: 0% parroting in our 210-clip stress test.",
      },
      {
        size: "0.6B",
        badge: "v1",
        title: "About a third of the size",
        body: "Trained on the same voice commands and hotwords. Small enough to run in a browser tab.",
      },
    ],
    benchTitle: "Character error rate",
    findings: [
      "On FLEURS Cantonese the 1.7B model gets 3.89% of characters wrong; Whisper large-v3 gets 20.97% wrong.",
      "On Cantonese–English code-switching (MCE), errors drop from 11.74% with the stock Qwen3-ASR 1.7B to 5.52%.",
      "The 0.6B model more than halves code-switching errors too, from 15.52% to 6.98%.",
    ],
    benchCaption: "Lower is better.",
    benchCols: {
      set: "Test set",
      stock: "Stock Qwen3-ASR",
      ours: "Koelony fine-tune",
      whisper: "Whisper large-v3",
    },
    benchToggle: { m17: "1.7B", m06: "0.6B" },
    benchToggleLabel: "Model size",
    benchNote:
      "Greedy decoding, BF16 transformers, language forced to Cantonese. Text is converted to Simplified, numbers normalised and spaces removed before scoring. Full method in the repo.",
    formatsTitle: "Weights and quantizations",
    formatsCols: { repo: "Hugging Face repo", format: "Format", size: "Size", runtime: "Runtime" },
    ctaHf: "Browse on Hugging Face",
  },
  demo: {
    title: "Runs entirely in your browser.",
    body: "Try the 0.6B model without installing anything. Record from your mic or drop in an audio file; nothing is uploaded.",
    cta: "Open the demo",
    note: "The first visit downloads about 1.2 GB. Works best in desktop Chrome or Edge.",
  },
  nest: {
    title: "Roadmap",
    lede: "Speech recognition is out. These are next.",
    status: { released: "Released", training: "In training", research: "Research" },
    items: [
      {
        title: "Cantonese speech recognition",
        status: "released",
        body: "Qwen3-ASR in 1.7B and 0.6B, open on Hugging Face.",
        page: "asr",
      },
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
    tagline: "Open-source models for Hong Kong Cantonese.",
    license: "Models released under Apache-2.0.",
    links: "Links",
  },
};
