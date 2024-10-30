'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TodoList from '@/components/TodoList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getTodoListById, updateTodoList } from '@/utils/api';
import { RefreshCw } from 'lucide-react';

export default function SharedTodoList() {
  const [todos, setTodos] = useState([]);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [listNotFound, setListNotFound] = useState(false);
  const [allowEditing, setAllowEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const preventSave = useRef(false); // Flag to prevent save during data fetch

  const router = useRouter();
  const params = useParams();
  const { listId } = params;

  useEffect(() => {
    // Fetch the shared TODO list data from the backend
    const fetchSharedTodoList = async () => {
      preventSave.current = true; // Prevent save during fetch
      setLoading(true);
      try {
        const data = await getTodoListById(listId);
        setAllowEditing(data.allowEditing);
        if (data.password) {
          setPasswordRequired(true);
        } else {
          setTodos(data.todos);
          setPasswordValid(true);
        }
      } catch (error) {
        console.error('Error fetching TODO list:', error);
        setListNotFound(true);
      } finally {
        setLoading(false);
        preventSave.current = false; // Allow save after fetch
      }
    };

    fetchSharedTodoList();
  }, [listId]);

  useEffect(() => {
    if (listNotFound || preventSave.current || !allowEditing) {
      // Skip saving if list not found, during data fetch, or editing not allowed
      return;
    }

    // Save to backend whenever todos change
    const saveTodoList = async () => {
      setIsSaving(true);
      try {
        await updateTodoList(listId, todos, allowEditing);
      } catch (error) {
        console.error('Error saving TODO list:', error);
      } finally {
        setIsSaving(false);
      }
    };

    saveTodoList();
  }, [listId, todos, allowEditing, listNotFound]);

  const handlePasswordSubmit = async () => {
    preventSave.current = true; // Prevent save during password verification
    setLoading(true);
    try {
      const data = await getTodoListById(listId);
      if (data.password === passwordInput) {
        setTodos(data.todos);
        setPasswordValid(true);
      } else {
        alert('Incorrect password.');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setListNotFound(true);
    } finally {
      setLoading(false);
      preventSave.current = false; // Allow save after verification
    }
  };

  const handleRefresh = async () => {
    // Fetch the latest data from the backend
    preventSave.current = true; // Prevent save during refresh
    setLoading(true);
    try {
      const data = await getTodoListById(listId);
      setTodos(data.todos);
      setAllowEditing(data.allowEditing);
    } catch (error) {
      console.error('Error refreshing TODO list:', error);
      setListNotFound(true);
    } finally {
      setLoading(false);
      preventSave.current = false; // Allow save after refresh
    }
  };

  if (listNotFound) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">TODO List Not Found</h1>
        <Button onClick={() => router.push('/')}>Go Home</Button>
      </div>
    );
  }

  if (passwordRequired && !passwordValid) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Enter Password</h1>
        <Input
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handlePasswordSubmit}>Submit</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Shared TODO List</h1>
        <Button variant="ghost" onClick={handleRefresh}>
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
      {/* Optionally show saving status */}
      {isSaving && <p className="text-sm text-gray-500">Saving...</p>}
      {/* Display the TODO list */}
      <TodoList
        todos={todos}
        setTodos={allowEditing ? setTodos : () => {}}
        searchQuery="" // If you have a search bar, adjust accordingly
        readOnly={!allowEditing}
      />
    </div>
  );
}
