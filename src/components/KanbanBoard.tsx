'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, DragEndEvent, DragOverlay, useSensor, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumnOrder, KanbanColumnMap, Todo, TodoStatus, ColumnDragItem } from '@/types';
import KanbanColumn from '@/components/KanbanColumn';
import TodoCard from '@/components/TodoCard'; // For DragOverlay
import AddTodoForm from '@/components/AddTodoForm';

interface BoardData {
  [key: string]: ColumnDragItem;
}

interface KanbanBoardProps {
  onTodosUpdated?: (todos: {
    backlog: Todo[];
    'in-progress': Todo[];
    done: Todo[];
  }) => void;
  initialTodos?: {
    backlog: Todo[];
    'in-progress': Todo[];
    done: Todo[];
  };
}

const initialBoardData: BoardData = KanbanColumnOrder.reduce((acc, status) => {
  acc[status] = { id: status, title: KanbanColumnMap[status], todos: [] };
  return acc;
}, {} as BoardData);

export default function KanbanBoard({ onTodosUpdated, initialTodos }: KanbanBoardProps) {
  const [columns, setColumns] = useState<BoardData>(initialBoardData);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<TodoStatus | null>(null);
  const isUpdatingFromParent = useRef(false);

  const sensors = [
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  ];

  useEffect(() => {
    fetchTodos();
  }, []);

  // Handle initialTodos changes coming from parent
  useEffect(() => {
    if (initialTodos) {
      isUpdatingFromParent.current = true;
      
      const newColumns = { ...initialBoardData };
      KanbanColumnOrder.forEach(status => {
        newColumns[status] = { 
          ...newColumns[status], 
          todos: initialTodos[status] || [] 
        };
      });
      
      setColumns(newColumns);
    }
  }, [initialTodos]);

  // Update the parent component when columns change
  useEffect(() => {
    // Only update parent if change wasn't initiated by parent
    if (onTodosUpdated && !isUpdatingFromParent.current) {
      onTodosUpdated({
        backlog: columns.backlog.todos,
        'in-progress': columns['in-progress'].todos,
        done: columns.done.todos
      });
    }
    // Reset the flag after the effect
    isUpdatingFromParent.current = false;
  }, [columns, onTodosUpdated]);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const fetchedTodos: Todo[] = await response.json();
      
      const newColumns = { ...initialBoardData }; // Reset columns with fresh empty arrays
      KanbanColumnOrder.forEach(status => {
        newColumns[status] = { ...newColumns[status], todos: [] };
      });

      fetchedTodos.forEach(todo => {
        if (newColumns[todo.status as TodoStatus]) {
          newColumns[todo.status as TodoStatus].todos.push(todo);
        }
      });
      setColumns(newColumns);
    } catch (error) {
      console.error("Error fetching todos:", error);
      // Handle error (e.g., show a notification to the user)
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
      
      setColumns(prev => ({
        ...prev,
        [newTodo.status as TodoStatus]: {
          ...prev[newTodo.status as TodoStatus],
          todos: [...prev[newTodo.status as TodoStatus].todos, newTodo],
        },
      }));
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleDragStart = (event: DragEndEvent) => {
    const { active } = event;
    const activeTodoItem = KanbanColumnOrder.flatMap(colId => columns[colId].todos).find(t => t.id === active.id);
    if (activeTodoItem) {
      setActiveTodo(activeTodoItem);
      setActiveColumnId(active.data.current?.sortable.containerId as TodoStatus || activeTodoItem.status);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    console.log('DragEnd event triggered');
    const { active, over } = event;
    setActiveTodo(null);
    setActiveColumnId(null);

    if (!over) return;

    console.log(active);
    console.log(over);

    const activeId = active.id as string;
    const overId = over.id as string;
    const overContainerId = over.id;

    const activeContainer = active.data.current?.parentColumn;
    
    if (!activeContainer || !overContainerId) return;

    console.log(`Move ${activeId} from ${activeContainer} to ${overContainerId}`);

    const column = columns[activeContainer];
    if (!column) return;
    const activeTodoItem = column.todos.find(t => t.id === activeId);
    if (!activeTodoItem) return;

    if (!columns[overContainerId]) return;

    if (activeContainer === overContainerId) {
      // Moving within the same column
      if (activeId !== overId) {
        setColumns(prev => ({
          ...prev,
          [activeContainer]: {
            ...prev[activeContainer],
            todos: arrayMove(prev[activeContainer].todos, prev[activeContainer].todos.findIndex(t => t.id === activeId), prev[activeContainer].todos.findIndex(t => t.id === overId)),
          },
        }));
      }
    } else {
      // Moving to a different column
      const newStatus = overContainerId;
      try {
        const response = await fetch(`/api/todos/${activeId}` , {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...activeTodoItem, status: newStatus }),
        });
        if (!response.ok) throw new Error('Failed to update todo status');
        const updatedTodo: Todo = await response.json();

        setColumns(prev => {
          const newColumnsState = { ...prev };
          // Remove from old column
          newColumnsState[activeContainer] = {
            ...newColumnsState[activeContainer],
            todos: newColumnsState[activeContainer].todos.filter(t => t.id !== activeId),
          };
          // Add to new column
          const overColumnTodos = newColumnsState[overContainerId].todos;
          const overIndex = overColumnTodos.findIndex(t => t.id === overId);
          const insertIndex = overIndex >= 0 ? overIndex : overColumnTodos.length;

          newColumnsState[overContainerId] = {
            ...newColumnsState[overContainerId],
            todos: [
              ...overColumnTodos.slice(0, insertIndex),
              updatedTodo, // use the updated todo from API
              ...overColumnTodos.slice(insertIndex),
            ],
          };
          return newColumnsState;
        });

      } catch (error) {
        console.error("Error updating todo status:", error);
        // Revert optimistic update or show error
      }
    }
  };
  
  const handleDeleteTodo = async (todoId: string, columnId: TodoStatus) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete todo');
      
      setColumns(prev => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          todos: prev[columnId].todos.filter(t => t.id !== todoId),
        },
      }));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="w-full max-w-6xl mx-auto">
        <AddTodoForm onAddTodo={handleAddTodo} columns={KanbanColumnOrder.map(id => ({id, title: KanbanColumnMap[id]}))} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-6xl mx-auto">
        <SortableContext items={KanbanColumnOrder.slice()} strategy={rectSortingStrategy}>
          {KanbanColumnOrder.map(columnId => (
            <KanbanColumn 
              key={columnId} 
              id={columnId} 
              title={columns[columnId].title} 
              todos={columns[columnId].todos}
              onDeleteTodo={(todoId: string) => handleDeleteTodo(todoId, columnId)}
            />
          ))}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeTodo && activeColumnId ? (
           <div className="rounded-md bg-white p-3 shadow-lg border border-gray-200">
            <TodoCard todo={activeTodo} columnId={activeColumnId} isDragging />
           </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
} 