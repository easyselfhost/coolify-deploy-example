'use client';

import { useState, useRef, useEffect } from 'react';
import KanbanBoard from "@/components/KanbanBoard";
import TodoList from "@/components/TodoList";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Todo, TodoStatus } from '@/types';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';

type ViewMode = 'kanban' | 'todo';
const VIEW_MODE_KEY = 'kanban-app-view-mode';

export default function HomePage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [todos, setTodos] = useState<{
    backlog: Todo[];
    'in-progress': Todo[];
    done: Todo[];
  }>({
    backlog: [],
    'in-progress': [],
    done: []
  });
  
  // Add a ref to track whether the update is initiated by the HomePage
  const isUpdatingTodos = useRef(false);
  const isInitialized = useRef(false);

  // Load saved view mode from localStorage
  useEffect(() => {
    // Only run on the client side
    if (typeof window !== 'undefined') {
      const savedViewMode = localStorage.getItem(VIEW_MODE_KEY) as ViewMode;
      // Only update if a valid value exists
      if (savedViewMode && (savedViewMode === 'kanban' || savedViewMode === 'todo')) {
        setViewMode(savedViewMode);
      }
      isInitialized.current = true;
    }
  }, []);
  
  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    // Skip the initial render to prevent overwriting with default value
    if (isInitialized.current && typeof window !== 'undefined') {
      localStorage.setItem(VIEW_MODE_KEY, viewMode);
    }
  }, [viewMode]);

  // Toggle view mode handler
  const handleViewModeChange = (checked: boolean) => {
    const newMode: ViewMode = checked ? 'todo' : 'kanban';
    setViewMode(newMode);
  };

  async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  const handleToggleTodoStatus = async (todo: Todo) => {
    try {
      const newStatus: TodoStatus = todo.status === 'done' 
        ? (todo.content.toLowerCase().includes('progress') ? 'in-progress' : 'backlog') 
        : 'done';
      
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update todo status');
      const updatedTodo: Todo = await response.json();
      
      // Update local state
      setTodos(prev => {
        const newTodos = { ...prev };
        // Remove from old status
        newTodos[todo.status] = newTodos[todo.status].filter(t => t.id !== todo.id);
        // Add to new status
        newTodos[newStatus] = [...newTodos[newStatus], updatedTodo];
        return newTodos;
      });
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };
  
  const handleDeleteTodo = async (todoId: string, status: TodoStatus) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete todo');
      
      setTodos(prev => ({
        ...prev,
        [status]: prev[status].filter(t => t.id !== todoId),
      }));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleAddTodo = async (content: string, status: TodoStatus) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, status }),
      });
      if (!response.ok) throw new Error('Failed to add todo');
      const newTodo: Todo = await response.json();
      
      // Update local state
      isUpdatingTodos.current = true;
      setTodos(prev => ({
        ...prev,
        [newTodo.status]: [
          ...prev[newTodo.status],
          newTodo
        ]
      }));
      setTimeout(() => {
        isUpdatingTodos.current = false;
      }, 0);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Sync todos with the Kanban board component
  const handleTodosUpdated = (updatedTodos: {
    backlog: Todo[];
    'in-progress': Todo[];
    done: Todo[];
  }) => {
    // Only update if not already updating (prevents circular updates)
    if (!isUpdatingTodos.current) {
      isUpdatingTodos.current = true;
      setTodos(updatedTodos);
      // Reset flag after state update
      setTimeout(() => {
        isUpdatingTodos.current = false;
      }, 0);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-background text-foreground">
      <header className="w-full flex justify-between items-center p-4 bg-card border-b sticky top-0 z-10">
        <h1 className="text-4xl font-bold">My Kanban Board</h1>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Label htmlFor="view-mode" className="text-sm font-medium">
              {viewMode === 'kanban' ? 'Kanban View' : 'Todo List View'}
            </Label>
            <Switch
              id="view-mode"
              checked={viewMode === 'todo'}
              onCheckedChange={handleViewModeChange}
            />
          </div>
          <ThemeToggle />
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="focus:ring-2 focus:ring-destructive focus:ring-offset-2"
          >
            Logout
          </Button>
        </div>
      </header>
      
      {viewMode === 'kanban' ? (
        <div className="w-full px-4 md:px-8 mt-8">
          <KanbanBoard 
            onTodosUpdated={handleTodosUpdated} 
            initialTodos={todos}
          />
        </div>
      ) : (
        <div className="w-full px-4 md:px-8 mt-8">
          <TodoList 
            todos={todos} 
            onToggleTodoStatus={handleToggleTodoStatus} 
            onDeleteTodo={handleDeleteTodo}
            onAddTodo={handleAddTodo}
          />
        </div>
      )}
    </main>
  );
}
