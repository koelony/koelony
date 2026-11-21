import type { Dict } from "./types";

/** Hong Kong Cantonese (written colloquial), not formal written Chinese. */
export const zhHK: Dict = {
  meta: {
    title: "Koelony｜香港廣東話開源 AI 模型",
    description:
      "香港廣東話嘅開源語音同語言模型。微調過嘅 Qwen3-ASR（1.7B、0.6B）識寫口語廣東話，英文字保留英文，有 GGUF、FP8、NVFP4 版本。",
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
    nest: "進行緊",
    github: "GitHub",
    switchLabel: "轉語言",
    primary: "主目錄",
  },
  hero: {
    title: "廣東話，香港人點講就點寫。",
    lede: "Koelony 係香港一班人，專整廣東話嘅開源語音同語言模型。第一個推出嘅係語音識別，免費放咗喺 Hugging Face。",
    ctaDemo: "試吓 0.6B demo",
    sample: "今朝喺地鐵站等咗成粒鐘，個 schedule 完全 delay 晒。",
    sampleJyutping:
      "gam1 ziu1 hai2 dei6 tit3 zaam6 dang2 zo2 seng4 nap1 zung1 go3 jyun4 cyun4 saai3",
    sampleLabel: "由 Qwen3-ASR 廣東話（香港）轉寫",
  },
  asr: {
    title: "Qwen3-ASR，專為香港廣東話微調",
    lede: "佢寫返香港人講嘢真係用嘅字（係、喺、嘅、咗），英文字保留英文。中英夾雜嘅說話，錯字少過原版模型一半。",
    cards: [
      { size: "1.7B", title: "最準，啱桌面電腦同伺服器" },
      { size: "0.6B", title: "細到可以喺瀏覽器度跑" },
    ],
    more: "Benchmark、權重同量化版本",
  },
  repo: {
    cta: "去 GitHub 畀個 star",
    stars: "{n} 粒星",
  },
  asrPage: {
    meta: {
      title: "Qwen3-ASR 香港廣東話版：benchmark 同下載｜Koelony",
      description:
        "為香港廣東話微調嘅 Qwen3-ASR 1.7B 同 0.6B：同原版 Qwen3-ASR 同 Whisper large-v3 比較嘅字錯率，仲有 BF16、GGUF、FP8、NVFP4 下載。",
      keywords: [
        "Qwen3-ASR 廣東話",
        "粵語語音識別模型",
        "廣東話 ASR benchmark",
        "廣東話 GGUF",
        "香港廣東話語音識別",
        "Cantonese ASR",
      ],
      ogAlt: "Koelony 嘅 Qwen3-ASR 香港廣東話版",
    },
    title: "Qwen3-ASR 香港廣東話版",
    lede: "佢會寫返香港人口語用嘅字（係、喺、嘅、咗、㗎），英文字保留英文，唔會走去簡體或者大陸書面語。權重以 Apache-2.0 開放。",
    modelsTitle: "兩個大細",
    models: [
      {
        size: "1.7B",
        badge: "v2.1",
        title: "最準",
        body: "啱桌面電腦同伺服器。識聽短嘅語音指令；畀佢一串 hotword，佢唔會亂咁照抄：210 段壓力測試入面，亂抄率係 0%。",
      },
      {
        size: "0.6B",
        badge: "v1",
        title: "大約三分一咁大",
        body: "一樣有訓練語音指令同 hotword，細到可以喺瀏覽器分頁入面跑。",
      },
    ],
    benchTitle: "字錯率（CER）",
    findings: [
      "喺 FLEURS 廣東話測試，1.7B 嘅字錯率係 3.89%，Whisper large-v3 係 20.97%。",
      "中英夾雜（MCE）嘅字錯率，由原版 Qwen3-ASR 1.7B 嘅 11.74% 降到 5.52%。",
      "0.6B 一樣：中英夾雜嘅字錯率由 15.52% 降到 6.98%，少咗一半有多。",
    ],
    benchCaption: "越低越好。",
    benchCols: {
      set: "測試集",
      stock: "原版 Qwen3-ASR",
      ours: "Koelony 微調版",
      whisper: "Whisper large-v3",
    },
    benchToggle: { m17: "1.7B", m06: "0.6B" },
    benchToggleLabel: "模型大細",
    benchNote:
      "Greedy decoding、BF16 transformers、語言鎖定廣東話。評分前會轉做簡體、統一數字同刪走空格。詳細做法喺 repo 度。",
    formatsTitle: "權重同量化版本",
    formatsCols: { repo: "Hugging Face repo", format: "格式", size: "大細", runtime: "用乜嘢跑" },
    ctaHf: "去 Hugging Face 睇",
  },
  demo: {
    title: "成個喺你個瀏覽器度跑。",
    body: "唔使裝任何嘢，直接試 0.6B 模型。用咪錄音或者拉個音檔入去都得，段錄音唔會上傳。",
    cta: "打開 demo",
    note: "第一次開要下載大約 1.2 GB，用桌面版 Chrome 或者 Edge 最好。",
  },
  nest: {
    title: "進行緊嘅模型",
    lede: "語音識別係第一個推出嘅，跟住就係呢幾個。",
    status: { released: "已推出", training: "訓練緊", research: "研究緊" },
    items: [
      {
        title: "廣東話文字轉語音",
        status: "training",
        body: "香港聲線，六個聲調都讀啱。",
      },
      {
        title: "聲調同粵拼判官",
        status: "research",
        body: "逐個音節幫發音打分。",
      },
      {
        title: "G2P：漢字轉粵拼",
        status: "research",
        body: "廣東話文字轉粵拼，多音字都處理埋。",
      },
      {
        title: "文字 embedding 同 HK-Bench",
        status: "training",
        body: "廣東話同中英夾雜文字嘅搜尋同檢索，仲有我哋自己嘅 benchmark。",
      },
      {
        title: "迷你離線 ASR",
        status: "research",
        body: "畀連 0.6B 都跑唔郁嘅裝置用。",
      },
    ],
  },
  usedBy: {
    title: "OraType 用緊",
    body: "OraType 係 macOS 上面免費、開源嘅語音打字工具，內置嘅廣東話語音引擎就係我哋嘅 GGUF 模型。",
    cta: "睇吓 OraType",
  },
  footer: {
    tagline: "香港廣東話開源 AI 模型。",
    license: "模型以 Apache-2.0 授權發佈。",
    links: "連結",
  },
};
