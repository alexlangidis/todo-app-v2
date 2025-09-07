import React from "react";
import type { Task } from "../types";
import { TASK_CATEGORIES } from "../types";
import Button from "./Button";
import ViewTaskModal from "./ViewTaskModal";
import EditTaskModal from "./EditTaskModal";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, newText: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  showSelection?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragHandleProps?: Record<string, any>;
  isDragging?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  isSelected = false,
  onSelect,
  showSelection = false,
  dragHandleProps,
  isDragging = false,
}) => {
  const [isViewing, setIsViewing] = React.useState(false);
  const [isEditingModal, setIsEditingModal] = React.useState(false);
  const [screenSize, setScreenSize] = React.useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");

  // Screen size detection for responsive truncation
  React.useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  // Get character limit based on screen size
  const getCharLimit = () => {
    switch (screenSize) {
      case "mobile":
        return 25;
      case "tablet":
        return 35;
      case "desktop":
        return 35;
      default:
        return 35;
    }
  };

  // Truncate text based on screen size
  const getTruncatedText = (text: string) => {
    const limit = getCharLimit();
    if (text.length <= limit) return text;
    return `${text.substring(0, limit)}...`;
  };

  const handleToggle = () => {
    try {
      onToggle(task.id);
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      try {
        onDelete(task.id);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditingModal(true);
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(task.id);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-gray-600"
      } ${isDragging ? "opacity-50" : ""}`}
    >
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
        >
          ⋮⋮
        </div>
      )}
      {showSelection && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
      )}
      {!showSelection && (
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
        />
      )}
      <div className="flex-1">
        <span
          onClick={showSelection ? undefined : handleToggle}
          className={`text-gray-800 dark:text-gray-100 select-none ${
            showSelection ? "cursor-default" : "cursor-pointer"
          } ${
            task.completed
              ? "line-through text-gray-500 dark:text-gray-400"
              : ""
          }`}
          title={task.text.length > getCharLimit() ? task.text : undefined}
        >
          {getTruncatedText(task.text)}
        </span>
        {task.category && (
          <span
            className={`ml-2 px-2 py-1 text-xs rounded-full text-white ${
              TASK_CATEGORIES.find((cat) => cat.id === task.category)?.color ||
              "bg-gray-500"
            }`}
          >
            {TASK_CATEGORIES.find((cat) => cat.id === task.category)?.label}
          </span>
        )}
        {task.priority && (
          <span
            className={`ml-2 px-2 py-1 text-xs rounded-full text-white ${
              task.priority === "high"
                ? "bg-red-500"
                : task.priority === "low"
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
          >
            {task.priority.toUpperCase()}
          </span>
        )}
        {task.dueDate && (
          <span
            className={`ml-2 px-2 py-1 text-xs rounded-full ${
              new Date(task.dueDate) < new Date() && !task.completed
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }`}
          >
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {!showSelection && (
        <div className="flex flex-wrap gap-1 shrink-0">
          <Button
            onClick={() => setIsViewing(true)}
            variant="secondary"
            size="sm"
            className="px-1.5 py-1 text-xs sm:px-2 sm:py-1 sm:text-sm cursor-pointer"
            aria-label="View task details"
          >
            👁️
          </Button>
          <Button
            onClick={handleEditClick}
            variant="secondary"
            size="sm"
            className="px-1.5 py-1 text-xs sm:px-2 sm:py-1 sm:text-sm cursor-pointer"
            aria-label="Edit task"
          >
            ✏️
          </Button>
          {onDelete && (
            <Button
              onClick={handleDelete}
              variant="secondary"
              size="sm"
              className="px-1.5 py-1 text-sm sm:px-2 sm:py-1 sm:text-lg cursor-pointer"
              aria-label="Delete task"
            >
              🗑️
            </Button>
          )}
        </div>
      )}

      {/* View Task Modal */}
      <ViewTaskModal
        task={task}
        isOpen={isViewing}
        onClose={() => setIsViewing(false)}
        onEdit={onEdit}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        task={task}
        isOpen={isEditingModal}
        onClose={() => setIsEditingModal(false)}
        onSave={onEdit || (() => {})}
      />
    </div>
  );
};

export default React.memo(TaskItem);
