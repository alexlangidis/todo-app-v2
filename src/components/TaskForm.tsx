import React, { useState } from "react";
import Button from "./Button";
import { TASK_PRIORITIES } from "../types";
import type { Category } from "../types";
import { validateTaskText, sanitizeInput } from "../utils/validation";

interface TaskFormProps {
  onAddTask: (
    text: string,
    category?: string,
    dueDate?: Date,
    priority?: "low" | "medium" | "high"
  ) => void;
  categories: Category[];
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, categories }) => {
  // Get tomorrow's date in YYYY-MM-DD format for the date input
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState(getTomorrowDate());
  const [priority, setPriority] = useState<string>("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate and sanitize input
    const sanitizedText = sanitizeInput(text);
    const validation = validateTaskText(sanitizedText);

    if (!validation.isValid) {
      setError(validation.error || "Invalid task text");
      return;
    }

    try {
      const dueDateObj = dueDate ? new Date(dueDate) : undefined;
      onAddTask(
        sanitizedText,
        category || "uncategorized",
        dueDateObj,
        (priority as "low" | "medium" | "high") || "low"
      );

      // Clear form on success
      setText("");
      setCategory("");
      setDueDate(getTomorrowDate());
      setPriority("");
      setError("");
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 ">
      <div className="flex flex-col gap-2 ">
        <div className="flex flex-col sm:flex-row gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            rows={10}
            maxLength={2888}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full cursor-pointer"
          >
            <option value="">--- Select Category ---</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full cursor-pointer"
          >
            <option value="">--- Select Priority ---</option>
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            onClick={(e) => e.currentTarget.showPicker?.()}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full cursor-pointer"
            min={new Date().toISOString().split("T")[0]}
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="px-4 py-2 text-sm cursor-pointer whitespace-nowrap sm:w-auto w-full"
          >
            Add Task
          </Button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </form>
  );
};

export default TaskForm;
