import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AppHeader from "./components/App/AppHeader";
import TasksPage from "./pages/TasksPage";
import CategoriesPage from "./pages/CategoriesPage";
import OverduePage from "./pages/OverduePage";
import ArchivePage from "./pages/ArchivePage";
import Auth from "./components/Auth";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

/**
 * App content component that handles navigation after authentication
 */
function AppContent() {
  const navigate = useNavigate();
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
      // Redirect to the base app URL to ensure clean logout
      window.location.href = "/todo-app-v2/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAuthSuccess = () => {
    // Navigate to tasks page after successful authentication
    navigate("/tasks");
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
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
        userEmail={user?.email}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/overdue" element={<OverduePage />} />
        <Route path="/archive" element={<ArchivePage />} />
      </Routes>
    </div>
  );
}

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
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
