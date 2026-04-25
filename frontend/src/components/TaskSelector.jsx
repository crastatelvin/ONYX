import { motion } from "framer-motion";
import { TASKS } from "../utils/modelConfig";

export default function TaskSelector({ activeTask, onSelect }) {
  return (
    <div className="task-grid">
      {TASKS.map((task, index) => (
        <motion.button
          key={task.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(task.id)}
          className={`task-btn ${activeTask === task.id ? "active" : ""}`}
          style={{ "--task-color": task.color }}
        >
          <span>{task.icon}</span>
          <div>
            <div className="task-title">{task.label}</div>
            <div className="task-sub mono">{task.modelSize}</div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
