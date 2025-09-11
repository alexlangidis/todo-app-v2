import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import Button from "../Button";

interface AppHeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout?: () => void;
  userEmail?: string | null;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  userEmail,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { tasks } = useTasks();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".mobile-menu") && !target.closest(".menu-toggle")) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Calculate overdue tasks count
  const overdueCount = useMemo(() => {
    const now = new Date();
    return tasks.filter((task) => {
      if (task.completed) return false;
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < now;
    }).length;
  }, [tasks]);

  const navigation = [
    { name: "Tasks", href: "/tasks", icon: "📝" },
    { name: "Categories", href: "/categories", icon: "🏷️" },
    { name: "Overdue", href: "/overdue", icon: "⏰", count: overdueCount },
    { name: "Archive", href: "/archive", icon: "📁" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Go to main tasks page"
            >
              To-Do App
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const hasOverdueTasks =
                item.name === "Overdue" && item.count && item.count > 0;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    isActive(item.href)
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : hasOverdueTasks
                      ? "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <span className="mr-2" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.name}
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                        hasOverdueTasks
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            {/* User info - hidden on small screens */}
            {userEmail && (
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden lg:block">
                {userEmail}
              </span>
            )}

            {/* Dark mode toggle */}
            <Button
              onClick={onToggleDarkMode}
              variant="secondary"
              size="sm"
              aria-label="Toggle dark mode"
              className="p-2"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </Button>

            {/* Logout button - hidden on mobile since it's in mobile menu */}
            {onLogout && (
              <Button
                onClick={onLogout}
                variant="secondary"
                size="sm"
                className="text-xs !hidden md:!block"
              >
                Logout
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 menu-toggle"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            {navigation.map((item) => {
              const hasOverdueTasks =
                item.name === "Overdue" && item.count && item.count > 0;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : hasOverdueTasks
                      ? "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <span className="mr-3" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.name}
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        hasOverdueTasks
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Mobile logout */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="mr-3" aria-hidden="true">
                  🚪
                </span>
                Logout
              </button>
            )}

            {/* Mobile user email */}
            {userEmail && (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 mt-2 pt-2">
                {userEmail}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default React.memo(AppHeader);
