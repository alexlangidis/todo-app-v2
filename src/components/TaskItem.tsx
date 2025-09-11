import React from "react";
import type { Task, Category, TaskStatus, TaskPriority } from "../types";
import Confetti from "react-confetti";
import Button from "./Button";
import ViewTaskModal from "./ViewTaskModal";
import EditTaskModal from "./EditTaskModal";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, newText: string) => void;
  onUpdateDetails?: (
    id: string,
    updates: {
      status?: TaskStatus;
      category?: string;
      priority?: TaskPriority;
      dueDate?: Date;
    }
  ) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  showSelection?: boolean;
  categories: Category[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragHandleProps?: Record<string, any>;
  isDragging?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = (props) => {
  console.log("TaskItem props:", props); // Logging to validate assumptions about props
  const {
    task,
    onToggle,
    onDelete,
    onEdit,
    onUpdateDetails,
    isSelected = false,
    onSelect,
    showSelection = false,
    categories,
  } = props;
  const [isViewing, setIsViewing] = React.useState(false);
  const [isEditingModal, setIsEditingModal] = React.useState(false);
  const [screenSize, setScreenSize] = React.useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [isFading, setIsFading] = React.useState(false);
  const [prevCompleted, setPrevCompleted] = React.useState(task.completed);

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

  // Detect when task becomes completed and trigger celebration
  React.useEffect(() => {
    if (task.completed && !prevCompleted) {
      setShowConfetti(true);
      setIsFading(true);
      // Stop confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
      // Stop fading after animation
      setTimeout(() => setIsFading(false), 1000);
    }
    setPrevCompleted(task.completed);
  }, [task.completed, prevCompleted]);

  // Get character limit based on screen size
  const getCharLimit = () => {
    switch (screenSize) {
      case "mobile":
        return 40;
      case "tablet":
        return 50;
      case "desktop":
        return 60;
      default:
        return 50;
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
    <>
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        </div>
      )}
      <div
        className={`p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
          isSelected
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-200 dark:border-gray-600"
        } ${isFading ? "opacity-0 transition-opacity duration-1000" : ""}`}
      >
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          <div className="flex items-center gap-2 mb-2">
            {showSelection && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleSelect}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 shrink-0"
              />
            )}
            {!showSelection && (
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggle}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer shrink-0"
              />
            )}
            <span
              onClick={showSelection ? undefined : handleToggle}
              className={`text-gray-800 dark:text-gray-100 select-none flex-1 ${
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
          </div>

          <div className="flex flex-wrap gap-1 items-center">
            <span
              className="px-2 py-1 text-xs rounded-full text-white whitespace-nowrap"
              style={{
                backgroundColor:
                  categories.find(
                    (cat) => cat.id === (task.category || "uncategorized")
                  )?.color || "#6b7280",
              }}
            >
              {categories.find(
                (cat) => cat.id === (task.category || "uncategorized")
              )?.label || "Uncategorized"}
            </span>
            {task.priority && (
              <span
                className={`px-2 py-1 text-xs rounded-full text-white whitespace-nowrap ${
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
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  new Date(task.dueDate) < new Date() && !task.completed
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}
              >
                📅 {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}

            <Button
              onClick={() => setIsViewing(true)}
              variant="secondary"
              size="sm"
              className="px-2 py-1 text-sm cursor-pointer ml-auto"
              aria-label="View task details"
            >
              👁️
            </Button>
            {!showSelection && (
              <>
                <Button
                  onClick={handleEditClick}
                  variant="secondary"
                  size="sm"
                  className="px-2 py-1 text-sm cursor-pointer"
                  aria-label="Edit task"
                >
                  ✏️
                </Button>
                {onDelete && (
                  <Button
                    onClick={handleDelete}
                    variant="secondary"
                    size="sm"
                    className="px-2 py-1 text-sm cursor-pointer"
                    aria-label="Delete task"
                  >
                    🗑️
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center gap-3">
          {showSelection && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleSelect}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 shrink-0"
            />
          )}
          {!showSelection && (
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggle}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer shrink-0"
            />
          )}
          <span
            onClick={showSelection ? undefined : handleToggle}
            className={`text-gray-800 dark:text-gray-100 select-none flex-1 ${
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
          <span
            className="px-2 py-1 text-xs rounded-full text-white whitespace-nowrap shrink-0"
            style={{
              backgroundColor:
                categories.find(
                  (cat) => cat.id === (task.category || "uncategorized")
                )?.color || "#6b7280",
            }}
          >
            {categories.find(
              (cat) => cat.id === (task.category || "uncategorized")
            )?.label || "Uncategorized"}
          </span>
          {task.priority && (
            <span
              className={`px-2 py-1 text-xs rounded-full text-white whitespace-nowrap shrink-0 ${
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
              className={`px-2 py-1 text-xs rounded-full whitespace-nowrap shrink-0 ${
                new Date(task.dueDate) < new Date() && !task.completed
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              }`}
            >
              📅 {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}

          <div className="flex gap-1 shrink-0 ml-auto">
            <Button
              onClick={() => setIsViewing(true)}
              variant="secondary"
              size="sm"
              className="px-2 py-1 text-sm cursor-pointer"
              aria-label="View task details"
            >
              👁️
            </Button>
            {!showSelection && (
              <>
                <Button
                  onClick={handleEditClick}
                  variant="secondary"
                  size="sm"
                  className="px-2 py-1 text-sm cursor-pointer"
                  aria-label="Edit task"
                >
                  ✏️
                </Button>
                {onDelete && (
                  <Button
                    onClick={handleDelete}
                    variant="secondary"
                    size="sm"
                    className="px-2 py-1 text-sm cursor-pointer"
                    aria-label="Delete task"
                  >
                    🗑️
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* View Task Modal */}
        <ViewTaskModal
          task={task}
          isOpen={isViewing}
          onClose={() => setIsViewing(false)}
          onEdit={onEdit}
          onUpdateDetails={onUpdateDetails}
          categories={categories}
        />

        {/* Edit Task Modal */}
        <EditTaskModal
          task={task}
          isOpen={isEditingModal}
          onClose={() => setIsEditingModal(false)}
          onSave={onEdit || (() => {})}
          onUpdateDetails={onUpdateDetails || (() => {})}
          categories={categories}
        />
      </div>
    </>
  );
};

export default React.memo(TaskItem);
