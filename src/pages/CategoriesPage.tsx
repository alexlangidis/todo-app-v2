import { useState, useMemo } from "react";
import { useCategories } from "../hooks/useCategories";
import CategoryManager from "../components/CategoryManager";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";

/**
 * Dedicated page for managing categories with enhanced features
 */
function CategoriesPage() {
  const {
    categories,
    loading,
    addCategory,
    deleteCategory,
    renameCategory,
    updateCategoryColor,
    isCategoryNameTaken,
  } = useCategories();

  const [searchQuery, setSearchQuery] = useState("");

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories;
    }
    return categories.filter((category) =>
      category.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Manage Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your tasks with custom categories. Create, edit, and manage
            your category system.
          </p>
        </div>

        {/* Search and Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder="Search categories..."
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Showing {filteredCategories.length} of {categories.length}{" "}
                categories
              </span>
              {searchQuery && (
                <Button
                  onClick={clearSearch}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Category Manager */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <CategoryManager
            categories={filteredCategories}
            tasks={[]} // Not needed for dedicated page
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
            onRenameCategory={renameCategory}
            onUpdateCategoryColor={updateCategoryColor}
            isCategoryNameTaken={isCategoryNameTaken}
          />
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            💡 Tips for Managing Categories
          </h3>
          <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
            <li>
              • Use descriptive names that clearly identify the type of tasks
            </li>
            <li>• Choose distinct colors to easily differentiate categories</li>
            <li>
              • Keep the number of categories manageable (recommended: 5-15)
            </li>
            <li>
              • Categories cannot be deleted if they contain tasks - move tasks
              first
            </li>
            <li>• The "Uncategorized" category cannot be renamed or deleted</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
