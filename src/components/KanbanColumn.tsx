'use client';

import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo, TodoStatus } from '@/types';
import TodoCard from '@/components/TodoCard';

interface KanbanColumnProps {
  id: TodoStatus;
  title: string;
  todos: Todo[];
  onDeleteTodo: (todoId: string) => void;
}

export default function KanbanColumn({ id, title, todos, onDeleteTodo }: KanbanColumnProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isOver } = useSortable({
    id: id,
    data: { type: 'column', accepts: ['task'] }, // Define type and what it accepts
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      {...listeners}
      className={`bg-gray-50 p-4 rounded-lg shadow min-h-[200px] flex flex-col ${isOver ? 'outline outline-2 outline-indigo-500' : ''}`}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700 sticky top-0 bg-gray-50 py-2 z-10">{title}</h2>
      <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-grow space-y-3 overflow-y-auto">
          {todos.length > 0 ? (
            todos.map(todo => (
              <TodoCard key={todo.id} todo={todo} columnId={id} onDelete={onDeleteTodo} />
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center pt-4">No tasks yet.</p>
          )}
        </div>
      </SortableContext>
    </div>
  );
} 