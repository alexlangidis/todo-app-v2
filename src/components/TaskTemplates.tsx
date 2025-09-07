import React from "react";
import Button from "./Button";

interface TaskTemplate {
  id: string;
  name: string;
  text: string;
  category?: string;
  priority?: "low" | "medium" | "high";
}

interface TaskTemplatesProps {
  onSelectTemplate: (template: Omit<TaskTemplate, "id">) => void;
}

const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: "meeting",
    name: "Meeting",
    text: "Team meeting at 2 PM",
    category: "work",
    priority: "medium",
  },
  {
    id: "shopping",
    name: "Shopping",
    text: "Grocery shopping",
    category: "shopping",
    priority: "low",
  },
  {
    id: "exercise",
    name: "Exercise",
    text: "Go to the gym",
    category: "health",
    priority: "high",
  },
  {
    id: "reading",
    name: "Reading",
    text: "Read for 30 minutes",
    category: "learning",
    priority: "medium",
  },
  {
    id: "project",
    name: "Project",
    text: "Work on project milestone",
    category: "work",
    priority: "high",
  },
  {
    id: "call",
    name: "Call",
    text: "Call back client",
    category: "work",
    priority: "medium",
  },
];

const TaskTemplates: React.FC<TaskTemplatesProps> = ({ onSelectTemplate }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
        Quick Templates
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {TASK_TEMPLATES.map((template) => (
          <Button
            key={template.id}
            onClick={() =>
              onSelectTemplate({
                name: template.name,
                text: template.text,
                category: template.category,
                priority: template.priority,
              })
            }
            variant="secondary"
            size="sm"
            className="text-left p-3 h-auto whitespace-normal"
          >
            <div className="font-medium text-sm">{template.name}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {template.text}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TaskTemplates;
