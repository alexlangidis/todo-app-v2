import type { Task, TaskFilter } from "../types";

/**
 * Utility functions for task filtering and searching
 */

/**
 * Filter tasks based on status, search query, category, and priority
 * @param tasks - Array of tasks to filter
 * @param filter - Status filter (all/active/completed)
 * @param searchQuery - Search query string
 * @param categoryFilter - Category filter
 * @param priorityFilter - Priority filter
 * @returns Filtered array of tasks
 */
export const filterTasks = (
  tasks: Task[],
  filter: TaskFilter,
  searchQuery: string,
  categoryFilter: string,
  priorityFilter: string
): Task[] => {
  return tasks.filter((task) => {
    // Status filter
    const statusMatch =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);

    // Search filter
    const searchMatch =
      searchQuery === "" ||
      task.text.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const categoryMatch =
      categoryFilter === "" || task.category === categoryFilter;

    // Priority filter
    const priorityMatch =
      priorityFilter === "" || task.priority === priorityFilter;

    return statusMatch && searchMatch && categoryMatch && priorityMatch;
  });
};

/**
 * Get task statistics
 * @param tasks - Array of tasks
 * @returns Object with task counts
 */
export const getTaskStats = (tasks: Task[]) => ({
  all: tasks.length,
  active: tasks.filter((task) => !task.completed).length,
  completed: tasks.filter((task) => task.completed).length,
});

/**
 * Sort tasks by order (for drag & drop)
 * @param tasks - Array of tasks to sort
 * @returns Sorted array of tasks
 */
export const sortTasksByOrder = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
};

/**
 * Group tasks by category
 * @param tasks - Array of tasks to group
 * @returns Object with tasks grouped by category
 */
export const groupTasksByCategory = (tasks: Task[]) => {
  return tasks.reduce((groups, task) => {
    const category = task.category || "Uncategorized";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(task);
    return groups;
  }, {} as Record<string, Task[]>);
};

/**
 * Group tasks by priority
 * @param tasks - Array of tasks to group
 * @returns Object with tasks grouped by priority
 */
export const groupTasksByPriority = (tasks: Task[]) => {
  return tasks.reduce((groups, task) => {
    const priority = task.priority || "No Priority";
    if (!groups[priority]) {
      groups[priority] = [];
    }
    groups[priority].push(task);
    return groups;
  }, {} as Record<string, Task[]>);
};
