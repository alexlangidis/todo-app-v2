import React, { useCallback } from "react";
import type { Category } from "../types";
import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_CATEGORIES } from "../types";

/**
 * Custom hook for managing categories with localStorage persistence
 * @returns Object containing categories state and management functions
 */
export const useCategories = () => {
  const [categories, setCategories] = useLocalStorage<Category[]>(
    "todo-categories",
    DEFAULT_CATEGORIES
  );

  // Ensure "Uncategorized" category is always present
  const ensuredCategories = React.useMemo(() => {
    const hasUncategorized = categories.some(
      (cat) => cat.id === "uncategorized"
    );
    if (!hasUncategorized) {
      return [
        { id: "uncategorized", label: "Uncategorized", color: "#6b7280" },
        ...categories,
      ];
    }
    return categories;
  }, [categories]);

  const addCategory = useCallback(
    (label: string, color: string = "#6b7280") => {
      const newCategory: Category = {
        id: Date.now().toString(),
        label,
        color,
      };
      setCategories((prevCategories) => [...prevCategories, newCategory]);
    },
    [setCategories]
  );

  const deleteCategory = useCallback(
    (id: string, tasks: { category?: string }[]) => {
      // Prevent deletion of "Uncategorized" category
      if (id === "uncategorized") {
        throw new Error("Cannot delete the Uncategorized category");
      }

      // Check if category is in use
      const isInUse = tasks.some((task) => task.category === id);
      if (isInUse) {
        throw new Error("Cannot delete category that is in use by tasks");
      }
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
    },
    [setCategories]
  );

  const renameCategory = useCallback(
    (id: string, newLabel: string) => {
      // Prevent renaming of "Uncategorized" category
      if (id === "uncategorized") {
        throw new Error("Cannot rename the Uncategorized category");
      }

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === id ? { ...category, label: newLabel } : category
        )
      );
    },
    [setCategories]
  );

  const updateCategoryColor = useCallback(
    (id: string, newColor: string) => {
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === id ? { ...category, color: newColor } : category
        )
      );
    },
    [setCategories]
  );

  const getCategoryById = useCallback(
    (id: string) => {
      return categories.find((category) => category.id === id);
    },
    [categories]
  );

  const isCategoryNameTaken = useCallback(
    (name: string, excludeId?: string) => {
      return categories.some(
        (category) =>
          category.label.toLowerCase() === name.toLowerCase() &&
          category.id !== excludeId
      );
    },
    [categories]
  );

  return {
    categories: ensuredCategories,
    addCategory,
    deleteCategory,
    renameCategory,
    updateCategoryColor,
    getCategoryById,
    isCategoryNameTaken,
  };
};
