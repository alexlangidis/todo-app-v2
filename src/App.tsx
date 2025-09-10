import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AppHeader from "./components/App/AppHeader";
import MainPage from "./pages/MainPage";
import CategoriesPage from "./pages/CategoriesPage";
import OverduePage from "./pages/OverduePage";
import ArchivePage from "./pages/ArchivePage";
import Auth from "./components/Auth";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Main application component for the Todo App
 *
 * Features:
 * - Task management with Firebase/Firestore persistence
 * - User authentication (login/register)
 * - Multiple pages: Tasks, Categories, Overdue, Archive
 * - Dark mode toggle
 * - Responsive design
 * - Real-time data synchronization
 *
 * @returns The main application component
 */
function App() {
  const { user, loading, isAuthenticated } = useAuth();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("todo-theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem("todo-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth component if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppHeader
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
          userEmail={user?.email}
        />

        <Routes>
          <Route path="/" element={<MainPage />} />
          {/* Placeholder routes for future pages */}
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/overdue" element={<OverduePage />} />
          <Route path="/archive" element={<ArchivePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
