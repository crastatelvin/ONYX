import { TASKS, getTask } from "../utils/modelConfig";
import useInference from "../hooks/useInference";
import usePerformance from "../hooks/usePerformance";

function renderResult(taskId, result) {
  if (!result) return "Awaiting inference...";
  if (taskId === "sentiment") {
    const r = Array.isArray(result) ? result[0] : result;
    return `${r?.label || "UNKNOWN"} (${((r?.score || 0) * 100).toFixed(1)}%)`;
  }
  if (taskId === "classification") {
    return JSON.stringify(result, null, 2);
  }
  if (taskId === "summarization") {
    const r = Array.isArray(result) ? result[0] : result;
    return r?.summary_text || r?.generated_text || JSON.stringify(result, null, 2);
  }
  if (taskId === "qa") {
    return `${result?.answer || "No answer"} (${((result?.score || 0) * 100).toFixed(1)}%)`;
  }
  return JSON.stringify(result, null, 2);
}

export default function MissionControl() {
  const {
    taskId,
    modelStatus,
    loadProgress,
    loadMessage,
    inferenceStatus,
    result,
    inferenceTime,
    input,
    setInput,
    question,
    setQuestion,
    error,
    loadModel,
    runInference,
    switchTask
  } = useInference();

  const { memory, fps, cpuCores, hasWebGPU, hasWasm } = usePerformance();
  const task = getTask(taskId);

  return (
    <div className="onyx-root">
      <div className="header">
        <div>
          <div style={{ letterSpacing: "4px", color: "rgba(255,107,53,0.6)", fontSize: "0.65rem" }}>EDGE AI INFERENCE ENGINE</div>
          <h1 style={{ margin: 0, letterSpacing: "5px", color: "#ff6b35" }}>ONYX</h1>
        </div>
        <div className="card mono" style={{ color: "#39ff14", fontSize: "0.72rem" }}>
          ZERO DATA LEAVES YOUR DEVICE
        </div>
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.5rem", letterSpacing: "2px", color: "rgba(255,107,53,0.6)", fontSize: "0.65rem" }}>TASK SELECTOR</div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {TASKS.map((item) => (
            <button
              key={item.id}
              onClick={() => switchTask(item.id)}
              style={{
                border: `1px solid ${taskId === item.id ? item.color : "rgba(255,255,255,0.15)"}`,
                background: taskId === item.id ? `${item.color}20` : "transparent",
                color: taskId === item.id ? item.color : "#e8eaed",
                borderRadius: "6px",
                padding: "0.4rem 0.7rem",
                cursor: "pointer"
              }}
            >
              {item.icon} {item.label} ({item.modelSize})
            </button>
          ))}
        </div>
      </div>

      <div className="grid">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="card">
            <div style={{ marginBottom: "0.6rem", color: "rgba(255,107,53,0.6)", letterSpacing: "2px", fontSize: "0.65rem" }}>MODEL SYSTEM</div>
            <div style={{ marginBottom: "0.4rem" }}>{task?.label}</div>
            <div className="mono" style={{ fontSize: "0.75rem", opacity: 0.8, marginBottom: "0.6rem" }}>{task?.model}</div>
            <div className="mono" style={{ fontSize: "0.78rem", marginBottom: "0.4rem" }}>STATUS: {modelStatus.toUpperCase()}</div>
            {(modelStatus === "loading" || modelStatus === "ready") && (
              <>
                <div style={{ height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ width: `${loadProgress}%`, height: "100%", background: "linear-gradient(90deg,#ff6b35,#39ff14)" }} />
                </div>
                <div className="mono" style={{ fontSize: "0.68rem", marginTop: "0.3rem", opacity: 0.8 }}>{loadMessage}</div>
              </>
            )}
            {(modelStatus === "idle" || modelStatus === "error") && (
              <button onClick={loadModel} style={{ width: "100%", marginTop: "0.6rem", padding: "0.55rem", border: "none", borderRadius: "6px", background: "#ff6b35", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                INITIALIZE MODEL
              </button>
            )}
          </div>

          <div className="card mono" style={{ fontSize: "0.75rem", lineHeight: 1.8 }}>
            <div style={{ color: "rgba(255,107,53,0.6)", letterSpacing: "2px", fontSize: "0.65rem", marginBottom: "0.35rem" }}>PERFORMANCE</div>
            <div>FPS: {fps}</div>
            <div>CPU CORES: {cpuCores}</div>
            <div>MEMORY: {memory?.used || 0}MB / {memory?.limit || 0}MB</div>
            <div>WEBGPU: {hasWebGPU ? "ACTIVE" : "UNAVAILABLE"}</div>
            <div>WASM: {hasWasm ? "ACTIVE" : "UNAVAILABLE"}</div>
            <div>LAST INFERENCE: {inferenceTime ? `${inferenceTime}ms` : "--"}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="card">
            <div style={{ marginBottom: "0.5rem", color: "rgba(100,223,223,0.8)", letterSpacing: "2px", fontSize: "0.65rem" }}>INPUT</div>
            <textarea
              rows={taskId === "summarization" ? 6 : 4}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={task?.placeholder}
              style={{ width: "100%", background: "rgba(0,0,0,0.35)", color: "#e8eaed", border: "1px solid rgba(100,223,223,0.3)", borderRadius: "6px", padding: "0.6rem" }}
            />
            {taskId === "qa" && (
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Your question..."
                style={{ width: "100%", marginTop: "0.5rem", background: "rgba(0,0,0,0.35)", color: "#e8eaed", border: "1px solid rgba(255,190,11,0.4)", borderRadius: "6px", padding: "0.6rem" }}
              />
            )}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
              <button onClick={() => setInput(task?.exampleInput || "")} style={{ border: "1px solid rgba(100,223,223,0.5)", background: "transparent", color: "#64dfdf", borderRadius: "6px", padding: "0.45rem 0.75rem", cursor: "pointer" }}>
                USE EXAMPLE
              </button>
              <button
                onClick={runInference}
                disabled={modelStatus !== "ready" || !input.trim() || inferenceStatus === "running"}
                style={{
                  marginLeft: "auto",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.45rem 0.9rem",
                  background: modelStatus === "ready" ? "linear-gradient(90deg,#64dfdf,#a29bfe)" : "rgba(255,255,255,0.1)",
                  color: modelStatus === "ready" ? "#111" : "#777",
                  cursor: modelStatus === "ready" ? "pointer" : "not-allowed",
                  fontWeight: 700
                }}
              >
                {inferenceStatus === "running" ? "RUNNING..." : "RUN INFERENCE"}
              </button>
            </div>
          </div>

          <div className="card">
            <div style={{ marginBottom: "0.6rem", color: "rgba(255,107,53,0.6)", letterSpacing: "2px", fontSize: "0.65rem" }}>INFERENCE TERMINAL</div>
            <pre className="mono" style={{ margin: 0, background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.8rem", minHeight: "200px", maxHeight: "380px", overflow: "auto", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
{`STATUS: ${inferenceStatus.toUpperCase()}
TASK: ${task?.label}
TIME: ${inferenceTime ? `${inferenceTime}ms` : "--"}

RESULT:
${renderResult(taskId, result)}`}
            </pre>
          </div>
        </div>
      </div>

      {error && (
        <div className="card mono" style={{ borderColor: "rgba(255,71,87,0.45)", color: "#ff4757", marginTop: "1rem" }}>
          ERROR: {error}
        </div>
      )}
    </div>
  );
}
