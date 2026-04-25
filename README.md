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

## Deploy

### Vercel

```bash
cd frontend
vercel --prod
```

`frontend/vercel.json` is included with SPA rewrites and required COEP/COOP headers.

### GitHub Pages

- A workflow is included at `.github/workflows/deploy-pages.yml`.
- On push to `main`, it builds `frontend` and deploys `frontend/dist`.
- In repository settings, set Pages source to **GitHub Actions**.

## Notes

- First model load downloads from HuggingFace and is cached by the browser.
- WebGPU is used when available; WASM fallback is supported.
- PWA support is enabled with `manifest.webmanifest` and `sw.js`.
