import { useCallback, useMemo } from "react";
import type { Task, TaskPriority, TaskStatus } from "../types";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Custom hook for managing tasks with localStorage persistence
 * @returns Object containing tasks state and management functions
 */
export const useTasks = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("todo-tasks", []);

  const addTask = useCallback(
    (
      text: string,
      category?: string,
      dueDate?: Date,
      priority?: TaskPriority,
      status?: TaskStatus
    ) => {
      const newTask: Task = {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date(),
        status: status || "pending",
        category,
        dueDate,
        priority,
        order: Date.now(),
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    },
    [setTasks]
  );

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    },
    [setTasks]
  );

  const editTask = useCallback(
    (id: string, newText: string) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, text: newText } : task
        )
      );
    },
    [setTasks]
  );

  const updateTaskDetails = useCallback(
    (
      id: string,
      updates: {
        status?: TaskStatus;
        category?: string;
        priority?: TaskPriority;
        dueDate?: Date;
      }
    ) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        )
      );
    },
    [setTasks]
  );

  const reorderTasks = useCallback(
    (activeId: string, overId: string) => {
      setTasks((prevTasks) => {
        const oldIndex = prevTasks.findIndex((task) => task.id === activeId);
        const newIndex = prevTasks.findIndex((task) => task.id === overId);

        if (oldIndex === -1 || newIndex === -1) return prevTasks;

        const reorderedTasks = [...prevTasks];
        const [removed] = reorderedTasks.splice(oldIndex, 1);
        reorderedTasks.splice(newIndex, 0, removed);

        // Update order values
        return reorderedTasks.map((task, index) => ({
          ...task,
          order: Date.now() + index,
        }));
      });
    },
    [setTasks]
  );

  const bulkComplete = useCallback(
    (selectedIds: string[]) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          selectedIds.includes(task.id) ? { ...task, completed: true } : task
        )
      );
    },
    [setTasks]
  );

  const bulkUncomplete = useCallback(
    (selectedIds: string[]) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          selectedIds.includes(task.id) ? { ...task, completed: false } : task
        )
      );
    },
    [setTasks]
  );

  const bulkDelete = useCallback(
    (selectedIds: string[]) => {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => !selectedIds.includes(task.id))
      );
    },
    [setTasks]
  );

  const bulkCategoryChange = useCallback(
    (selectedIds: string[], category: string) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          selectedIds.includes(task.id)
            ? { ...task, category: category || undefined }
            : task
        )
      );
    },
    [setTasks]
  );

  // Computed values
  const taskStats = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
    }),
    [tasks]
  );

  return {
    tasks,
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
  };
};
