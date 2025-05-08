'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo, TodoStatus } from '@/types';
import { Trash2 } from 'lucide-react'; // Using lucide-react for icons

interface TodoCardProps {
  todo: Todo;
  columnId: TodoStatus; // To know which column it belongs to, if needed for styling or data
  onDelete?: (todoId: string) => void;
  isDragging?: boolean; // Optional: for styling the drag overlay or original item
}

export default function TodoCard({ todo, columnId, onDelete, isDragging }: TodoCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isOver } = useSortable({
    id: todo.id,
    data: { type: 'task', item: todo, parentColumn: columnId }, // Pass actual todo data
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Example: dim original item when dragging
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-3 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${isDragging ? 'ring-2 ring-indigo-500' : ''} ${isOver ? 'ring-2 ring-blue-400' : ''}`}
      aria-describedby={`todo-content-${todo.id}`}
    >
      <div className="flex justify-between items-start">
        <p id={`todo-content-${todo.id}`} className="text-sm text-gray-700 break-words">{todo.content}</p>
        {onDelete && (
          <button 
            onClick={(e) => { 
              e.stopPropagation(); // Prevent dnd listeners from firing
              onDelete(todo.id); 
            }}
            className="text-gray-400 hover:text-red-500 transition-colors ml-2 p-1 rounded hover:bg-red-100"
            aria-label="Delete todo"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2">ID: {todo.id.substring(0,8)}</p>
    </div>
  );
} 