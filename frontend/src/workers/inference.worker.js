import { env, pipeline } from "@xenova/transformers";

env.allowLocalModels = false;
env.useBrowserCache = true;

let currentPipeline = null;
let currentModel = null;

self.onmessage = async (event) => {
  const { type, task, model, input, options } = event.data;

  if (type === "load") {
    try {
      self.postMessage({ type: "loading", progress: 0, message: `Initializing ${model}...` });

      currentPipeline = await pipeline(task, model, {
        progress_callback: (progress) => {
          self.postMessage({
            type: "loading",
            progress: Math.round(progress.progress || 0),
            message: progress.file
              ? `Downloading ${progress.file} (${Math.round(progress.progress || 0)}%)`
              : "Loading model..."
          });
        }
      });

      currentModel = model;
      self.postMessage({ type: "loaded", model });
    } catch (error) {
      self.postMessage({ type: "error", error: error.message });
    }
  }

  if (type === "infer") {
    try {
      if (!currentPipeline) {
        self.postMessage({ type: "error", error: "Model not loaded" });
        return;
      }

      const startTime = performance.now();
      self.postMessage({ type: "inferring" });

      let result;
      switch (task) {
        case "zero-shot-classification":
          result = await currentPipeline(input, options?.labels || ["positive", "negative"]);
          break;
        case "summarization":
          result = await currentPipeline(input, { max_length: 150, min_length: 30, do_sample: false });
          break;
        case "question-answering":
          // Transformers.js QA pipeline expects (question, context), not an object payload.
          result = await currentPipeline(options?.question || "", input);
          break;
        case "translation":
          result = await currentPipeline(input);
          break;
        default:
          result = await currentPipeline(input);
      }

      self.postMessage({
        type: "result",
        result,
        inferenceTime: Math.round(performance.now() - startTime),
        model: currentModel
      });
    } catch (error) {
      self.postMessage({ type: "error", error: error.message });
    }
  }
};
