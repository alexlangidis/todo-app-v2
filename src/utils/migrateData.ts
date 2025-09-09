import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Task } from "../types";

/**
 * Utility function to migrate existing localStorage tasks to Firestore
 * Call this function once after authentication to migrate existing data
 */
export async function migrateLocalStorageToFirestore(
  userId: string
): Promise<void> {
  try {
    // Get existing tasks from localStorage
    const localTasks = localStorage.getItem("todo-tasks");
    if (!localTasks) {
      console.log("No localStorage data found to migrate");
      return;
    }

    const tasks: Task[] = JSON.parse(localTasks);
    if (tasks.length === 0) {
      console.log("No tasks to migrate");
      return;
    }

    console.log(`Migrating ${tasks.length} tasks to Firestore...`);

    // Migrate each task to Firestore
    const tasksRef = collection(db, "users", userId, "tasks");
    const migrationPromises = tasks.map(async (task) => {
      // Convert Date objects back from strings if needed
      const firestoreTask = {
        ...task,
        createdAt:
          task.createdAt instanceof Date
            ? task.createdAt
            : new Date(task.createdAt),
        dueDate: task.dueDate
          ? task.dueDate instanceof Date
            ? task.dueDate
            : new Date(task.dueDate)
          : null,
        category: task.category || null,
        priority: task.priority || null,
        status: task.status || "pending",
      };

      return addDoc(tasksRef, firestoreTask);
    });

    await Promise.all(migrationPromises);

    // Clear localStorage after successful migration
    localStorage.removeItem("todo-tasks");
    console.log("Migration completed successfully! localStorage cleared.");
  } catch (error) {
    console.error("Error migrating data:", error);
    throw error;
  }
}

/**
 * Check if user has localStorage data that needs migration
 */
export function hasLocalStorageData(): boolean {
  const localTasks = localStorage.getItem("todo-tasks");
  if (!localTasks) return false;

  try {
    const tasks = JSON.parse(localTasks);
    return Array.isArray(tasks) && tasks.length > 0;
  } catch {
    return false;
  }
}

/**
 * Clear all categories from Firestore (useful for resetting to clean state)
 */
export async function clearAllCategories(userId: string): Promise<void> {
  try {
    const { collection, getDocs, deleteDoc, doc } = await import(
      "firebase/firestore"
    );
    const { db } = await import("../firebase");

    const categoriesRef = collection(db, "users", userId, "categories");
    const snapshot = await getDocs(categoriesRef);

    const deletePromises = snapshot.docs.map((document) => {
      return deleteDoc(doc(db, "users", userId, "categories", document.id));
    });

    await Promise.all(deletePromises);
    console.log("All categories cleared successfully");
  } catch (error) {
    console.error("Error clearing categories:", error);
    throw error;
  }
}
