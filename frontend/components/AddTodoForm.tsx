'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddTodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title.');
      return;
    }
    onAdd(title.trim());
    setTitle('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col mb-4">
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) {
              setError('');
            }
          }}
          className="mr-2"
        />
        <Button type="submit">Add Task</Button>
      </div>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </form>
  );
}
