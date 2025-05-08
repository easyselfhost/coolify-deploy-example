'use client';

import KanbanBoard from "@/components/KanbanBoard";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-gray-100">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">My Kanban Board</h1>
      </header>
      <KanbanBoard />
    </main>
  );
}
