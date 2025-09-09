import React from "react";
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
  return (
    <>
      {/* Top right controls */}
      <div className="fixed top-4 right-4 z-10 flex items-center gap-2">
        {userEmail && (
          <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
            {userEmail}
          </span>
        )}
        {onLogout && (
          <Button
            onClick={onLogout}
            variant="secondary"
            size="sm"
            className="text-xs"
          >
            Logout
          </Button>
        )}
        <Button
          onClick={onToggleDarkMode}
          variant="secondary"
          size="sm"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        To-Do App
      </h1>
    </>
  );
};

export default React.memo(AppHeader);
