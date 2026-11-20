<p align="center">
  <a href="https://koelony.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/koelony/koelony/main/brand/logo-lockup-inverse.svg" />
      <img src="https://raw.githubusercontent.com/koelony/koelony/main/brand/logo-lockup.svg" height="88" alt="Koelony" />
    </picture>
  </a>
</p>

<p align="center">
  <b>Open AI models for Hong Kong Cantonese.</b><br />
  香港廣東話開源 AI 模型：識聽口語、中英夾雜都冇問題。
</p>

<p align="center">
  <a href="https://koelony.com">koelony.com</a> ·
  <a href="https://hkasr.joe2643.work">Live demo</a> ·
  <a href="https://github.com/joe2643/qwen3-asr-cantonese-hk">Qwen3-ASR Cantonese</a> ·
  <a href="https://huggingface.co/joe2643/Qwen3-ASR-1.7B-Cantonese-HK">Hugging Face</a>
</p>

---

**Koel + colony.** Every spring the Asian koel's rising _ko-el_ call is the sound of a Hong Kong
morning. We are a small colony of builders in Hong Kong, making speech and language models that
actually understand how Hong Kong speaks: colloquial characters (係, 喺, 嘅, 咗, 㗎) and
Cantonese–English code-switching included.

### Released

| Model                                  | What                                                                                          | Links                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Qwen3-ASR 1.7B Cantonese HK** (v2.1) | Most accurate. FLEURS CER 3.89% (Whisper large-v3: 20.97%), hotword biasing with 0% parroting | [GitHub](https://github.com/joe2643/qwen3-asr-cantonese-hk) · [BF16](https://huggingface.co/joe2643/Qwen3-ASR-1.7B-Cantonese-HK) · [GGUF](https://huggingface.co/joe2643/Qwen3-ASR-1.7B-Cantonese-HK-GGUF) · [FP8](https://huggingface.co/joe2643/Qwen3-ASR-1.7B-Cantonese-HK-FP8) · [NVFP4](https://huggingface.co/joe2643/Qwen3-ASR-1.7B-Cantonese-HK-NVFP4) |
| **Qwen3-ASR 0.6B Cantonese HK**        | A third of the size, runs [in your browser](https://hkasr.joe2643.work) on WebGPU             | [BF16](https://huggingface.co/joe2643/Qwen3-ASR-0.6B-Cantonese-HK) · [GGUF](https://huggingface.co/joe2643/Qwen3-ASR-0.6B-Cantonese-HK-GGUF)                                                                                                                                                                                                                   |

Used by [OraType](https://github.com/sennett-lau/oratype), free and open-source voice typing for macOS.

### In the nest 孵緊

Cantonese text-to-speech · tone & Jyutping judge · G2P (characters → Jyutping) ·
Cantonese / code-mixed text embeddings & HK-Bench · tiny on-device ASR.

<sub>Made in Hong Kong 香港製造 · Models released under Apache-2.0.</sub>
