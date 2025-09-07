import React from "react";
import type { Task, TaskFilter } from "../../types";
import TaskForm from "../TaskForm";
import TaskList from "../TaskList";
import TaskStats from "../TaskStats";
import BulkActions from "../BulkActions";

interface AppContentProps {
  tasks: Task[];
  filter: TaskFilter;
  searchQuery: string;
  categoryFilter: string;
  priorityFilter: string;
  selectedTasks: string[];
  showBulkActions: boolean;
  isLoading: boolean;
  onAddTask: (
    text: string,
    category?: string,
    dueDate?: Date,
    priority?: "low" | "medium" | "high"
  ) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  onSelectTask: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkComplete: () => Promise<void>;
  onBulkDelete: () => Promise<void>;
  onBulkCategoryChange: (category: string) => Promise<void>;
}

const AppContent: React.FC<AppContentProps> = ({
  tasks,
  filter,
  searchQuery,
  categoryFilter,
  priorityFilter,
  selectedTasks,
  showBulkActions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLoading, // TODO: Use for loading states in bulk operations
  onAddTask,
  onToggle,
  onDelete,
  onEdit,
  onReorder,
  onSelectTask,
  onSelectAll,
  onClearSelection,
  onBulkComplete,
  onBulkDelete,
  onBulkCategoryChange,
}) => {
  return (
    <>
      <TaskStats tasks={tasks} />
      <TaskForm onAddTask={onAddTask} />

      {showBulkActions && (
        <BulkActions
          selectedTasks={selectedTasks}
          onSelectAll={onSelectAll}
          onClearSelection={onClearSelection}
          onBulkComplete={onBulkComplete}
          onBulkDelete={onBulkDelete}
          onBulkCategoryChange={onBulkCategoryChange}
          totalTasks={tasks.length}
        />
      )}

      <TaskList
        tasks={tasks}
        filter={filter}
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        priorityFilter={priorityFilter}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        onReorder={onReorder}
        selectedTasks={selectedTasks}
        onSelectTask={onSelectTask}
        showSelection={showBulkActions}
      />
    </>
  );
};

export default React.memo(AppContent);
