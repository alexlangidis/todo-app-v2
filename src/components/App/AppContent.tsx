import React from "react";
import type {
  Task,
  TaskFilter,
  Category,
  TaskStatus,
  TaskPriority,
} from "../../types";
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
  onUpdateDetails: (
    id: string,
    updates: {
      status?: TaskStatus;
      category?: string;
      priority?: TaskPriority;
      dueDate?: Date;
    }
  ) => void;
  onSelectTask: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkComplete: () => void;
  onBulkUncomplete: () => void;
  onBulkDelete: () => void;
  onBulkCategoryChange: (category: string) => void;
  categories: Category[];
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
  onUpdateDetails,
  onSelectTask,
  onSelectAll,
  onClearSelection,
  onBulkComplete,
  onBulkUncomplete,
  onBulkDelete,
  onBulkCategoryChange,
  categories,
}) => {
  return (
    <>
      {showBulkActions && (
        <BulkActions
          selectedTasks={selectedTasks}
          onSelectAll={onSelectAll}
          onClearSelection={onClearSelection}
          onBulkComplete={onBulkComplete}
          onBulkUncomplete={onBulkUncomplete}
          onBulkDelete={onBulkDelete}
          onBulkCategoryChange={onBulkCategoryChange}
          totalTasks={tasks.length}
          categories={categories}
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
        onUpdateDetails={onUpdateDetails}
        selectedTasks={selectedTasks}
        onSelectTask={onSelectTask}
        showSelection={showBulkActions}
        categories={categories}
      />
    </>
  );
};

export default React.memo(AppContent);
