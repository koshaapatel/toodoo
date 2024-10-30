'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AddTodoForm from '@/components/AddTodoForm';
import TodoList from '@/components/TodoList';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import ShareModal from '@/components/ShareModal';
import { Share2, RefreshCw } from 'lucide-react'; // Import Refresh icon
import { getTodoListById, updateTodoList } from '@/utils/api';

export default function EditTodoList() {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [listNotFound, setListNotFound] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [allowEditing, setAllowEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const preventSave = useRef(false); // Flag to prevent save during data fetch

  const router = useRouter();
  const params = useParams();
  const { listId } = params;

  useEffect(() => {
    // Store the current listId in localStorage for convenience
    localStorage.setItem('currentTodoListId', listId);

    // Fetch the TODO list from the backend
    const fetchTodoList = async () => {
      preventSave.current = true; // Prevent save during fetch
      setIsLoading(true);
      try {
        const data = await getTodoListById(listId);
        setTodos(data.todos);
        setAllowEditing(data.allowEditing);
      } catch (error) {
        console.error('Error fetching TODO list:', error);
        setListNotFound(true);
      } finally {
        setIsLoading(false);
        preventSave.current = false; // Allow save after fetch
      }
    };

    if (listId) {
      fetchTodoList();
    }
  }, [listId]);

  useEffect(() => {
    if (listNotFound || preventSave.current) {
      // Skip saving if list not found or during data fetch
      return;
    }

    // Save to backend whenever todos or allowEditing change
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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRefresh = async () => {
    // Fetch the latest data from the backend
    preventSave.current = true; // Prevent save during refresh
    setIsLoading(true);
    try {
      const data = await getTodoListById(listId);
      setTodos(data.todos);
      setAllowEditing(data.allowEditing);
    } catch (error) {
      console.error('Error refreshing TODO list:', error);
      setListNotFound(true);
    } finally {
      setIsLoading(false);
      preventSave.current = false; // Allow save after refresh
    }
  };

  if (listNotFound) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">TODO List Not Found</h1>
        <Button onClick={() => router.push('/existing')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Edit TODO List</h1>
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleRefresh} className="mr-2">
            <RefreshCw className="h-5 w-5" />
          </Button>
          {todos.length > 0 && (
            <Button variant="ghost" onClick={() => setShowShareModal(true)}>
              <Share2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      {/* Optionally show saving/loading status */}
      {isSaving && <p className="text-sm text-gray-500">Saving...</p>}
      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />
      {/* Add TODO Form */}
      <AddTodoForm
        onAdd={(title) => {
          const newTodo = {
            id: Date.now(),
            title,
            completed: false,
            subTasks: [],
          };
          setTodos([...todos, newTodo]);
        }}
      />
      {/* TODO List */}
      <TodoList
        todos={todos}
        setTodos={setTodos}
        searchQuery={searchQuery}
        readOnly={!allowEditing}
      />
      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          todos={todos}
          onClose={() => setShowShareModal(false)}
          listId={listId}
          allowEditing={allowEditing}
        />
      )}
    </div>
  );
}
