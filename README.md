# ONYX - Edge AI Inference Engine

ONYX is a frontend-only edge AI app that runs Transformer models directly in the browser with no server and no API keys.

## Features

- Local inference in a Web Worker (`@xenova/transformers`)
- Mission-control inspired dashboard UI
- Model loading progress and runtime status
- Tasks: sentiment, zero-shot classification, summarization, and Q&A
- Browser performance telemetry (FPS, memory, CPU cores)

## Run locally

```bash
cd frontend
npm install
npm run dev
```

## Build

```bash
cd frontend
npm run build
```

## Notes

- First model load downloads from HuggingFace and is cached by the browser.
- WebGPU is used when available; WASM fallback is supported.
