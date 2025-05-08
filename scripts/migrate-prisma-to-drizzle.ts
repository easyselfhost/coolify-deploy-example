import { PrismaClient } from '@prisma/client';
import { db } from '../src/db';
import { todos } from '../src/db/schema';

async function migratePrismaTodrizzle() {
  console.log('Starting migration from Prisma to Drizzle...');

  // Initialize Prisma client
  const prisma = new PrismaClient();

  try {
    // Fetch all todos from Prisma
    console.log('Fetching todos from Prisma...');
    const prismaTodos = await prisma.todo.findMany();
    console.log(`Found ${prismaTodos.length} todos.`);

    if (prismaTodos.length === 0) {
      console.log('No todos to migrate.');
      return;
    }

    // Insert todos into Drizzle
    console.log('Inserting todos into Drizzle...');
    
    for (const todo of prismaTodos) {
      await db.insert(todos).values({
        id: todo.id,
        content: todo.content,
        status: todo.status,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      });
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migratePrismaTodrizzle()
  .then(() => {
    console.log('Migration script finished.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unhandled error in migration script:', error);
    process.exit(1);
  }); 