export type TodoStatus = 'backlog' | 'in-progress' | 'done';

export interface Todo {
  id: string;
  content: string;
  status: TodoStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export const KanbanColumnMap: Readonly<Record<TodoStatus, string>> = {
  backlog: 'Backlog',
  'in-progress': 'In Progress',
  done: 'Done',
} as const;

// An array of status values, useful for iterating or ordering
export const KanbanColumnOrder: Readonly<TodoStatus[]> = ['backlog', 'in-progress', 'done'] as const;

export interface ColumnDragItem {
  id: TodoStatus;
  title: string;
  todos: Todo[];
}

export interface Column {
  id: TodoStatus;
  title: string;
  todos: Todo[];
} 