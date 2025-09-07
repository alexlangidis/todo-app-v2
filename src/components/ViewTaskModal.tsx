import React from "react";
import type { Task } from "../types";
import { TASK_CATEGORIES } from "../types";
import Button from "./Button";

interface ViewTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: string, newText: string) => void;
}

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(task.text);
  const editTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.select();
    }
  }, [isEditing]);

  React.useEffect(() => {
    setEditText(task.text);
  }, [task.text]);

  if (!isOpen) return null;

  const handleEditSubmit = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== task.text && onEdit) {
      onEdit(task.id, trimmedText);
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleEditSubmit();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? "Edit Task" : "Task Details"}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Text
            </label>
            {isEditing ? (
              <textarea
                ref={editTextareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={10}
                maxLength={2888}
                placeholder="Enter task description..."
              />
            ) : (
              <textarea
                value={task.text}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-default "
                rows={Math.min(Math.max(task.text.length / 40, 10), 10)}
              />
            )}
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

            {task.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full text-white ${
                    TASK_CATEGORIES.find((cat) => cat.id === task.category)
                      ?.color || "bg-gray-500"
                  }`}
                >
                  {
                    TASK_CATEGORIES.find((cat) => cat.id === task.category)
                      ?.label
                  }
                </span>
              </div>
            )}
            {task.priority && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full text-white ${
                    task.priority === "high"
                      ? "bg-red-500"
                      : task.priority === "low"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {task.priority.toUpperCase()}
                </span>
              </div>
            )}

            {task.dueDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    new Date(task.dueDate) < new Date() && !task.completed
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  📅 {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Created
              </label>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(task.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isEditing ? "Press Ctrl+Enter to save, Esc to cancel" : ""}
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleEditCancel}
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditSubmit}
                  variant="primary"
                  size="sm"
                  disabled={!editText.trim() || editText.trim() === task.text}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                {onEdit && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="secondary"
                    size="sm"
                  >
                    ✏️ Edit
                  </Button>
                )}
                <Button onClick={onClose} variant="secondary" size="sm">
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
