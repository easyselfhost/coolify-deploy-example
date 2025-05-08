import { db } from "@/db";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { content, status } = await request.json();
    const id = (await params).id;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updatedTodo = await db
      .update(todos)
      .set({
        content,
        status,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, id))
      .returning();

    if (!updatedTodo.length) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTodo[0]);
  } catch (error) {
    console.error(`Error updating todo ${(await params).id}:`, error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request, // request is not used but required by Next.js route handler signature
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedTodo = await db
      .delete(todos)
      .where(eq(todos.id, id))
      .returning();

    if (!deletedTodo.length) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting todo ${(await params).id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
} 