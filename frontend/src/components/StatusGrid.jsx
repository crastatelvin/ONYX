const statusColor = (ok) => (ok ? "#39ff14" : "#ffbe0b");

export default function StatusGrid({ modelStatus, inferenceStatus, hasWebGPU, hasWasm }) {
  const items = [
    { label: "WEBGPU", value: hasWebGPU ? "ACTIVE" : "OFF", ok: hasWebGPU },
    { label: "WASM", value: hasWasm ? "ACTIVE" : "OFF", ok: hasWasm },
    { label: "MODEL", value: modelStatus.toUpperCase(), ok: modelStatus === "ready" },
    { label: "ENGINE", value: inferenceStatus === "running" ? "RUNNING" : "STANDBY", ok: true },
    { label: "PRIVACY", value: "LOCAL", ok: true },
    { label: "SERVER", value: "NONE", ok: true }
  ];

  return (
    <div className="status-grid">
      {items.map((item) => (
        <div key={item.label} className="status-card card">
          <span className="status-dot" style={{ background: statusColor(item.ok) }} />
          <div className="mono status-value" style={{ color: statusColor(item.ok) }}>
            {item.value}
          </div>
          <div className="status-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
