import { useState, useMemo, useEffect, useCallback } from "react";
import { useTasks } from "../hooks/useTasks";
import { useCategories } from "../hooks/useCategories";
import Button from "../components/Button";
import ViewTaskModal from "../components/ViewTaskModal";
import type { Task } from "../types";

/**
 * Dedicated page for managing archived tasks
 */
function ArchivePage() {
  const {
    archivedTasks,
    loading: tasksLoading,
    restoreTask,
    permanentDeleteTask,
  } = useTasks();

  const { categories, loading: categoriesLoading } = useCategories();

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"deletedAt" | "text" | "category">(
    "deletedAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    type: "single" | "bulk" | "bulk-restore";
    taskId?: string;
    task?: Task;
  } | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const itemsPerPage = 10;

  // Filter archived tasks based on multiple criteria
  const filteredTasks = useMemo(() => {
    return archivedTasks.filter((task) => {
      // Search query filter
      const searchMatch =
        !searchQuery.trim() ||
        task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const categoryMatch = !categoryFilter || task.category === categoryFilter;

      // Date filter
      let dateMatch = true;
      if (dateFilter) {
        if (!task.deletedAt) {
          dateMatch = false;
        } else {
          const taskDate = new Date(task.deletedAt).toDateString();
          const filterDate = new Date(dateFilter).toDateString();
          dateMatch = taskDate === filterDate;
        }
      }

      return searchMatch && categoryMatch && dateMatch;
    });
  }, [archivedTasks, searchQuery, categoryFilter, dateFilter]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case "deletedAt": {
          aValue = a.deletedAt ? new Date(a.deletedAt).getTime() : 0;
          bValue = b.deletedAt ? new Date(b.deletedAt).getTime() : 0;
          break;
        }
        case "text": {
          aValue = a.text.toLowerCase();
          bValue = b.text.toLowerCase();
          break;
        }
        case "category": {
          aValue = a.category || "";
          bValue = b.category || "";
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

  // Pagination
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTasks, currentPage]);

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
  }, [selectedTasks]);

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

  const handleBulkRestore = () => {
    setShowConfirmDialog({ type: "bulk-restore" });
  };

  const handleBulkPermanentDelete = () => {
    setShowConfirmDialog({ type: "bulk" });
  };

  const handleRestore = (id: string) => {
    restoreTask(id);
  };

  const handlePermanentDelete = (id: string) => {
    const task = archivedTasks.find((t) => t.id === id);
    setShowConfirmDialog({ type: "single", taskId: id, task });
  };

  const confirmAction = async () => {
    if (!showConfirmDialog) return;

    try {
      setError("");
      setSuccess("");

      if (showConfirmDialog.type === "single" && showConfirmDialog.taskId) {
        await permanentDeleteTask(showConfirmDialog.taskId);
        setSuccess("Task permanently deleted successfully");
      } else if (showConfirmDialog.type === "bulk") {
        await Promise.all(selectedTasks.map((id) => permanentDeleteTask(id)));
        setSuccess(`${selectedTasks.length} tasks permanently deleted`);
        setSelectedTasks([]);
      } else if (showConfirmDialog.type === "bulk-restore") {
        await Promise.all(selectedTasks.map((id) => restoreTask(id)));
        setSuccess(`${selectedTasks.length} tasks restored successfully`);
        setSelectedTasks([]);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Archive operation failed:", error);
    } finally {
      setShowConfirmDialog(null);
    }
  };

  if (tasksLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading archived tasks...
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
            Archived Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tasks that have been deleted but can be restored or permanently
            removed.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {archivedTasks.length}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              Total Archived
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {filteredTasks.length}
            </div>
            <div className="text-blue-700 dark:text-blue-300">
              Filtered Results
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-4 items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by task content or ID..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <Button
                onClick={() => setSearchQuery("")}
                variant="secondary"
                disabled={!searchQuery}
              >
                Clear
              </Button>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Filter by archived date"
              />

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="deletedAt">Sort by Date</option>
                  <option value="text">Sort by Name</option>
                  <option value="category">Sort by Category</option>
                </select>
                <Button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  variant="secondary"
                  className="px-3"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
              </div>
            </div>

            {/* Clear All Filters */}
            {(searchQuery || categoryFilter || dateFilter) && (
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("");
                    setDateFilter("");
                  }}
                  variant="secondary"
                  size="sm"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        {(error || success) && (
          <div
            className={`rounded-lg p-4 mb-6 ${
              error
                ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                : "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
            }`}
          >
            {error || success}
            <button
              onClick={() => {
                setError("");
                setSuccess("");
              }}
              className="ml-2 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

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
                <Button onClick={handleBulkRestore} variant="primary" size="sm">
                  Restore Selected
                </Button>
                <Button
                  onClick={handleBulkPermanentDelete}
                  variant="danger"
                  size="sm"
                >
                  Delete Permanently
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {paginatedTasks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {archivedTasks.length === 0
                  ? "No archived tasks"
                  : "No matching tasks"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {archivedTasks.length === 0
                  ? "Deleted tasks will appear here for restoration."
                  : "Try adjusting your search criteria."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              {paginatedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => selectTask(task.id)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                          {task.text}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            task.completed
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {task.completed ? "Completed" : "Incompleted"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>
                          📅 Archived:{" "}
                          {task.deletedAt
                            ? new Date(task.deletedAt).toLocaleDateString()
                            : "Unknown"}
                        </span>
                        {task.category && (
                          <span>
                            🏷️{" "}
                            {categories.find((c) => c.id === task.category)
                              ?.label || task.category}
                          </span>
                        )}
                        {task.priority && <span>🚩 {task.priority}</span>}
                        {task.dueDate && (
                          <span>
                            📆 Due:{" "}
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        onClick={() => setViewingTask(task)}
                        variant="secondary"
                        size="sm"
                        className="px-2 py-1 text-xs"
                        title="View Details"
                      >
                        👁️
                      </Button>
                      <Button
                        onClick={() => handleRestore(task.id)}
                        variant="primary"
                        size="sm"
                        className="px-2 py-1 text-xs"
                        title="Restore Task"
                      >
                        Restore
                      </Button>
                      <Button
                        onClick={() => handlePermanentDelete(task.id)}
                        variant="danger"
                        size="sm"
                        className="px-2 py-1 text-xs"
                        title="Delete Permanently"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                variant="secondary"
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-2 text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                variant="secondary"
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

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
                      Are you sure you want to permanently delete this task?
                    </p>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-sm text-red-800 dark:text-red-200">
                      <p className="font-medium">
                        {showConfirmDialog.task.text}
                      </p>
                      <p className="mt-1">
                        This action cannot be undone and will permanently remove
                        the task from the system.
                      </p>
                    </div>
                  </div>
                )}

              {showConfirmDialog.type === "bulk" && (
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Are you sure you want to permanently delete{" "}
                    {selectedTasks.length} selected task
                    {selectedTasks.length !== 1 ? "s" : ""}?
                  </p>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-sm text-red-800 dark:text-red-200">
                    This action cannot be undone and will permanently remove the
                    selected tasks from the system.
                  </div>
                </div>
              )}

              {showConfirmDialog.type === "bulk-restore" && (
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Restore {selectedTasks.length} selected task
                    {selectedTasks.length !== 1 ? "s" : ""} to active list?
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-sm text-green-800 dark:text-green-200">
                    The selected tasks will be restored to your active task
                    list.
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
                    ? "Delete Permanently"
                    : showConfirmDialog.type === "bulk-restore"
                    ? "Restore"
                    : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* View Task Modal */}
        {viewingTask && (
          <ViewTaskModal
            task={viewingTask}
            isOpen={true}
            onClose={() => setViewingTask(null)}
            onEdit={() => {}}
            onUpdateDetails={() => {}}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
}

export default ArchivePage;
