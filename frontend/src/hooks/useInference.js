import { useCallback, useRef, useState } from "react";
import { getTask } from "../utils/modelConfig";

export default function useInference() {
  const [taskId, setTaskId] = useState("sentiment");
  const [modelStatus, setModelStatus] = useState("idle");
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadMessage, setLoadMessage] = useState("");
  const [inferenceStatus, setInferenceStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [inferenceTime, setInferenceTime] = useState(null);
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");

  const workerRef = useRef(null);

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL("../workers/inference.worker.js", import.meta.url), {
        type: "module"
      });

      workerRef.current.onmessage = (event) => {
        const { type, progress, message, result: modelResult, inferenceTime: elapsed, error: err } = event.data;
        if (type === "loading") {
          setModelStatus("loading");
          setLoadProgress(progress || 0);
          setLoadMessage(message || "Loading...");
        } else if (type === "loaded") {
          setModelStatus("ready");
          setLoadProgress(100);
          setLoadMessage("Model ready.");
        } else if (type === "inferring") {
          setInferenceStatus("running");
        } else if (type === "result") {
          setResult(modelResult);
          setInferenceTime(elapsed);
          setInferenceStatus("done");
        } else if (type === "error") {
          setError(err || "Unknown error");
          setModelStatus((prev) => (prev === "loading" ? "error" : prev));
          setInferenceStatus("idle");
        }
      };
    }
    return workerRef.current;
  }, []);

  const loadModel = useCallback(() => {
    const task = getTask(taskId);
    if (!task) return;
    setError("");
    setResult(null);
    setLoadProgress(0);
    getWorker().postMessage({ type: "load", task: task.pipeline, model: task.model });
  }, [getWorker, taskId]);

  const runInference = useCallback(() => {
    const task = getTask(taskId);
    if (!task || modelStatus !== "ready" || !input.trim()) return;
    if (task.pipeline === "question-answering" && !question.trim()) {
      setError("Please enter a question for Q&A.");
      return;
    }
    setError("");
    setResult(null);
    setInferenceStatus("running");
    getWorker().postMessage({
      type: "infer",
      task: task.pipeline,
      model: task.model,
      input: input.trim(),
      options: {
        labels: task.labels,
        question: question.trim()
      }
    });
  }, [getWorker, input, modelStatus, question, taskId]);

  const switchTask = useCallback((nextTaskId) => {
    setTaskId(nextTaskId);
    setModelStatus("idle");
    setLoadProgress(0);
    setLoadMessage("");
    setResult(null);
    setInferenceStatus("idle");
    setError("");
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    const task = getTask(nextTaskId);
    setInput(task?.exampleInput || "");
    setQuestion(task?.questionInput || "");
  }, []);

  return {
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
  };
}
