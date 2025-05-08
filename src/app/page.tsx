'use client';

import KanbanBoard from "@/components/KanbanBoard";
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

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

  return (
    <main className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-gray-100">
      <header className="mb-8 w-full flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">My Kanban Board</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </header>
      <KanbanBoard />
    </main>
  );
}
