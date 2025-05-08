import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { join } from 'path';
import * as schema from './schema';

// This prevents multiple instances during development hot reloading
declare global {
  // eslint-disable-next-line no-var
  var db: ReturnType<typeof createDb> | undefined;
}

function createDb() {
  const sqlite = new Database(join(process.cwd(), 'drizzle.db'));
  return drizzle(sqlite, { schema });
}

// For Next.js, use a cached connection in development
const db = global.db || createDb();

if (process.env.NODE_ENV !== 'production') {
  global.db = db;
}

export { db }; 