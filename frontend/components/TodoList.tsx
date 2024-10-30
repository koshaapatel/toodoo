'use client';

import TodoItem from '@/components/TodoItem';
import { motion, AnimatePresence } from 'framer-motion';
export default function TodoList({ todos, setTodos, searchQuery, readOnly=false }) {
  // Recursive function to filter todos based on search query
  const filterTodos = (tasks) => {
    return tasks
      .filter((task) => {
        const matches = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        if (matches) return true;
        // Check subTasks
        if (task.subTasks) {
          task.subTasks = filterTodos(task.subTasks);
          return task.subTasks.length > 0;
        }
        return false;
      })
      .map((task) => ({
        ...task,
        subTasks: task.subTasks ? filterTodos(task.subTasks) : [],
      }));
  };
  if (filterTodos.length === 0) {
    return <p className="text-gray-500">No items have been added.</p>;
  }
  const displayedTodos = searchQuery ? filterTodos(todos) : todos;

  return (
    <div>
      <AnimatePresence>
        {displayedTodos.map((todo) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <TodoItem
              todo={todo}
              todos={todos}
              setTodos={setTodos}
              readOnly={readOnly}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
