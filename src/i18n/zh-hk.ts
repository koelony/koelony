import type { Dict } from "./types";

/** Hong Kong Cantonese (written colloquial), not formal written Chinese. */
export const zhHK: Dict = {
  meta: {
    title: "Koelony｜香港廣東話開源 AI 模型",
    description:
      "Koelony 專做香港廣東話嘅開源語音同語言模型。試吓我哋微調嘅 Qwen3-ASR 1.7B 同 0.6B：識聽口語、中英夾雜都冇問題，仲有 GGUF、FP8、NVFP4 版本。",
    keywords: [
      "廣東話語音識別",
      "粵語 ASR",
      "香港廣東話",
      "語音轉文字",
      "中英夾雜",
      "Qwen3-ASR",
      "開源 AI",
      "Cantonese ASR",
    ],
    ogAlt: "Koelony：香港廣東話開源 AI 模型",
  },
  skip: "跳去內容",
  nav: {
    asr: "語音識別",
    demo: "試用",
    nest: "孵緊",
    name: "個名",
    github: "GitHub",
    switchLabel: "轉語言",
  },
  hero: {
    eyebrow: "香港出品・開源廣東話 AI",
    title: "真係聽得明香港人講嘢嘅 AI。",
    lede: "Koelony 專門整香港廣東話嘅開源語音同語言模型：口語字、中英夾雜，一樣照聽。第一個成果，微調過嘅 Qwen3-ASR，已經喺 Hugging Face 上架。",
    ctaDemo: "試吓 0.6B demo",
    ctaGithub: "去 GitHub 睇 ASR",
    sample: "今朝喺地鐵站等咗成粒鐘，個 schedule 完全 delay 晒。",
    sampleLabel: "由 Qwen3-ASR 廣東話（香港）轉寫",
  },
  name: {
    kicker: "個名",
    title: "噪鵑 + colony。",
    body: [
      "每年春天，噪鵑一朝早就「哥噢、哥噢」咁叫，越叫越高音：好嘈，但好香港。我哋個名就係由佢嚟。",
      "Colony 係另一半：一班喺香港嘅開發者，公開咁做，一個模型一個模型咁砌出嚟。",
    ],
  },
  asr: {
    kicker: "已推出",
    title: "Qwen3-ASR，專為香港廣東話微調",
    lede: "佢會用香港人真正講嘅字嚟寫繁體（係、喺、嘅、咗、㗎），英文字就保留英文，唔會變咗簡體或者大陸書面語。",
    cards: [
      {
        size: "1.7B",
        badge: "v2.1",
        title: "最準嗰個",
        body: "適合桌面電腦同伺服器。識聽短嘅語音指令，又支援 hotword，唔會將你畀嘅 hotword 亂咁抄出嚟。",
      },
      {
        size: "0.6B",
        badge: "v1",
        title: "最輕嗰個",
        body: "大約得 1.7B 三分一咁大，一樣有訓練語音指令同 hotword。細到可以直接喺瀏覽器度跑。",
      },
    ],
    stats: [
      { value: "5.4×", label: "喺 FLEURS 廣東話，錯字比 Whisper large-v3 少 5.4 倍" },
      { value: "−53%", label: "中英夾雜嘅錯字，比原版 Qwen3-ASR 少一半有多" },
      { value: "0.0%", label: "210 段壓力測試入面，零 hotword 亂抄" },
      { value: "6", label: "個版本：BF16、GGUF、FP8、NVFP4" },
    ],
    formatsTitle: "權重同量化版本",
    formatsCols: { repo: "Hugging Face repo", format: "格式", size: "大細", runtime: "用乜嘢跑" },
    benchTitle: "字錯率（CER）",
    benchCaption: "越低越好。",
    benchCols: {
      set: "測試集",
      stock: "原版 Qwen3-ASR",
      ours: "Koelony 微調版",
      whisper: "Whisper large-v3",
    },
    benchToggle: { m17: "1.7B", m06: "0.6B" },
    benchNote:
      "Greedy decoding、BF16 transformers、語言鎖定廣東話。評分前會轉做簡體、統一數字同刪走空格。詳細做法喺 repo 度。",
    ctaRepo: "睇 model card",
    ctaHf: "去 Hugging Face",
  },
  demo: {
    kicker: "即場試",
    title: "成個喺你個瀏覽器度跑。",
    body: "0.6B 模型（int8 ONNX，大約 1.16 GB，第一次載入之後會 cache 住）用 WebGPU 跑，唔得就轉用 WebAssembly。拉個音檔入去，或者直接用咪錄音就得。",
    points: ["段錄音唔會離開你部機", "WebGPU，有 WASM 後備", "第一次載入之後會 cache 住"],
    cta: "打開 demo",
    note: "用桌面版 Chrome 或者 Edge 效果最好。",
  },
  nest: {
    kicker: "仲喺巢入面",
    title: "下一批孵緊嘅",
    lede: "語音識別係第一隻出巢嘅雀。仲有幾個香港廣東話模型訓練緊，搞掂就會喺度公布。",
    status: { released: "已推出", training: "訓練緊", research: "研究緊" },
    items: [
      {
        title: "廣東話文字轉語音",
        status: "training",
        body: "自然嘅香港聲線，六個聲調都讀啱，連好多 TTS 都會讀錯嘅口語讀音都搞得掂。",
      },
      {
        title: "聲調同粵拼判官",
        status: "research",
        body: "一個識聽嘅模型，逐個音節幫聲調同粵拼打分，等我哋可以實實在在量度發音，唔使靠估。",
      },
      {
        title: "G2P：漢字轉粵拼",
        status: "research",
        body: "將廣東話文字轉做粵拼，連查字典會搞錯嘅多音字同變調都處理埋。",
      },
      {
        title: "文字 embedding 同 HK-Bench",
        status: "training",
        body: "專為廣東話、繁體中文同中英夾雜文字而設嘅 embedding 同 reranker，仲有一套 benchmark 幫我哋自己把關。",
      },
      {
        title: "迷你離線 ASR",
        status: "research",
        body: "喺凍結咗嘅音訊 encoder 上面加個 38 MB 嘅 reader，連 0.6B 都嫌太大嘅地方都用得。",
      },
    ],
  },
  usedBy: {
    kicker: "已經有人用緊",
    title: "已經幫緊人打字",
    body: "OraType 係 macOS 上面免費、開源嘅語音打字工具，內置嘅廣東話語音引擎就係我哋嘅 GGUF 模型。",
    cta: "睇吓 OraType",
  },
  footer: {
    tagline: "香港廣東話開源 AI 模型。",
    license: "模型以 Apache-2.0 授權發佈。",
    madeIn: "香港製造",
    links: "連結",
  },
};
