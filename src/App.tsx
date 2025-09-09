import { useState, useEffect } from "react";
import type { TaskFilter } from "./types";
import { useTasks } from "./hooks/useTasks";
import { useCategories } from "./hooks/useCategories";
import { useAuth } from "./hooks/useAuth";
import { AppHeader, AppFilters, AppContent } from "./components/App";
import TaskForm from "./components/TaskForm";
import TaskStats from "./components/TaskStats";
import CategoryManager from "./components/CategoryManager";
import Auth from "./components/Auth";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Main application component for the Todo App
 *
 * Features:
 * - Task management with Firebase/Firestore persistence
 * - User authentication (login/register)
 * - Filtering by status, category, and priority
 * - Search functionality
 * - Bulk operations for multiple tasks
 * - Dark mode toggle
 * - Responsive design
 * - Real-time data synchronization
 *
 * @returns The main application component
 */
function App() {
  const { user, loading, isAuthenticated } = useAuth();

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

  const {
    categories,
    loading: categoriesLoading,
    addCategory,
    deleteCategory,
    renameCategory,
    updateCategoryColor,
    isCategoryNameTaken,
  } = useCategories();

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
  if (loading || tasksLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth component if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="w-full mx-auto">
        <AppHeader
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
          userEmail={user?.email}
        />

        {/* 3-Column Grid Layout with adjusted widths */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          {/* Column 1: Task Statistics */}
          <div className="md:col-span-4 lg:col-span-2 xl:col-span-1">
            <div className="sticky top-4 rounded-lg shadow-lg">
              <TaskStats tasks={tasks} categories={categories} />
            </div>
          </div>

          {/* Column 2: Add New Task Form + Category Manager */}
          <div className=" md:col-span-4 lg:col-span-2 xl:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sticky top-4 mb-4 z-10">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                ➕ Add New Task
              </h2>
              <TaskForm onAddTask={addTask} categories={categories} />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sticky top-20 md:top-4 z-20">
              <CategoryManager
                categories={categories}
                tasks={tasks}
                onAddCategory={addCategory}
                onDeleteCategory={deleteCategory}
                onRenameCategory={renameCategory}
                onUpdateCategoryColor={updateCategoryColor}
                isCategoryNameTaken={isCategoryNameTaken}
              />
            </div>
          </div>

          {/* Right: Filters, Bulk Actions & Tasks */}
          <div className="md:col-span-4 lg:col-span-4 xl:col-span-2">
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
    </div>
  );
}

export default App;
