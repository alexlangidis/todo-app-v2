import React from "react";
import type { Task, Category, TaskStatus, TaskPriority } from "../types";
import { TASK_PRIORITIES } from "../types";
import Button from "./Button";

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, newText: string) => void;
  onUpdateDetails: (
    id: string,
    updates: {
      status?: TaskStatus;
      category?: string;
      priority?: TaskPriority;
      dueDate?: Date;
    }
  ) => void;
  categories: Category[];
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  onUpdateDetails,
  categories,
}) => {
  const [editText, setEditText] = React.useState(task.text);
  const [editStatus, setEditStatus] = React.useState<TaskStatus>(
    task.status || "pending"
  );
  const [editCategory, setEditCategory] = React.useState(task.category || "");
  const [editPriority, setEditPriority] = React.useState<TaskPriority | "">(
    task.priority || ""
  );
  const [editDueDate, setEditDueDate] = React.useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );
  const editTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    setEditText(task.text);
    setEditStatus(task.status || "pending");
    setEditCategory(task.category || "");
    setEditPriority(task.priority || "");
    setEditDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
    );
  }, [task]);

  React.useEffect(() => {
    if (isOpen && editTextareaRef.current) {
      // Small delay to ensure the textarea value is updated
      setTimeout(() => {
        if (editTextareaRef.current) {
          editTextareaRef.current.focus();
          // Position cursor at the end of the text without selecting
          const textLength = editTextareaRef.current.value.length;
          editTextareaRef.current.setSelectionRange(textLength, textLength);
        }
      }, 0);
    }
  }, [isOpen, editText]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedText = editText.trim();

    // Save text changes
    if (trimmedText && trimmedText !== task.text) {
      onSave(task.id, trimmedText);
    }

    // Save other field changes
    const updates: {
      status?: TaskStatus;
      category?: string;
      priority?: TaskPriority;
      dueDate?: Date;
    } = {};

    if (editStatus !== (task.status || "pending")) {
      updates.status = editStatus;
    }

    if (editCategory !== (task.category || "")) {
      updates.category = editCategory || undefined;
    }

    if (editPriority !== (task.priority || "")) {
      updates.priority = editPriority || undefined;
    }

    if (
      editDueDate !==
      (task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "")
    ) {
      updates.dueDate = editDueDate ? new Date(editDueDate) : undefined;
    }

    // Only call update if there are changes
    if (Object.keys(updates).length > 0) {
      onUpdateDetails(task.id, updates);
    }

    onClose();
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditStatus(task.status || "pending");
    setEditCategory(task.category || "");
    setEditPriority(task.priority || "");
    setEditDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
    );
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Edit Task
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold cursor-pointer"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Text
              </label>

              <div className="flex gap-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created:
                </label>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(task.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <textarea
              ref={editTextareaRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={Math.min(Math.max(editText.length / 40, 10), 10)}
              maxLength={2888}
              placeholder="Enter task description..."
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full ${
                  task.completed
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {task.completed ? "Completed" : "Active"}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={editPriority}
                onChange={(e) =>
                  setEditPriority(e.target.value as TaskPriority)
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
              >
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority.id} value={priority.id}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Press Ctrl+Enter to save, Esc to cancel
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              size="sm"
              disabled={
                !editText.trim() ||
                (editText.trim() === task.text &&
                  editCategory === (task.category || "") &&
                  editPriority === (task.priority || "") &&
                  editDueDate ===
                    (task.dueDate
                      ? new Date(task.dueDate).toISOString().split("T")[0]
                      : ""))
              }
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
