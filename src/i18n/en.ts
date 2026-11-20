import type { Dict } from "./types";

export const en: Dict = {
  meta: {
    title: "Koelony — Open AI models for Hong Kong Cantonese",
    description:
      "Koelony builds open speech and language models for Hong Kong Cantonese. Try our fine-tuned Qwen3-ASR 1.7B and 0.6B: colloquial Cantonese, English code-switching, with GGUF, FP8 and NVFP4 builds.",
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
    nest: "In the nest",
    name: "The name",
    github: "GitHub",
    switchLabel: "Switch language",
  },
  hero: {
    eyebrow: "Open Cantonese AI, made in Hong Kong",
    title: "AI that actually hears Hong Kong.",
    lede: "Koelony builds open speech and language models for Hong Kong Cantonese: colloquial characters, English code-switching and all. Our first release, a fine-tuned Qwen3-ASR, is out now on Hugging Face.",
    ctaDemo: "Try the 0.6B demo",
    ctaGithub: "ASR on GitHub",
    sample: "今朝喺地鐵站等咗成粒鐘，個 schedule 完全 delay 晒。",
    sampleLabel: "Transcribed by Qwen3-ASR Cantonese HK",
  },
  name: {
    kicker: "The name",
    title: "Koel + colony.",
    body: [
      "Every spring, the Asian koel's rising “ko-el, ko-el” is the sound of a Hong Kong morning: loud, local and impossible to ignore. We named ourselves after it.",
      "A colony is the other half: a small group of builders in Hong Kong, working in the open, one model at a time.",
    ],
  },
  asr: {
    kicker: "Released",
    title: "Qwen3-ASR, fine-tuned for Hong Kong Cantonese",
    lede: "It writes Hong Kong Traditional Chinese with the characters people actually speak (係, 喺, 嘅, 咗, 㗎), keeps English words in English, and stays clear of Simplified or Mainland-style output.",
    cards: [
      {
        size: "1.7B",
        badge: "v2.1",
        title: "The accurate one",
        body: "For desktops and servers. Handles short voice commands and hotword biasing without parroting the hotword list back.",
      },
      {
        size: "0.6B",
        badge: "v1",
        title: "The light one",
        body: "About a third of the size, trained on the same voice commands and hotwords. Small enough to run in a browser tab.",
      },
    ],
    stats: [
      { value: "5.4×", label: "fewer errors than Whisper large-v3 on FLEURS Cantonese" },
      { value: "−53%", label: "errors on Cantonese–English code-switching vs. stock Qwen3-ASR" },
      { value: "0.0%", label: "hotword parroting in our 210-clip stress test" },
      { value: "6", label: "checkpoints: BF16, GGUF, FP8 and NVFP4" },
    ],
    formatsTitle: "Weights and quantizations",
    formatsCols: { repo: "Hugging Face repo", format: "Format", size: "Size", runtime: "Runtime" },
    benchTitle: "Character error rate",
    benchCaption: "Lower is better.",
    benchCols: {
      set: "Test set",
      stock: "Stock Qwen3-ASR",
      ours: "Koelony fine-tune",
      whisper: "Whisper large-v3",
    },
    benchToggle: { m17: "1.7B", m06: "0.6B" },
    benchNote:
      "Greedy decoding, BF16 transformers, language forced to Cantonese. Text is converted to Simplified, numbers normalised and spaces removed before scoring. Full method in the repo.",
    ctaRepo: "Read the model card",
    ctaHf: "Browse on Hugging Face",
  },
  demo: {
    kicker: "Live demo",
    title: "Runs entirely in your browser.",
    body: "The 0.6B model (int8 ONNX, about 1.16 GB, cached after the first load) runs on WebGPU and falls back to WebAssembly. Drop in an audio file or record from your mic.",
    points: [
      "No audio leaves your device",
      "WebGPU, with a WASM fallback",
      "Cached after the first load",
    ],
    cta: "Open the demo",
    note: "Works best in desktop Chrome or Edge.",
  },
  nest: {
    kicker: "In the nest",
    title: "What we're hatching next",
    lede: "Speech recognition is the first bird out. More Hong Kong Cantonese models are in training, and they will land here when they are ready.",
    status: { released: "Released", training: "In training", research: "Research" },
    items: [
      {
        title: "Cantonese text-to-speech",
        status: "training",
        body: "Natural Hong Kong voices that get all six tones right, including the colloquial readings that trip up most TTS.",
      },
      {
        title: "Tone & Jyutping judge",
        status: "research",
        body: "A model that listens and scores tones and Jyutping syllable by syllable, so we can measure pronunciation rather than guess.",
      },
      {
        title: "G2P: characters to Jyutping",
        status: "research",
        body: "Turning written Cantonese into Jyutping, with the polyphones and sandhi a dictionary lookup gets wrong.",
      },
      {
        title: "Embeddings & HK-Bench",
        status: "training",
        body: "Text embeddings and a reranker for Cantonese, Traditional Chinese and code-mixed text, plus a benchmark to keep us honest.",
      },
      {
        title: "Tiny on-device ASR",
        status: "research",
        body: "A 38 MB reader on a frozen audio encoder, for places where even 0.6B is too heavy.",
      },
    ],
  },
  usedBy: {
    kicker: "In the wild",
    title: "Already typing for people",
    body: "OraType, free and open-source voice typing for macOS, ships our GGUF model as its built-in Cantonese speech engine.",
    cta: "See OraType",
  },
  footer: {
    tagline: "Open AI models for Hong Kong Cantonese.",
    license: "Models released under Apache-2.0.",
    madeIn: "Made in Hong Kong",
    links: "Links",
  },
};
