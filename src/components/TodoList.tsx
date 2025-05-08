'use client';

import React, { useState } from 'react';
import { Todo, TodoStatus } from '@/types';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TodoListProps {
  todos: {
    backlog: Todo[];
    'in-progress': Todo[];
    done: Todo[];
  };
  onToggleTodoStatus: (todo: Todo) => void;
  onDeleteTodo: (todoId: string, status: TodoStatus) => void;
  onAddTodo?: (content: string, status: TodoStatus) => void;
}

export default function TodoList({ todos, onToggleTodoStatus, onDeleteTodo, onAddTodo }: TodoListProps) {
  const [newTodoContent, setNewTodoContent] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<TodoStatus>('backlog');

  // Combine backlog and in-progress for uncompleted tasks
  const uncompletedTodos = [...todos.backlog, ...todos['in-progress']];
  const completedTodos = todos.done;

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoContent.trim() && onAddTodo) {
      onAddTodo(newTodoContent.trim(), selectedStatus);
      setNewTodoContent('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card className="border border-border">
        <CardHeader className="border-b pb-2">
          <h2 className="text-xl font-semibold">Add New Task</h2>
        </CardHeader>
        <CardContent className="p-4">
          <form onSubmit={handleAddTodo} className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter a new task..."
                value={newTodoContent}
                onChange={(e) => setNewTodoContent(e.target.value)}
                className="flex-grow"
              />
              <div className="flex-shrink-0">
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as TodoStatus)}
                  className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                  <option value="backlog">Backlog</option>
                  <option value="in-progress">In Progress</option>
                </select>
              </div>
              <Button 
                type="submit" 
                className="flex-shrink-0"
                disabled={!newTodoContent.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="border-b pb-2">
          <h2 className="text-xl font-semibold">Active Tasks</h2>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          {uncompletedTodos.length === 0 ? (
            <p className="text-muted-foreground italic">No active tasks</p>
          ) : (
            uncompletedTodos.map((todo) => (
              <div key={todo.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md group border border-border">
                <Checkbox 
                  id={`todo-${todo.id}`}
                  checked={false}
                  onCheckedChange={() => onToggleTodoStatus(todo)}
                  className="h-5 w-5 ml-2"
                />
                <label 
                  htmlFor={`todo-${todo.id}`} 
                  className="flex-grow text-sm cursor-pointer"
                >
                  {todo.content}
                </label>
                <span className="text-xs text-muted-foreground">
                  {todo.status === 'backlog' ? 'Backlog' : 'In Progress'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteTodo(todo.id, todo.status)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete todo"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="border-b pb-2">
          <h2 className="text-xl font-semibold">Completed Tasks</h2>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          {completedTodos.length === 0 ? (
            <p className="text-muted-foreground italic">No completed tasks</p>
          ) : (
            completedTodos.map((todo) => (
              <div key={todo.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md group border border-border">
                <Checkbox 
                  id={`todo-${todo.id}`}
                  checked={true}
                  onCheckedChange={() => onToggleTodoStatus(todo)}
                  className="h-5 w-5 ml-2"
                />
                <label 
                  htmlFor={`todo-${todo.id}`} 
                  className="flex-grow text-sm line-through text-muted-foreground cursor-pointer"
                >
                  {todo.content}
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteTodo(todo.id, todo.status)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete todo"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
} 