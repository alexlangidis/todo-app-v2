import React from "react";
import type { TaskFilter, Category } from "../../types";
import { TASK_PRIORITIES } from "../../types";
import FilterButtons from "../FilterButtons";
import SearchBar from "../SearchBar";

interface AppFiltersProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
  taskCounts: { all: number; active: number; completed: number };
  showBulkActions: boolean;
  onToggleBulkActions: () => void;
  onClearFilters: () => void;
  categories: Category[];
}

const AppFilters: React.FC<AppFiltersProps> = ({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  taskCounts,
  showBulkActions,
  onToggleBulkActions,
  onClearFilters,
  categories,
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <FilterButtons
          currentFilter={filter}
          onFilterChange={onFilterChange}
          taskCounts={taskCounts}
        />

        <div className="flex flex-wrap gap-2 sm:self-start">
          <button
            onClick={onToggleBulkActions}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              showBulkActions
                ? "bg-orange-500 text-white dark:bg-orange-600"
                : "bg-orange-200 text-orange-700 hover:bg-orange-300 dark:bg-orange-700 dark:text-orange-300 dark:hover:bg-orange-600"
            }`}
          >
            {showBulkActions ? "Exit Bulk" : "Bulk Select"}
          </button>

          <button
            onClick={onClearFilters}
            className="px-3 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
          <div className="w-full sm:flex-1">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
            />
          </div>
          <div className="w-full sm:w-auto sm:min-w-[160px]">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-auto sm:min-w-[140px]">
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="">All Priorities</option>
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(AppFilters);
