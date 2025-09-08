import React, { useState, useEffect } from "react";
import Button from "./Button";
import type { Category } from "../types";

interface BulkActionsProps {
  selectedTasks: string[];
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkComplete: () => void;
  onBulkUncomplete: () => void;
  onBulkDelete: () => void;
  onBulkCategoryChange: (category: string) => void;
  totalTasks: number;
  categories: Category[];
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedTasks,
  onSelectAll,
  onClearSelection,
  onBulkComplete,
  onBulkUncomplete,
  onBulkDelete,
  onBulkCategoryChange,
  totalTasks,
  categories,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  // Reset category selection when selection is cleared
  useEffect(() => {
    if (selectedTasks.length === 0) {
      setSelectedCategory("");
    }
  }, [selectedTasks.length]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onBulkCategoryChange(category);
  };

  const handleClearSelection = () => {
    setSelectedCategory("");
    onClearSelection();
  };
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row m-auto flex-wrap items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
        <span className="font-medium m-auto sm:m-0 sm:mr-0">
          {selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""}{" "}
          selected
        </span>

        <div className="flex flex-col sm:flex-row gap-2 m-auto sm:ml-auto sm:m-0">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-1 text-sm border border-blue-300 dark:border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="" disabled>
              Change Category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>

          <Button
            onClick={onSelectAll}
            variant="primary"
            size="sm"
            disabled={selectedTasks.length === totalTasks}
          >
            Select All
          </Button>

          <Button onClick={handleClearSelection} variant="warning" size="sm">
            Clear
          </Button>

          <Button onClick={onBulkComplete} variant="success" size="sm">
            Complete
          </Button>

          <Button onClick={onBulkUncomplete} variant="info" size="sm">
            Uncomplete
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
