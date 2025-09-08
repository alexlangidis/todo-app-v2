export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  status?: "pending" | "in-progress" | "completed";
  category?: string;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
  order: number;
}

export interface Category {
  id: string;
  label: string;
  color: string;
}

export type TaskFilter = "all" | "active" | "completed";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "uncategorized", label: "Uncategorized", color: "#6b7280" },
  { id: "work", label: "Work", color: "#3b82f6" },
  { id: "personal", label: "Personal", color: "#10b981" },
  { id: "shopping", label: "Shopping", color: "#6366f1" },
  { id: "health", label: "Health", color: "#ef4444" },
  { id: "learning", label: "Learning", color: "#eab308" },
];

export const TASK_STATUSES = [
  { id: "pending", label: "Pending", color: "bg-gray-500" },
  { id: "in-progress", label: "In Progress", color: "bg-blue-500" },
  { id: "completed", label: "Completed", color: "bg-green-500" },
] as const;

export const TASK_PRIORITIES = [
  { id: "low", label: "Low Priority", color: "bg-green-500" },
  { id: "medium", label: "Medium Priority", color: "bg-yellow-500" },
  { id: "high", label: "High Priority", color: "bg-red-500" },
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number]["id"];
export type TaskPriority = (typeof TASK_PRIORITIES)[number]["id"];
