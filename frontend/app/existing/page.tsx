'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

export default function ExistingTodoLists() {
  const [userTodoLists, setUserTodoLists] = useState([]);
  const [listIdInput, setListIdInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  useEffect(() => {
    // Load user's TODO list IDs from localStorage
    const savedListIds = localStorage.getItem('userTodoLists');
    if (savedListIds) {
      setUserTodoLists(JSON.parse(savedListIds));
    }
  }, []);

  const handleListClick = (listId) => {
    router.push(`/edit/${listId}`);
  };

  const handleListIdSubmit = () => {
    const trimmedInput = listIdInput.trim();
    if (!trimmedInput) {
      setErrorMessage('Please enter a TODO List ID.');
      return;
    }
    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(trimmedInput)) {
      setErrorMessage('Please enter a valid TODO List ID.');
      return;
    }
    setErrorMessage('');
    router.push(`/edit/${trimmedInput}`);
  };

  const handleCreateNewList = async () => {
    try {
      // Create a new TODO list on the backend
      const data = await createTodoList([], true);
      const { id: listId } = data;

      // Update the user's TODO list IDs
      const updatedListIds = [...userTodoLists, listId];
      localStorage.setItem('userTodoLists', JSON.stringify(updatedListIds));
      setUserTodoLists(updatedListIds);

      // Redirect to the edit page
      router.push(`/edit/${listId}`);
    } catch (error) {
      console.error('Error creating new TODO list:', error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your TODO Lists</h1>
      {userTodoLists.length > 0 ? (
        <ul className="mb-4">
          {userTodoLists.map((listId) => (
            <li key={listId}>
              <Button variant="link" onClick={() => handleListClick(listId)}>
                TODO List {listId}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no TODO lists.</p>
      )}
      <Button onClick={handleCreateNewList} className="mb-4">
        Create New TODO List
      </Button>
      <h2 className="text-xl font-bold mb-2">Access Shared TODO List</h2>
      <Input
        type="text"
        placeholder="Enter TODO List ID"
        value={listIdInput}
        onChange={(e) => {
          setListIdInput(e.target.value);
          setErrorMessage('');
        }}
        className="mb-2"
      />
      {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
      <Button onClick={handleListIdSubmit} className="mb-2">
        Go to List
      </Button>
    </div>
  );
}