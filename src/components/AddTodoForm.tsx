'use client';

import React, { useState } from 'react';
import { TodoStatus } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
        <Input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter todo content..."
          className="flex-grow"
          disabled={isSubmitting}
        />
        
        <Select
          value={status}
          onValueChange={(value: TodoStatus) => setStatus(value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {columns.map(col => (
              <SelectItem key={col.id} value={col.id}>{col.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Todo'}
        </Button>
      </div>
    </form>
  );
} 