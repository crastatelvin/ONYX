# Architecture Decisions

## Why frontend-only
No backend is required for this product goal: private, local AI inference.

## Why Transformers.js
It offers broad browser compatibility with WASM and optional acceleration paths.

## Why Web Worker inference
Inference can block the main thread; workers keep animations and UI responsive.

## Why Vite
Vite handles modern ESM workflows and module workers cleanly.
