import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('Todo', {
  id: text('id').primaryKey().notNull(),
  content: text('content').notNull(),
  status: text('status').notNull(), // "backlog", "in-progress", "done"
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().defaultNow(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$onUpdate(() => new Date()),
});

// Types
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert; 