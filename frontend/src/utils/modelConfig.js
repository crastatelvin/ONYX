export const TASKS = [
  {
    id: "sentiment",
    label: "Sentiment Analysis",
    icon: "HEART",
    color: "#ff6b35",
    description: "Detect positive/negative sentiment",
    model: "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
    pipeline: "text-classification",
    modelSize: "~67MB",
    exampleInput: "This product is absolutely amazing! Best purchase ever.",
    placeholder: "Enter text to analyze sentiment..."
  },
  {
    id: "classification",
    label: "Zero-Shot Classification",
    icon: "TAG",
    color: "#64dfdf",
    description: "Classify text into categories you define",
    model: "Xenova/bart-large-mnli",
    pipeline: "zero-shot-classification",
    modelSize: "~407MB",
    exampleInput: "The new iPhone has incredible camera capabilities and battery life.",
    placeholder: "Enter text to classify...",
    labels: ["technology", "sports", "politics", "entertainment", "science"]
  },
  {
    id: "summarization",
    label: "Text Summarization",
    icon: "DOC",
    color: "#39ff14",
    description: "Summarize long text into key points",
    model: "Xenova/distilbart-cnn-6-6",
    pipeline: "summarization",
    modelSize: "~307MB",
    exampleInput:
      "Machine learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.",
    placeholder: "Enter long text to summarize..."
  },
  {
    id: "qa",
    label: "Question Answering",
    icon: "QNA",
    color: "#ffbe0b",
    description: "Answer questions based on a context passage",
    model: "Xenova/distilbert-base-uncased-distilled-squad",
    pipeline: "question-answering",
    modelSize: "~67MB",
    exampleInput:
      "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel.",
    questionInput: "Who designed the Eiffel Tower?",
    placeholder: "Enter context passage..."
  },
  {
    id: "translation",
    label: "Translation",
    icon: "GLOBE",
    color: "#a29bfe",
    description: "Translate text from English to French",
    model: "Xenova/opus-mt-en-fr",
    pipeline: "translation",
    modelSize: "~298MB",
    exampleInput: "Artificial intelligence is changing the way we live and work.",
    placeholder: "Enter English text to translate..."
  }
];

export const getTask = (id) => TASKS.find((task) => task.id === id);
