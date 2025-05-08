import { prisma } from "@/lib/db";
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

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        content,
        status,
        updatedAt: new Date(), // Explicitly set updatedAt
      },
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error(`Error updating todo ${(await params).id}:`, error);
    // Check for Prisma's specific error code for record not found (P2025)
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: unknown }).code === 'P2025') {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
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

    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 }); // Or 204 No Content
  } catch (error) {
    console.error(`Error deleting todo ${(await params).id}:`, error);
    // Check for Prisma's specific error code for record not found (P2025)
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: unknown }).code === 'P2025') {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
} 