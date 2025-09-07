import React from "react";
import type { TaskFilter } from "../types";

interface FilterButtonsProps {
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  currentFilter,
  onFilterChange,
  taskCounts,
}) => {
  const filters: { key: TaskFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: taskCounts.all },
    { key: "active", label: "Active", count: taskCounts.active },
    { key: "completed", label: "Completed", count: taskCounts.completed },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {filters.map(({ key, label, count }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            currentFilter === key
              ? key === "completed"
                ? "bg-green-500 text-white dark:bg-green-600"
                : key === "all"
                ? "bg-purple-500 text-white dark:bg-purple-600"
                : key === "active"
                ? "bg-orange-500 text-white dark:bg-orange-600"
                : "bg-blue-500 text-white dark:bg-blue-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {label} ({count})
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
