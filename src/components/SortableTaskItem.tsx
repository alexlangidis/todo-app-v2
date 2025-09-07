import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskItem from "./TaskItem";
import type { Task } from "../types";

interface SortableTaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, newText: string) => void;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  showSelection?: boolean;
}

const SortableTaskItem: React.FC<SortableTaskItemProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskItem
        {...props}
        dragHandleProps={listeners}
        isDragging={isDragging}
      />
    </div>
  );
};

export default SortableTaskItem;
