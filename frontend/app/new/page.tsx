'use client';

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createTodoList } from '@/utils/api';

export default function NewTodoList() {
  const router = useRouter();

  useEffect(() => {
    const createNewList = async () => {
      try {
        const data = await createTodoList([], true);
        const listId = data.id;
        // Store the list ID in localStorage for convenience
        localStorage.setItem('currentTodoListId', listId);
        // Redirect to the edit page
        router.replace(`/edit/${listId}`);
      } catch (error) {
        console.error('Error creating new TODO list:', error);
      }
    };

    createNewList();
  }, [router]);

  return null;
}
