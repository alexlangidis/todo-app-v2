import { useState } from "react";
import type { TaskFilter } from "../types";
import { useTasks } from "../hooks/useTasks";
import { useCategories } from "../hooks/useCategories";
import TaskForm from "../components/TaskForm";
import TaskStats from "../components/TaskStats";
import { AppFilters, AppContent } from "../components/App";

/**
 * Main tasks page component
 */
function MainPage() {
  const {
    tasks,
    loading: tasksLoading,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    updateTaskDetails,
    reorderTasks,
    bulkComplete,
    bulkUncomplete,
    bulkDelete,
    bulkCategoryChange,
    taskStats,
  } = useTasks();

  const { categories, loading: categoriesLoading } = useCategories();

  const [filter, setFilter] = useState<TaskFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const selectTask = (id: string) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  const selectAllTasks = () => {
    const filteredTasks = tasks.filter((task) => {
      const statusMatch =
        filter === "all" ||
        (filter === "active" && !task.completed) ||
        (filter === "completed" && task.completed);
      const searchMatch =
        searchQuery === "" ||
        task.text.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatch =
        categoryFilter === "" || task.category === categoryFilter;
      const priorityMatch =
        priorityFilter === "" || task.priority === priorityFilter;
      return statusMatch && searchMatch && categoryMatch && priorityMatch;
    });
    setSelectedTasks(filteredTasks.map((task) => task.id));
  };

  const clearSelection = () => {
    setSelectedTasks([]);
  };

  const handleBulkComplete = () => {
    bulkComplete(selectedTasks);
    setSelectedTasks([]);
  };

  const handleBulkDelete = () => {
    bulkDelete(selectedTasks);
    setSelectedTasks([]);
  };

  const handleBulkCategoryChange = (category: string) => {
    bulkCategoryChange(selectedTasks, category);
    setSelectedTasks([]);
  };

  const handleBulkUncomplete = () => {
    bulkUncomplete(selectedTasks);
    setSelectedTasks([]);
  };

  const toggleBulkActions = () => {
    if (showBulkActions) {
      setShowBulkActions(false);
      setSelectedTasks([]);
    } else {
      setShowBulkActions(true);
    }
  };

  const clearFilters = () => {
    setFilter("all");
    setSearchQuery("");
    setCategoryFilter("");
    setPriorityFilter("");
    setSelectedTasks([]);
    setShowBulkActions(false);
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);
    const searchMatch =
      searchQuery === "" ||
      task.text.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch =
      categoryFilter === "" || task.category === categoryFilter;
    const priorityMatch =
      priorityFilter === "" || task.priority === priorityFilter;
    return statusMatch && searchMatch && categoryMatch && priorityMatch;
  });

  // Show loading spinner while checking auth state or loading tasks/categories
  if (tasksLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="w-full mx-auto">
        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Column 1: Task Statistics */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg shadow-lg">
              <TaskStats tasks={tasks} categories={categories} />
            </div>
          </div>

          {/* Column 2: Add New Task Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sticky top-4 mb-4 z-10">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                ➕ Add New Task
              </h2>
              <TaskForm onAddTask={addTask} categories={categories} />
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <AppFilters
              filter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              taskCounts={taskStats}
              showBulkActions={showBulkActions}
              onToggleBulkActions={toggleBulkActions}
              onClearFilters={clearFilters}
              categories={categories}
            />

            <AppContent
              tasks={filteredTasks}
              filter={filter}
              searchQuery={searchQuery}
              categoryFilter={categoryFilter}
              priorityFilter={priorityFilter}
              selectedTasks={selectedTasks}
              showBulkActions={showBulkActions}
              onAddTask={addTask}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
              onUpdateDetails={updateTaskDetails}
              onReorder={reorderTasks}
              onSelectTask={selectTask}
              onSelectAll={selectAllTasks}
              onClearSelection={clearSelection}
              onBulkComplete={handleBulkComplete}
              onBulkUncomplete={handleBulkUncomplete}
              onBulkDelete={handleBulkDelete}
              onBulkCategoryChange={handleBulkCategoryChange}
              categories={categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
