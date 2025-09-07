import React from "react";
import Button from "../Button";

interface AppHeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <>
      {/* Dark Mode Toggle Button */}
      <Button
        onClick={onToggleDarkMode}
        variant="secondary"
        size="sm"
        className="fixed top-4 right-4 z-10"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </Button>

      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        To-Do App
      </h1>
    </>
  );
};

export default React.memo(AppHeader);
