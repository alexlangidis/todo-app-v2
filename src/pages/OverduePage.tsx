import { useState, useMemo, useEffect, useCallback } from "react";
import { useTasks } from "../hooks/useTasks";
import { useCategories } from "../hooks/useCategories";
import TaskList from "../components/TaskList";
import Button from "../components/Button";
import type { Task } from "../types";

/**
 * Dedicated page for managing overdue tasks
 */
function OverduePage() {
  const {
    tasks,
    loading: tasksLoading,
    toggleTask,
    deleteTask,
    editTask,
    updateTaskDetails,
    bulkComplete,
    bulkDelete,
  } = useTasks();

  const { categories, loading: categoriesLoading } = useCategories();

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "text">(
    "dueDate"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    type: "single" | "bulk" | "bulk-complete" | "bulk-reschedule";
    taskId?: string;
    task?: Task;
  } | null>(null);

  // Filter overdue tasks
  const overdueTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter((task) => {
      if (task.completed) return false;
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < now;
    });
  }, [tasks]);

  // Apply additional filters
  const filteredTasks = useMemo(() => {
    return overdueTasks.filter((task) => {
      const categoryMatch =
        categoryFilter === "" || task.category === categoryFilter;
      const priorityMatch =
        priorityFilter === "" || task.priority === priorityFilter;
      return categoryMatch && priorityMatch;
    });
  }, [overdueTasks, categoryFilter, priorityFilter]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let aValue: number | string, bValue: number | string;

      switch (sortBy) {
        case "dueDate": {
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        }
        case "priority": {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        }
        case "text": {
          aValue = a.text.toLowerCase();
          bValue = b.text.toLowerCase();
          break;
        }
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }, [filteredTasks, sortBy, sortOrder]);

  const selectTask = (id: string) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  const selectAllTasks = useCallback(() => {
    setSelectedTasks(sortedTasks.map((task) => task.id));
  }, [sortedTasks]);

  const clearSelection = () => {
    setSelectedTasks([]);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "a":
            event.preventDefault();
            selectAllTasks();
            break;
          case "Delete":
          case "Backspace":
            if (selectedTasks.length > 0) {
              event.preventDefault();
              setShowConfirmDialog({ type: "bulk" });
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedTasks, selectAllTasks]);

  const handleBulkComplete = () => {
    setShowConfirmDialog({ type: "bulk-complete" });
  };

  const handleBulkDelete = () => {
    setShowConfirmDialog({ type: "bulk" });
  };

  const handleBulkReschedule = () => {
    setShowConfirmDialog({ type: "bulk-reschedule" });
  };

  const handleSingleDelete = (id: string) => {
    const task = sortedTasks.find((t) => t.id === id);
    setShowConfirmDialog({ type: "single", taskId: id, task });
  };

  const confirmAction = async () => {
    if (!showConfirmDialog) return;

    try {
      if (showConfirmDialog.type === "single" && showConfirmDialog.taskId) {
        await deleteTask(showConfirmDialog.taskId);
      } else if (showConfirmDialog.type === "bulk") {
        await bulkDelete(selectedTasks);
        setSelectedTasks([]);
      } else if (showConfirmDialog.type === "bulk-complete") {
        await bulkComplete(selectedTasks);
        setSelectedTasks([]);
      } else if (showConfirmDialog.type === "bulk-reschedule") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        selectedTasks.forEach((id) => {
          updateTaskDetails(id, { dueDate: tomorrow });
        });
        setSelectedTasks([]);
      }
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setShowConfirmDialog(null);
    }
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  if (tasksLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading overdue tasks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Overdue Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tasks that are past their due date and need immediate attention.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {overdueTasks.length}
            </div>
            <div className="text-red-700 dark:text-red-300">Total Overdue</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {overdueTasks.filter((t) => t.priority === "high").length}
            </div>
            <div className="text-orange-700 dark:text-orange-300">
              High Priority
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {Math.round(
                overdueTasks.reduce((acc, task) => {
                  if (task.dueDate) {
                    const days = Math.floor(
                      (new Date().getTime() -
                        new Date(task.dueDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return acc + days;
                  }
                  return acc;
                }, 0) / overdueTasks.length || 0
              )}
            </div>
            <div className="text-yellow-700 dark:text-yellow-300">
              Avg Days Overdue
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => toggleSort("dueDate")}
                variant={sortBy === "dueDate" ? "primary" : "secondary"}
                size="sm"
              >
                Due Date{" "}
                {sortBy === "dueDate" && (sortOrder === "asc" ? "↑" : "↓")}
              </Button>
              <Button
                onClick={() => toggleSort("priority")}
                variant={sortBy === "priority" ? "primary" : "secondary"}
                size="sm"
              >
                Priority{" "}
                {sortBy === "priority" && (sortOrder === "asc" ? "↑" : "↓")}
              </Button>
              <Button
                onClick={() => toggleSort("text")}
                variant={sortBy === "text" ? "primary" : "secondary"}
                size="sm"
              >
                Name {sortBy === "text" && (sortOrder === "asc" ? "↑" : "↓")}
              </Button>
            </div>
          </div>
        </div>

        {/* Select All Button - Always Visible */}
        {sortedTasks.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button onClick={selectAllTasks} variant="secondary" size="sm">
                  Select All ({sortedTasks.length})
                </Button>
                {selectedTasks.length > 0 && (
                  <Button
                    onClick={clearSelection}
                    variant="secondary"
                    size="sm"
                  >
                    Clear Selection
                  </Button>
                )}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                {selectedTasks.length > 0
                  ? `${selectedTasks.length} task${
                      selectedTasks.length !== 1 ? "s" : ""
                    } selected`
                  : `${sortedTasks.length} task${
                      sortedTasks.length !== 1 ? "s" : ""
                    } available`}
              </div>
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              Tip: Use Ctrl+A to select all, Delete key to bulk delete
            </div>
          </div>
        )}

        {/* Bulk Actions - Only when tasks are selected */}
        {selectedTasks.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                Bulk Actions
              </span>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={handleBulkComplete}
                  variant="primary"
                  size="sm"
                >
                  Mark Complete
                </Button>
                <Button
                  onClick={handleBulkReschedule}
                  variant="secondary"
                  size="sm"
                >
                  Reschedule to Tomorrow
                </Button>
                <Button onClick={handleBulkDelete} variant="danger" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {sortedTasks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                No overdue tasks!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Great job staying on top of your tasks.
              </p>
            </div>
          ) : (
            <TaskList
              tasks={sortedTasks}
              filter="all"
              searchQuery=""
              categories={categories}
              selectedTasks={selectedTasks}
              onSelectTask={selectTask}
              showSelection={true}
              onToggle={toggleTask}
              onDelete={handleSingleDelete}
              onEdit={editTask}
              onUpdateDetails={updateTaskDetails}
            />
          )}
        </div>

        {/* Confirm Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Confirm Action
              </h3>

              {showConfirmDialog.type === "single" &&
                showConfirmDialog.task && (
                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Are you sure you want to delete this task?
                    </p>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded text-sm text-orange-800 dark:text-orange-200">
                      <p className="font-medium">
                        {showConfirmDialog.task.text}
                      </p>
                      <p className="mt-1">
                        This task will be moved to the Archive and can be
                        restored later.
                      </p>
                    </div>
                  </div>
                )}

              {showConfirmDialog.type === "bulk" && (
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Are you sure you want to delete {selectedTasks.length}{" "}
                    selected task
                    {selectedTasks.length !== 1 ? "s" : ""}?
                  </p>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded text-sm text-orange-800 dark:text-orange-200">
                    The selected tasks will be moved to the Archive and can be
                    restored later.
                  </div>
                </div>
              )}

              {showConfirmDialog.type === "bulk-complete" && (
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Mark {selectedTasks.length} selected task
                    {selectedTasks.length !== 1 ? "s" : ""} as complete?
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-sm text-green-800 dark:text-green-200">
                    The selected tasks will be marked as completed.
                  </div>
                </div>
              )}

              {showConfirmDialog.type === "bulk-reschedule" && (
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Reschedule {selectedTasks.length} selected task
                    {selectedTasks.length !== 1 ? "s" : ""} to tomorrow?
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-blue-800 dark:text-blue-200">
                    The due dates will be updated to tomorrow.
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => setShowConfirmDialog(null)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAction}
                  variant={
                    showConfirmDialog.type === "bulk" ? "danger" : "primary"
                  }
                >
                  {showConfirmDialog.type === "bulk"
                    ? "Delete"
                    : showConfirmDialog.type === "bulk-complete"
                    ? "Mark Complete"
                    : showConfirmDialog.type === "bulk-reschedule"
                    ? "Reschedule"
                    : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OverduePage;
