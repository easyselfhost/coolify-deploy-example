'use client';

import React, { useState } from 'react';
import { TodoStatus } from '@/types';

interface AddTodoFormProps {
  onAddTodo: (content: string, status: TodoStatus) => Promise<void>;
  columns: { id: TodoStatus; title: string }[];
}

export default function AddTodoForm({ onAddTodo, columns }: AddTodoFormProps) {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<TodoStatus>(columns[0]?.id || 'backlog');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await onAddTodo(content, status);
      setContent('');
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-medium mb-3 text-gray-800">Add New Todo</h3>
      
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter todo content..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isSubmitting}
        />
        
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TodoStatus)}
          className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isSubmitting}
        >
          {columns.map(col => (
            <option key={col.id} value={col.id}>{col.title}</option>
          ))}
        </select>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
    </form>
  );
} 