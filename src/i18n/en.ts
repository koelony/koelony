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
    name: "The name",
    github: "GitHub",
    switchLabel: "Switch language",
    primary: "Main",
  },
  hero: {
    title: "Cantonese, written the way Hong Kong speaks it.",
    lede: "Koelony is a team in Hong Kong building open speech and language models for Cantonese. The first release is Qwen3-ASR fine-tuned in two sizes, 1.7B and 0.6B, free on Hugging Face under Apache-2.0.",
    ctaDemo: "Try the 0.6B demo",
    ctaGithub: "Open the ASR repo",
    sample: "今朝喺地鐵站等咗成粒鐘，個 schedule 完全 delay 晒。",
    sampleJyutping:
      "gam1 ziu1 hai2 dei6 tit3 zaam6 dang2 zo2 seng4 nap1 zung1 go3 jyun4 cyun4 saai3",
    sampleLabel: "Transcribed by Qwen3-ASR Cantonese HK",
  },
  name: {
    title: "Koel + colony",
    body: [
      "The Asian koel (噪鵑) calls across Hong Kong every spring, often before dawn: a rising “ko-el”, repeated until the city wakes up. We took its name.",
      "Colony is the rest of it: a small group of people in Hong Kong who build these models and publish them in the open.",
    ],
    tonesCaption: "The koel's call beside the six tones of Cantonese, drawn as pitch contours.",
  },
  asr: {
    title: "Qwen3-ASR, fine-tuned for Hong Kong Cantonese",
    lede: "It writes the characters Hong Kong people use when they speak (係, 喺, 嘅, 咗, 㗎), keeps English words in English, and does not drift into Simplified or Mainland written forms.",
    cards: [
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
    findings: [
      "On FLEURS Cantonese the 1.7B model gets 3.89% of characters wrong; Whisper large-v3 gets 20.97% wrong.",
      "On Cantonese–English code-switching (MCE), errors drop from 11.74% with the stock Qwen3-ASR 1.7B to 5.52%.",
      "The 0.6B model more than halves code-switching errors too, from 15.52% to 6.98%.",
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
    benchToggleLabel: "Model size",
    benchNote:
      "Greedy decoding, BF16 transformers, language forced to Cantonese. Text is converted to Simplified, numbers normalised and spaces removed before scoring. Full method in the repo.",
    ctaRepo: "Read the model card",
    ctaHf: "Browse on Hugging Face",
  },
  demo: {
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
    title: "Models in progress",
    lede: "Speech recognition is the first release. These Hong Kong Cantonese models are being trained or researched now, and each will be published here when it is ready.",
    status: { released: "Released", training: "In training", research: "Research" },
    items: [
      {
        title: "Cantonese text-to-speech",
        status: "training",
        body: "Hong Kong voices that read all six tones correctly, colloquial readings included.",
      },
      {
        title: "Tone & Jyutping judge",
        status: "research",
        body: "Scores tones and Jyutping syllable by syllable, so pronunciation can be measured.",
      },
      {
        title: "G2P: characters to Jyutping",
        status: "research",
        body: "Turns written Cantonese into Jyutping, including the polyphones and tone changes a dictionary lookup gets wrong.",
      },
      {
        title: "Embeddings & HK-Bench",
        status: "training",
        body: "Text embeddings and a reranker for Cantonese, Traditional Chinese and code-mixed text, measured on our own HK-Bench.",
      },
      {
        title: "Tiny on-device ASR",
        status: "research",
        body: "A 38 MB reader on a frozen audio encoder, for devices where 0.6B is still too heavy.",
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
  koel: {
    call: "ko-el!",
    poke: "Poke the koel to hear it call",
  },
};
