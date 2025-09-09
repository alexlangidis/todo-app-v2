import React, { useCallback, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./useAuth";
import type { Category } from "../types";
import { DEFAULT_CATEGORIES } from "../types";

/**
 * Custom hook for managing categories with Firestore persistence
 * @returns Object containing categories state and management functions
 */
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Set up real-time listener for user's categories
  useEffect(() => {
    if (!user) {
      setCategories(DEFAULT_CATEGORIES);
      setLoading(false);
      return;
    }

    const categoriesRef = collection(db, "users", user.uid, "categories");
    const q = query(categoriesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const categoriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      setCategories(categoriesData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Ensure "Uncategorized" category is always present
  const ensuredCategories = React.useMemo(() => {
    const hasUncategorized = categories.some(
      (cat) => cat.id === "uncategorized"
    );
    if (!hasUncategorized) {
      return [
        DEFAULT_CATEGORIES[0], // "Uncategorized" category
        ...categories,
      ];
    }
    return categories;
  }, [categories]);

  const addCategory = useCallback(
    async (label: string, color: string = "#6b7280") => {
      if (!user) return;

      const categoriesRef = collection(db, "users", user.uid, "categories");
      await addDoc(categoriesRef, {
        label,
        color,
        createdAt: new Date(),
      });
    },
    [user]
  );

  const deleteCategory = useCallback(
    async (id: string, tasks: { category?: string }[]) => {
      if (!user) return;

      // Prevent deletion of "Uncategorized" category
      if (id === "uncategorized") {
        throw new Error("Cannot delete the Uncategorized category");
      }

      // Check if category is in use
      const isInUse = tasks.some((task) => task.category === id);
      if (isInUse) {
        throw new Error("Cannot delete category that is in use by tasks");
      }

      const categoryRef = doc(db, "users", user.uid, "categories", id);
      await deleteDoc(categoryRef);
    },
    [user]
  );

  const renameCategory = useCallback(
    async (id: string, newLabel: string) => {
      if (!user) return;

      // Prevent renaming of "Uncategorized" category
      if (id === "uncategorized") {
        throw new Error("Cannot rename the Uncategorized category");
      }

      const categoryRef = doc(db, "users", user.uid, "categories", id);
      await updateDoc(categoryRef, { label: newLabel });
    },
    [user]
  );

  const updateCategoryColor = useCallback(
    async (id: string, newColor: string) => {
      if (!user) return;

      const categoryRef = doc(db, "users", user.uid, "categories", id);
      await updateDoc(categoryRef, { color: newColor });
    },
    [user]
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
    loading,
    addCategory,
    deleteCategory,
    renameCategory,
    updateCategoryColor,
    getCategoryById,
    isCategoryNameTaken,
  };
};
