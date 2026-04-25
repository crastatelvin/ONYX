import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/ONYX/" : "/",
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@xenova/transformers"]
  },
  worker: {
    format: "es"
  },
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin"
    }
  }
});
