export default function ModelLoader({ task, modelStatus, loadProgress, loadMessage, onLoad }) {
  return (
    <div className="card">
      <div className="section-title">MODEL SYSTEM</div>
      <div className="loader-head">{task?.label}</div>
      <div className="mono loader-model">{task?.model}</div>
      <div className="mono loader-status">STATUS: {modelStatus.toUpperCase()}</div>

      {(modelStatus === "loading" || modelStatus === "ready") && (
        <div className="loader-bar-wrap">
          <div className="loader-bar">
            <div className="loader-bar-fill" style={{ width: `${loadProgress}%` }} />
          </div>
          <div className="mono loader-msg">{loadMessage}</div>
        </div>
      )}

      {(modelStatus === "idle" || modelStatus === "error") && (
        <button className="primary-btn" onClick={onLoad}>
          INITIALIZE MODEL
        </button>
      )}
    </div>
  );
}
