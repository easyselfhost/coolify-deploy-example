'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo, TodoStatus } from '@/types';
import { Trash2 } from 'lucide-react'; // Using lucide-react for icons
import { Button } from "@/components/ui/button"; // Added import
import { 
  Card, 
  // CardContent, // Removed unused import
  CardFooter, 
  CardHeader, // Though not used for a title, CardHeader can group top content
  // CardTitle, CardDescription not used here as the content is simple
} from "@/components/ui/card"; // Added Card imports

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
    <Card // Changed div to Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`hover:shadow-md transition-shadow ${isDragging ? 'ring-2 ring-indigo-500' : ''} ${isOver ? 'ring-2 ring-blue-400' : ''}`}
      //{/* Removed bg-white, p-3, rounded-md, shadow-sm, border, border-gray-200 as Card handles this */}
      aria-describedby={`todo-content-${todo.id}`}
    >
      <CardHeader className="flex flex-row justify-between items-start p-4"> {/* Added CardHeader and padding*/}
        <p id={`todo-content-${todo.id}`} className="text-sm text-gray-700 break-words mr-2">{todo.content}</p> {/* Added mr-2 for spacing*/}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { 
              e.stopPropagation();
              onDelete(todo.id); 
            }}
            aria-label="Delete todo"
            //{/* Removed custom hover/text color as ghost variant handles this well enough */}
            //{/* className="text-gray-400 hover:text-red-500 transition-colors ml-2 rounded hover:bg-red-100" */}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </CardHeader>
      <CardFooter className="text-xs text-gray-400 p-4 pt-0"> {/* Added CardFooter and padding, removed mt-2*/}
        ID: {todo.id.substring(0,8)}
      </CardFooter>
    </Card>
  );
} 