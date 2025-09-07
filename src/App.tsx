import { useState, useEffect } from "react";
import type { TaskFilter } from "./types";
import { useTasks } from "./hooks/useTasks";
import { AppHeader, AppFilters, AppContent } from "./components/App";

/**
 * Main application component for the Todo App
 *
 * Features:
 * - Task management with localStorage persistence
 * - Filtering by status, category, and priority
 * - Search functionality
 * - Bulk operations for multiple tasks
 * - Dark mode toggle
 * - Responsive design
 *
 * @returns The main application component
 */
function App() {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    reorderTasks,
    bulkComplete,
    bulkDelete,
    bulkCategoryChange,
    taskStats,
  } = useTasks();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("todo-theme");
    return savedTheme === "dark";
  });
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem("todo-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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

  const toggleBulkActions = () => {
    if (showBulkActions) {
      setShowBulkActions(false);
      setSelectedTasks([]);
    } else {
      setShowBulkActions(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <AppHeader isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />

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
        />

        <AppContent
          tasks={tasks}
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
          onReorder={reorderTasks}
          onSelectTask={selectTask}
          onSelectAll={selectAllTasks}
          onClearSelection={clearSelection}
          onBulkComplete={handleBulkComplete}
          onBulkDelete={handleBulkDelete}
          onBulkCategoryChange={handleBulkCategoryChange}
        />
      </div>
    </div>
  );
}

export default App;
