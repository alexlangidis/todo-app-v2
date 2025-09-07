import React from "react";
import Button from "./Button";
import { TASK_CATEGORIES } from "../types";

interface BulkActionsProps {
  selectedTasks: string[];
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkComplete: () => void;
  onBulkDelete: () => void;
  onBulkCategoryChange: (category: string) => void;
  totalTasks: number;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedTasks,
  onSelectAll,
  onClearSelection,
  onBulkComplete,
  onBulkDelete,
  onBulkCategoryChange,
  totalTasks,
}) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row m-auto flex-wrap items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
        <span className="font-medium m-auto sm:m-0 sm:mr-0">
          {selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""}{" "}
          selected
        </span>

        <div className="flex flex-col sm:flex-row gap-2 m-auto sm:ml-auto sm:m-0">
          <select
            onChange={(e) => onBulkCategoryChange(e.target.value)}
            className="px-3 py-1 text-sm border border-blue-300 dark:border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            defaultValue=""
          >
            <option value="" disabled>
              Change Category
            </option>
            {TASK_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>

          <Button
            onClick={onSelectAll}
            variant="secondary"
            size="sm"
            disabled={selectedTasks.length === totalTasks}
          >
            Select All
          </Button>

          <Button onClick={onClearSelection} variant="secondary" size="sm">
            Clear
          </Button>

          <Button onClick={onBulkComplete} variant="primary" size="sm">
            Complete
          </Button>

          <Button onClick={onBulkDelete} variant="danger" size="sm">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;
