# Modern To-Do App

A responsive to-do application built with React, TypeScript, and Tailwind CSS using Vite for fast development.

## Features

### Core Features

- ✅ Add new tasks with form validation
- ✅ Toggle task completion status
- ✅ Edit tasks inline
- ✅ Delete tasks with archive functionality
- ✅ Task categories and priorities
- ✅ Due dates with overdue detection
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript strict mode enabled
- ✅ Firebase authentication and Firestore persistence
- ✅ Real-time data synchronization
- ✅ Dark mode toggle

### New Pages & Features

- ✅ **Navigation Header**: Modern responsive header with mobile hamburger menu
- ✅ **Categories Page**: Dedicated page for managing categories with search and filtering
- ✅ **Overdue Tasks Page**: View and manage overdue tasks with sorting and bulk actions
- ✅ **Archive Page**: Restore or permanently delete archived tasks with pagination
- ✅ **Soft Delete**: Tasks are archived instead of permanently deleted
- ✅ **Bulk Operations**: Select multiple tasks for batch operations
- ✅ **Advanced Filtering**: Filter by category, priority, due date, and status
- ✅ **Search Functionality**: Search tasks and categories
- ✅ **Unit Tests**: Test coverage with Vitest and React Testing Library

## Tech Stack

- **React 19** with hooks for state management
- **TypeScript** with strict mode
- **Vite** for build tooling
- **React Router** for client-side routing
- **Firebase** for authentication and Firestore database
- **Tailwind CSS** for styling
- **Vitest** for unit testing
- **React Testing Library** for component testing
- **DnD Kit** for drag-and-drop functionality
- **ESLint** for code linting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project (for authentication and data storage)

### Firebase Setup

1. **Create a Firebase Project:**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" or select existing project
   - Enable **Authentication** and **Firestore Database**

2. **Get Firebase Configuration:**

   - Go to Project Settings → General → Your apps → Web app
   - Copy the configuration values

3. **Set up Environment Variables:**

   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env with your Firebase config values
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Configure Firestore Security Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{documents=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd todo-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up Firebase (see Firebase Setup section above)
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Running Tests

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui
```

## Project Structure

```
src/
├── components/
│   ├── App/
│   │   ├── AppHeader.tsx      # Responsive navigation header
│   │   ├── AppFilters.tsx     # Task filtering controls
│   │   └── AppContent.tsx     # Main task content area
│   ├── TaskForm.tsx           # Form for adding new tasks
│   ├── TaskItem.tsx           # Individual task component
│   ├── TaskList.tsx           # List of tasks with drag & drop
│   ├── TaskStats.tsx          # Task statistics dashboard
│   ├── CategoryManager.tsx    # Category management component
│   ├── SearchBar.tsx          # Search input component
│   ├── Button.tsx             # Reusable button component
│   └── ...
├── pages/
│   ├── MainPage.tsx           # Main tasks page
│   ├── CategoriesPage.tsx     # Category management page
│   ├── OverduePage.tsx        # Overdue tasks page
│   └── ArchivePage.tsx        # Archived tasks page
├── hooks/
│   ├── useTasks.ts            # Task management hook
│   ├── useCategories.ts       # Category management hook
│   ├── useAuth.ts             # Authentication hook
│   └── ...
├── types/
│   └── index.ts               # TypeScript interfaces
├── test/
│   └── setup.ts               # Test configuration
├── App.tsx                    # Main application with routing
├── main.tsx                   # Application entry point
├── firebase.ts                # Firebase configuration
└── index.css                  # Global styles with Tailwind
```

## New Features Overview

### Navigation & Routing

The app now features a modern, responsive navigation header with:

- Desktop navigation menu with active page indicators
- Mobile hamburger menu with collapsible navigation
- Accessibility features (ARIA labels, keyboard navigation)
- User authentication status display

### Categories Management Page (`/categories`)

- **Enhanced CRUD Operations**: Create, read, update, delete categories
- **Search Functionality**: Filter categories by name
- **Color Customization**: Assign custom colors to categories
- **Validation**: Prevent duplicate category names
- **Tips Section**: User guidance for effective category management

### Overdue Tasks Page (`/overdue`)

- **Automatic Detection**: Tasks with due dates past the current date
- **Sorting Options**: Sort by due date, priority, or task name
- **Filtering**: Filter by category and priority
- **Bulk Actions**: Mark multiple tasks as complete or reschedule
- **Statistics Dashboard**: Overview of overdue tasks and high-priority items
- **Visual Indicators**: Red highlighting for overdue tasks

### Archive Page (`/archive`)

- **Soft Delete System**: Tasks are archived instead of permanently deleted
- **Advanced Search & Filtering**: Search by content/ID, filter by category, status, and archived date
- **Sorting Options**: Sort by archived date, task name, or category (ascending/descending)
- **Enhanced Task Display**: Shows archived date, completion status, priority, due dates, and task ID
- **Quick Actions**: View details, edit, restore, or delete each task individually
- **Bulk Operations**: Select multiple tasks for batch restore or permanent deletion
- **Confirm Dialogs**: Safety prompts for destructive actions with task details and warnings
- **Keyboard Shortcuts**: Ctrl+A for select all, Delete key for bulk operations with confirmation
- **Export Functionality**: Download archived tasks as JSON files for backup or analysis
- **Pagination**: Efficient navigation through large lists of archived tasks
- **Error Handling**: User-friendly messages for failed restore/delete operations
- **Responsive Design**: Optimized for mobile and desktop viewing

### Testing

- **Unit Tests**: Comprehensive test coverage with Vitest
- **Component Testing**: React Testing Library for UI component tests
- **Test Configuration**: Proper setup for modern testing environment

## Future Enhancements

The codebase continues to be structured for easy expansion. Potential features to add:

- **Task Templates**: Pre-defined task templates for common activities
- **Task Dependencies**: Link tasks with prerequisites
- **Time Tracking**: Log time spent on tasks
- **File Attachments**: Attach files to tasks
- **Task Sharing**: Share tasks with other users
- **Advanced Notifications**: Email/SMS reminders for due tasks
- **Data Export**: Export tasks to various formats
- **Offline Support**: PWA functionality for offline use

## Component Props

### TaskForm

- `onAddTask: (text: string) => void` - Callback when task is added

### TaskItem

- `task: Task` - Task object
- `onToggle: (id: string) => void` - Callback when task is toggled
- `onDelete?: (id: string) => void` - Optional callback for deletion

### TaskList

- `tasks: Task[]` - Array of tasks
- `onToggle: (id: string) => void` - Callback when task is toggled
- `onDelete?: (id: string) => void` - Optional callback for deletion

## TypeScript Interfaces

```typescript
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  status?: "pending" | "in-progress" | "completed";
  category?: string;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
  order: number;
  isArchived?: boolean;
  deletedAt?: Date;
}

interface Category {
  id: string;
  label: string;
  color: string;
}

type TaskFilter = "all" | "active" | "completed";
type TaskStatus = "pending" | "in-progress" | "completed";
type TaskPriority = "low" | "medium" | "high";
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
