export default function PerformanceMonitor({ fps, memory, cpuCores, inferenceTime }) {
  return (
    <div className="card mono perf">
      <div className="section-title">PERFORMANCE MONITOR</div>
      <div>FPS: {fps}</div>
      <div>CPU CORES: {cpuCores}</div>
      <div>
        HEAP: {memory?.used || 0}MB / {memory?.limit || 0}MB
      </div>
      <div>HEAP UTIL: {memory?.pct || 0}%</div>
      <div>LAST INFERENCE: {inferenceTime ? `${inferenceTime}ms` : "--"}</div>
    </div>
  );
}
