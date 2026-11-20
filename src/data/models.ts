/** Released checkpoints and benchmark numbers, from the qwen3-asr-cantonese-hk README (v2.1). */

export type Checkpoint = {
  repo: string;
  format: string;
  size: string;
  runtime: string;
  family: "1.7B" | "0.6B";
};

const hf = (repo: string) => `https://huggingface.co/joe2643/${repo}`;

export const CHECKPOINTS: (Checkpoint & { url: string })[] = [
  {
    family: "1.7B",
    repo: "Qwen3-ASR-1.7B-Cantonese-HK",
    format: "BF16 safetensors",
    size: "4.08 GB",
    runtime: "transformers · qwen-asr · vLLM · ComfyUI",
  },
  {
    family: "1.7B",
    repo: "Qwen3-ASR-1.7B-Cantonese-HK-GGUF",
    format: "GGUF Q4_K_M / Q6_K / Q8_0",
    size: "1.1–1.8 GB",
    runtime: "llama.cpp · OraType",
  },
  {
    family: "1.7B",
    repo: "Qwen3-ASR-1.7B-Cantonese-HK-FP8",
    format: "FP8 W8A8",
    size: "2.67 GB",
    runtime: "vLLM",
  },
  {
    family: "1.7B",
    repo: "Qwen3-ASR-1.7B-Cantonese-HK-NVFP4",
    format: "NVFP4A16",
    size: "2.05 GB",
    runtime: "vLLM",
  },
  {
    family: "0.6B",
    repo: "Qwen3-ASR-0.6B-Cantonese-HK",
    format: "BF16 safetensors",
    size: "1.56 GB",
    runtime: "transformers · qwen-asr · vLLM",
  },
  {
    family: "0.6B",
    repo: "Qwen3-ASR-0.6B-Cantonese-HK-GGUF",
    format: "GGUF Q4_K_M / Q6_K / Q8_0",
    size: "397–639 MB",
    runtime: "llama.cpp · edge devices",
  },
].map((c) => ({ ...(c as Checkpoint), url: hf(c.repo) }));

/** Character error rate in %, lower is better. */
export type BenchRow = {
  set: string;
  stock17: number;
  ours17: number;
  stock06: number;
  ours06: number;
  whisper: number;
};

export const BENCHMARKS: BenchRow[] = [
  {
    set: "FLEURS yue_hant_hk",
    stock17: 4.2,
    ours17: 3.89,
    stock06: 6.1,
    ours06: 5.7,
    whisper: 20.97,
  },
  {
    set: "Common Voice yue",
    stock17: 5.46,
    ours17: 3.94,
    stock06: 6.84,
    ours06: 5.12,
    whisper: 36.44,
  },
  {
    set: "Common Voice 23 zh-HK",
    stock17: 7.65,
    ours17: 5.02,
    stock06: 9.55,
    ours06: 6.44,
    whisper: 41.76,
  },
  { set: "MDCC", stock17: 4.25, ours17: 2.47, stock06: 5.45, ours06: 3.29, whisper: 34.52 },
  { set: "LegCo", stock17: 7.22, ours17: 7.16, stock06: 8.81, ours06: 7.62, whisper: 32.15 },
  {
    set: "MCE (code-switching)",
    stock17: 11.74,
    ours17: 5.52,
    stock06: 15.52,
    ours06: 6.98,
    whisper: 24.0,
  },
];
