# Modern To-Do App

A responsive to-do application built with React, TypeScript, and Tailwind CSS using Vite for fast development.

## Features

- ✅ Add new tasks with form validation
- ✅ Toggle task completion status
- ✅ Delete tasks (expansion ready)
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript strict mode enabled
- ✅ Basic error handling
- ✅ Clean, minimal UI

## Tech Stack

- **React 18** with hooks for state management
- **TypeScript** with strict mode
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **ESLint** for code linting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

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
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── TaskForm.tsx    # Form for adding new tasks
│   ├── TaskItem.tsx    # Individual task component
│   └── TaskList.tsx    # List of tasks
├── types/
│   └── index.ts        # TypeScript interfaces
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## Future Enhancements

The codebase is structured for easy expansion. Potential features to add:

- **Task Filtering**: Filter by all/active/completed
- **Task Editing**: Inline editing of task text
- **Local Storage**: Persist tasks in browser storage
- **Categories/Tags**: Organize tasks by category
- **Due Dates**: Add deadline functionality
- **Drag & Drop**: Reorder tasks
- **Dark Mode**: Toggle between light/dark themes
- **Notifications**: Browser notifications for due tasks

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
}

type TaskFilter = "all" | "active" | "completed";
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
