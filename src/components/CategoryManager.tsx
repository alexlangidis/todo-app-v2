import React, { useState } from "react";
import Button from "./Button";
import type { Category } from "../types";
import { clearAllCategories } from "../utils/migrateData";
import { useAuth } from "../hooks/useAuth";

interface CategoryManagerProps {
  categories: Category[];
  tasks: { category?: string }[];
  onAddCategory: (label: string, color: string) => void;
  onDeleteCategory: (id: string, tasks: { category?: string }[]) => void;
  onRenameCategory: (id: string, newLabel: string) => void;
  onUpdateCategoryColor: (id: string, newColor: string) => void;
  isCategoryNameTaken: (name: string, excludeId?: string) => boolean;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  tasks,
  onAddCategory,
  onDeleteCategory,
  onRenameCategory,
  onUpdateCategoryColor,
  isCategoryNameTaken,
}) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6b7280");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingColor, setEditingColor] = useState("");
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      setError("Category name cannot be empty");
      return;
    }
    if (isCategoryNameTaken(trimmedName)) {
      setError("Category name already exists");
      return;
    }
    onAddCategory(trimmedName, newCategoryColor);
    setNewCategoryName("");
    setNewCategoryColor("#6b7280");
    setError("");
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.label);
    setEditingColor(category.color);
  };

  const handleSaveEdit = async () => {
    const trimmedName = editingName.trim();
    if (!trimmedName) {
      setError("Category name cannot be empty");
      return;
    }
    if (isCategoryNameTaken(trimmedName, editingId!)) {
      setError("Category name already exists");
      return;
    }

    setSaving(true);
    try {
      await onRenameCategory(editingId!, trimmedName);
      await onUpdateCategoryColor(editingId!, editingColor);
      setEditingId(null);
      setEditingName("");
      setEditingColor("");
      setError("");
    } catch (error) {
      setError("Failed to update category. Please try again.");
      console.error("Error updating category:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingColor("");
    setError("");
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await onDeleteCategory(id, tasks);
      setDeleteConfirm(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete category"
      );
      console.error("Error deleting category:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    } else if (e.key === "Escape") {
      if (editingId) {
        handleCancelEdit();
      } else {
        setNewCategoryName("");
        setError("");
      }
    }
  };

  const handleResetCategories = async () => {
    if (!user) return;

    setResetting(true);
    try {
      await clearAllCategories(user.uid);
      setResetConfirm(false);
      setError("");
      // The categories will automatically refresh via the Firestore listener
    } catch (error) {
      setError("Failed to reset categories. Please try again.");
      console.error("Error resetting categories:", error);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left focus:outline-none rounded"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          🏷️ Manage Categories
          <span className="ml-auto text-lg">{isExpanded ? "🔽" : "▶️"}</span>
        </h2>
      </button>

      {isExpanded && (
        <>
          {/* Add New Category Form */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddCategory)}
                placeholder="New category name..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                maxLength={50}
              />
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-white dark:bg-gray-700"
                title="Choose category color"
              />
              <Button
                onClick={handleAddCategory}
                variant="primary"
                size="sm"
                className="px-4 py-2 text-sm cursor-pointer whitespace-nowrap"
              >
                Add
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Categories List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                {editingId === category.id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, handleSaveEdit)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                      maxLength={50}
                    />
                    <input
                      type="color"
                      value={editingColor}
                      onChange={(e) => setEditingColor(e.target.value)}
                      className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-600"
                      title="Choose category color"
                    />
                    <Button
                      onClick={handleSaveEdit}
                      variant="primary"
                      size="sm"
                      className="px-2 py-1 text-xs cursor-pointer"
                      disabled={saving}
                    >
                      {saving ? "..." : "Save"}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="secondary"
                      size="sm"
                      className="px-2 py-1 text-xs cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span
                      className="inline-block w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">
                      {category.label}
                    </span>
                    <Button
                      onClick={() => handleStartEdit(category)}
                      variant="secondary"
                      size="sm"
                      className="px-2 py-1 text-xs cursor-pointer"
                      aria-label={`Edit ${category.label}`}
                    >
                      ✏️
                    </Button>
                    {deleteConfirm === category.id ? (
                      <>
                        <Button
                          onClick={() => handleDelete(category.id)}
                          variant="danger"
                          size="sm"
                          className="px-2 py-1 text-xs cursor-pointer"
                          disabled={deleting === category.id}
                        >
                          {deleting === category.id ? "..." : "Confirm"}
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirm(null)}
                          variant="secondary"
                          size="sm"
                          className="px-2 py-1 text-xs cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setDeleteConfirm(category.id)}
                        variant="secondary"
                        size="sm"
                        className="px-2 py-1 text-xs cursor-pointer"
                        aria-label={`Delete ${category.label}`}
                      >
                        🗑️
                      </Button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Reset Categories Section */}
          {categories.length > 1 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Reset all categories to start fresh
              </div>
              {resetConfirm ? (
                <div className="flex gap-2">
                  <Button
                    onClick={handleResetCategories}
                    variant="danger"
                    size="sm"
                    disabled={resetting}
                    className="px-3 py-1 text-xs"
                  >
                    {resetting ? "Resetting..." : "Confirm Reset"}
                  </Button>
                  <Button
                    onClick={() => setResetConfirm(false)}
                    variant="secondary"
                    size="sm"
                    className="px-3 py-1 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setResetConfirm(true)}
                  variant="secondary"
                  size="sm"
                  className="px-3 py-1 text-xs text-red-600 hover:text-red-700"
                >
                  🔄 Reset Categories
                </Button>
              )}
            </div>
          )}

          {categories.length === 0 && (
            <p className="text-center py-4 text-gray-500 dark:text-gray-400">
              No categories yet. Add one above!
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryManager;
