export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  category?: string;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
  order: number;
}

export type TaskFilter = "all" | "active" | "completed";

export const TASK_CATEGORIES = [
  { id: "work", label: "Work", color: "bg-blue-500" },
  { id: "personal", label: "Personal", color: "bg-green-500" },
  { id: "shopping", label: "Shopping", color: "bg-purple-500" },
  { id: "health", label: "Health", color: "bg-red-500" },
  { id: "learning", label: "Learning", color: "bg-yellow-500" },
] as const;

export const TASK_PRIORITIES = [
  { id: "low", label: "Low Priority", color: "bg-green-500" },
  { id: "medium", label: "Medium Priority", color: "bg-yellow-500" },
  { id: "high", label: "High Priority", color: "bg-red-500" },
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number]["id"];
export type TaskPriority = (typeof TASK_PRIORITIES)[number]["id"];
