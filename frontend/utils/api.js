import axios from 'axios';

// const API_BASE_URL = '/api';

let API_BASE_URL = '';

if (typeof window !== 'undefined') {
  // Client-side: Use window.location.origin
  API_BASE_URL = `${window.location.origin}/api`;
} else {
  // Server-side: Provide a default or use process.env
  API_BASE_URL = 'http://localhost:3000/api';
}

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable is not set');
}

export const createTodoList = async (todos, allowEditing, password = null) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/todo`, {
      todos,
      allowEditing,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating TODO list', error);
    throw error;
  }
};

export const getTodoListById = async (id) => {
  console.log(`Attempting to fetch TODO list with ID: ${id}`);
  try {
    const response = await axios.get(`${API_BASE_URL}/todo/${id}`);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error retrieving TODO list', error);
    throw error;
  }
};

export const updateTodoList = async (id, todos, allowEditing, password = null) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/todo/${id}`, {
      todos,
      allowEditing,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Error updating TODO list', error);
    throw error;
  }
};
