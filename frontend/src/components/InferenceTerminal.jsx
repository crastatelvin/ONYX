function formatResult(result, taskId) {
  if (!result) return "Awaiting input...";
  if (taskId === "sentiment") {
    const r = Array.isArray(result) ? result[0] : result;
    return `${r?.label || "UNKNOWN"} (${((r?.score || 0) * 100).toFixed(1)}%)`;
  }
  if (taskId === "summarization") {
    const r = Array.isArray(result) ? result[0] : result;
    return r?.summary_text || r?.generated_text || JSON.stringify(result, null, 2);
  }
  if (taskId === "qa") {
    return `${result?.answer || "No answer"} (${((result?.score || 0) * 100).toFixed(1)}%)`;
  }
  if (taskId === "translation") {
    const r = Array.isArray(result) ? result[0] : result;
    return r?.translation_text || r?.generated_text || JSON.stringify(result, null, 2);
  }
  return JSON.stringify(result, null, 2);
}

export default function InferenceTerminal({ result, taskId, inferenceStatus, inferenceTime }) {
  return (
    <div className="card">
      <div className="section-title">INFERENCE TERMINAL</div>
      <pre className="mono terminal">
{`STATUS: ${inferenceStatus.toUpperCase()}
TIME: ${inferenceTime ? `${inferenceTime}ms` : "--"}

RESULT:
${formatResult(result, taskId)}`}
      </pre>
    </div>
  );
}
