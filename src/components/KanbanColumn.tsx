'use client';

import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo, TodoStatus } from '@/types';
import TodoCard from '@/components/TodoCard';
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
    <Card 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      {...listeners}
      className={`flex flex-col min-h-[200px] border border-border ${isOver ? 'outline outline-2 outline-primary' : ''}`}
    >
      <CardHeader className="sticky top-0 z-10 pb-2 border-b">
        <h2 className="text-xl font-semibold">{title}</h2>
      </CardHeader>
      <CardContent className="pt-0">
        <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
          <div className="flex-grow space-y-3 overflow-y-auto">
            {todos.length > 0 ? (
              todos.map(todo => (
                <TodoCard key={todo.id} todo={todo} columnId={id} onDelete={onDeleteTodo} />
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center pt-4">No tasks yet.</p>
            )}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  );
} 