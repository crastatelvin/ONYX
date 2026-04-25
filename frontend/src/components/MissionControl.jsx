import InferenceTerminal from "./InferenceTerminal";
import ModelLoader from "./ModelLoader";
import PerformanceMonitor from "./PerformanceMonitor";
import PrivacyBadge from "./PrivacyBadge";
import StatusGrid from "./StatusGrid";
import TaskSelector from "./TaskSelector";
import { getTask } from "../utils/modelConfig";
import useInference from "../hooks/useInference";
import usePerformance from "../hooks/usePerformance";

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
        <PrivacyBadge />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <StatusGrid modelStatus={modelStatus} inferenceStatus={inferenceStatus} hasWebGPU={hasWebGPU} hasWasm={hasWasm} />
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="section-title">TASK SELECTOR</div>
        <TaskSelector activeTask={taskId} onSelect={switchTask} />
      </div>

      <div className="grid">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <ModelLoader task={task} modelStatus={modelStatus} loadProgress={loadProgress} loadMessage={loadMessage} onLoad={loadModel} />
          <PerformanceMonitor fps={fps} memory={memory} cpuCores={cpuCores} inferenceTime={inferenceTime} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="card">
            <div className="section-title">INPUT</div>
            <textarea
              rows={taskId === "summarization" ? 6 : 4}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={task?.placeholder}
              className="input-textarea"
            />
            {taskId === "qa" && (
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Your question..."
                className="input-field"
              />
            )}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
              <button onClick={() => setInput(task?.exampleInput || "")} className="ghost-btn">
                USE EXAMPLE
              </button>
              <button
                onClick={runInference}
                disabled={modelStatus !== "ready" || !input.trim() || inferenceStatus === "running"}
                className="run-btn"
              >
                {inferenceStatus === "running" ? "RUNNING..." : "RUN INFERENCE"}
              </button>
            </div>
          </div>

          <InferenceTerminal result={result} taskId={taskId} inferenceStatus={inferenceStatus} inferenceTime={inferenceTime} />
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
