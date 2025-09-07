import React from "react";
import type { Task, TaskFilter } from "../../types";
import TaskList from "../TaskList";
import BulkActions from "../BulkActions";

interface AppContentProps {
  tasks: Task[];
  filter: TaskFilter;
  searchQuery: string;
  categoryFilter: string;
  priorityFilter: string;
  selectedTasks: string[];
  showBulkActions: boolean;
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
  onBulkComplete: () => void;
  onBulkDelete: () => void;
  onBulkCategoryChange: (category: string) => void;
}

const AppContent: React.FC<AppContentProps> = ({
  tasks,
  filter,
  searchQuery,
  categoryFilter,
  priorityFilter,
  selectedTasks,
  showBulkActions,
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
