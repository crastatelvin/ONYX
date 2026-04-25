import { useEffect, useState } from "react";

export default function usePerformance() {
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState(null);

  useEffect(() => {
    const memTimer = setInterval(() => {
      if (performance.memory) {
        setMemory({
          used: Math.round(performance.memory.usedJSHeapSize / 1048576),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576),
          pct: Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100)
        });
      }
    }, 1000);

    let rafId;
    let frames = 0;
    let last = performance.now();
    const tick = () => {
      frames += 1;
      const now = performance.now();
      if (now - last > 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      clearInterval(memTimer);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return {
    fps,
    memory,
    cpuCores: navigator.hardwareConcurrency || 4,
    hasWebGPU: !!navigator.gpu,
    hasWasm: typeof WebAssembly !== "undefined"
  };
}
