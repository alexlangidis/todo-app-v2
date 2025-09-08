import React from "react";
import type { Task } from "../types";

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Category breakdown
  const categoryStats = tasks.reduce((acc, task) => {
    if (task.category) {
      if (!acc[task.category]) {
        acc[task.category] = { total: 0, completed: 0 };
      }
      acc[task.category].total++;
      if (task.completed) {
        acc[task.category].completed++;
      }
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  // Count uncategorized tasks
  const uncategorizedTasks = tasks.filter((task) => !task.category);
  const uncategorizedStats = {
    total: uncategorizedTasks.length,
    completed: uncategorizedTasks.filter((task) => task.completed).length,
  };

  if (totalTasks === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          📊 Task Statistics
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Add some tasks to see your productivity stats!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        📊 Task Statistics
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalTasks}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Tasks
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {completedTasks}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Completed
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {activeTasks}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {completionRate}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Completion Rate
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>
            {completedTasks}/{totalTasks}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Category Breakdown */}
      {(Object.keys(categoryStats).length > 0 ||
        uncategorizedStats.total > 0) && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📂 By Category
          </h4>
          <div className="space-y-2">
            {Object.entries(categoryStats).map(([categoryId, stats]) => {
              const categoryName =
                ["work", "personal", "shopping", "health", "learning"].find(
                  (id) => id === categoryId
                ) || categoryId;
              const categoryRate = Math.round(
                (stats.completed / stats.total) * 100
              );

              return (
                <div
                  key={categoryId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="capitalize text-gray-600 dark:text-gray-400">
                    {categoryName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-500">
                      {stats.completed}/{stats.total}
                    </span>
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-1 rounded-full"
                        style={{ width: `${categoryRate}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-500 w-8">
                      {categoryRate}%
                    </span>
                  </div>
                </div>
              );
            })}
            {uncategorizedStats.total > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize text-gray-600 dark:text-gray-400">
                  Uncategorized
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-500">
                    {uncategorizedStats.completed}/{uncategorizedStats.total}
                  </span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-1 rounded-full"
                      style={{
                        width: `${
                          uncategorizedStats.total > 0
                            ? Math.round(
                                (uncategorizedStats.completed /
                                  uncategorizedStats.total) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500 w-8">
                    {uncategorizedStats.total > 0
                      ? Math.round(
                          (uncategorizedStats.completed /
                            uncategorizedStats.total) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskStats;
