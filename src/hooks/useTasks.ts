import { useCallback, useMemo, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./useAuth";
import type { Task, TaskPriority, TaskStatus } from "../types";

/**
 * Custom hook for managing tasks with Firestore persistence
 * @returns Object containing tasks state and management functions
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Set up real-time listener for user's tasks
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const tasksRef = collection(db, "users", user.uid, "tasks");
    const q = query(tasksRef, orderBy("order", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
      })) as Task[];

      setTasks(tasksData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addTask = useCallback(
    async (
      text: string,
      category?: string,
      dueDate?: Date,
      priority?: TaskPriority,
      status?: TaskStatus
    ) => {
      if (!user) return;

      const tasksRef = collection(db, "users", user.uid, "tasks");
      const newTask = {
        text,
        completed: false,
        createdAt: new Date(),
        status: status || "pending",
        category: category || null,
        dueDate: dueDate || null,
        priority: priority || null,
        order: Date.now(),
      };

      await addDoc(tasksRef, newTask);
    },
    [user]
  );

  const toggleTask = useCallback(
    async (id: string) => {
      if (!user) return;

      const taskRef = doc(db, "users", user.uid, "tasks", id);
      const task = tasks.find((t) => t.id === id);
      if (task) {
        await updateDoc(taskRef, { completed: !task.completed });
      }
    },
    [user, tasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!user) return;

      const taskRef = doc(db, "users", user.uid, "tasks", id);
      await deleteDoc(taskRef);
    },
    [user]
  );

  const editTask = useCallback(
    async (id: string, newText: string) => {
      if (!user) return;

      const taskRef = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(taskRef, { text: newText });
    },
    [user]
  );

  const updateTaskDetails = useCallback(
    async (
      id: string,
      updates: {
        status?: TaskStatus;
        category?: string;
        priority?: TaskPriority;
        dueDate?: Date;
      }
    ) => {
      if (!user) return;

      const taskRef = doc(db, "users", user.uid, "tasks", id);
      const firestoreUpdates: Partial<{
        status: TaskStatus;
        category: string | null;
        priority: TaskPriority | null;
        dueDate: Date | null;
      }> = {};
      if (updates.status) firestoreUpdates.status = updates.status;
      if (updates.category !== undefined)
        firestoreUpdates.category = updates.category || null;
      if (updates.priority !== undefined)
        firestoreUpdates.priority = updates.priority || null;
      if (updates.dueDate !== undefined)
        firestoreUpdates.dueDate = updates.dueDate || null;

      await updateDoc(taskRef, firestoreUpdates);
    },
    [user]
  );

  const reorderTasks = useCallback(
    async (activeId: string, overId: string) => {
      if (!user) return;

      const activeTask = tasks.find((t) => t.id === activeId);
      const overTask = tasks.find((t) => t.id === overId);

      if (!activeTask || !overTask) return;

      const newOrder = overTask.order;
      const activeRef = doc(db, "users", user.uid, "tasks", activeId);

      await updateDoc(activeRef, { order: newOrder });
    },
    [user, tasks]
  );

  const bulkComplete = useCallback(
    async (selectedIds: string[]) => {
      if (!user) return;

      const updatePromises = selectedIds.map((id) => {
        const taskRef = doc(db, "users", user.uid, "tasks", id);
        return updateDoc(taskRef, { completed: true });
      });

      await Promise.all(updatePromises);
    },
    [user]
  );

  const bulkUncomplete = useCallback(
    async (selectedIds: string[]) => {
      if (!user) return;

      const updatePromises = selectedIds.map((id) => {
        const taskRef = doc(db, "users", user.uid, "tasks", id);
        return updateDoc(taskRef, { completed: false });
      });

      await Promise.all(updatePromises);
    },
    [user]
  );

  const bulkDelete = useCallback(
    async (selectedIds: string[]) => {
      if (!user) return;

      const deletePromises = selectedIds.map((id) => {
        const taskRef = doc(db, "users", user.uid, "tasks", id);
        return deleteDoc(taskRef);
      });

      await Promise.all(deletePromises);
    },
    [user]
  );

  const bulkCategoryChange = useCallback(
    async (selectedIds: string[], category: string) => {
      if (!user) return;

      const updatePromises = selectedIds.map((id) => {
        const taskRef = doc(db, "users", user.uid, "tasks", id);
        return updateDoc(taskRef, { category: category || null });
      });

      await Promise.all(updatePromises);
    },
    [user]
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
    loading,
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
