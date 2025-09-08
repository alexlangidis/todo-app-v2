import React from "react";
import type { Task, TaskFilter, Category } from "../types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTaskItem from "./SortableTaskItem";

interface TaskListProps {
  tasks: Task[];
  filter: TaskFilter;
  searchQuery: string;
  categoryFilter?: string;
  priorityFilter?: string;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, newText: string) => void;
  onReorder?: (activeId: string, overId: string) => void;
  selectedTasks?: string[];
  onSelectTask?: (id: string) => void;
  showSelection?: boolean;
  categories: Category[];
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  searchQuery,
  categoryFilter = "",
  priorityFilter = "",
  onToggle,
  onDelete,
  onEdit,
  onReorder,
  selectedTasks = [],
  onSelectTask,
  showSelection = false,
  categories,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorder) {
      onReorder(active.id as string, over.id as string);
    }
  };
  const filteredTasks = tasks.filter((task) => {
    // Filter by status
    const statusMatch = (() => {
      switch (filter) {
        case "active":
          return !task.completed;
        case "completed":
          return task.completed;
        default:
          return true;
      }
    })();

    // Filter by search query
    const searchMatch =
      searchQuery === "" ||
      task.text.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by category
    const categoryMatch =
      categoryFilter === "" || task.category === categoryFilter;

    // Filter by priority
    const priorityMatch =
      priorityFilter === "" || task.priority === priorityFilter;

    return statusMatch && searchMatch && categoryMatch && priorityMatch;
  });
  if (filteredTasks.length === 0) {
    const message =
      tasks.length === 0
        ? "No tasks yet. Add one above!"
        : filter === "active"
        ? "No active tasks. Great job!"
        : filter === "completed"
        ? "No completed tasks yet."
        : "No tasks match the current filter.";

    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>{message}</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filteredTasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              isSelected={selectedTasks.includes(task.id)}
              onSelect={onSelectTask}
              showSelection={showSelection}
              categories={categories}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default React.memo(TaskList);
