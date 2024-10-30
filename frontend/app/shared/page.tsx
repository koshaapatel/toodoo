'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SharedPage() {
  const [listIdInput, setListIdInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleListIdSubmit = () => {
    // Trim the input to remove any leading/trailing whitespace
    const trimmedInput = listIdInput.trim();

    // Check if input is empty
    if (!trimmedInput) {
      setErrorMessage('Please enter a TODO List ID.');
      return;
    }

    // Validate UUID format (version 4 UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(trimmedInput)) {
      setErrorMessage('Please enter a valid TODO List ID.');
      return;
    }

    // Clear any existing error messages
    setErrorMessage('');

    // Navigate to the shared TODO list page
    router.push(`/shared/${trimmedInput}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Enter TODO List ID</h1>
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
        {errorMessage && (
          <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
        )}
        <Button onClick={handleListIdSubmit} className="w-full mb-2">
          Go to List
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push('/new')}
          className="w-full"
        >
          Create New TODO List
        </Button>
      </div>
    </div>
  );
}
