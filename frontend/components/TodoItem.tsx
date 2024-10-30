'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Edit, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';

export default function TodoItem({ todo, todos, setTodos, readOnly = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSubTasks, setShowSubTasks] = useState(true);
  const [subTaskTitle, setSubTaskTitle] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showCompleteAlert, setShowCompleteAlert] = useState(false);
  const [showAddSubTaskForm, setShowAddSubTaskForm] = useState(false);
  const [subTaskError, setSubTaskError] = useState('');

  const inputRef = useRef(null);
  // Check if all subtasks are completed
  const areSubTasksCompleted = (tasks) => {
    return tasks.every((task) => {
      if (task.subTasks && task.subTasks.length > 0) {
        return task.completed && areSubTasksCompleted(task.subTasks);
      }
      return task.completed;
    });
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  // Update a specific todo
  const updateTodo = (id, updatedFields) => {
    const updateTasks = (tasks) =>
      tasks.map((task) =>
        task.id === id
          ? { ...task, ...updatedFields }
          : {
            ...task,
            subTasks: task.subTasks ? updateTasks(task.subTasks) : [],
          }
      );
    setTodos(updateTasks(todos));
  };

  // Delete a specific todo
  const deleteTodo = (id) => {
    const removeTasks = (tasks) =>
      tasks
        .filter((task) => task.id !== id)
        .map((task) => ({
          ...task,
          subTasks: task.subTasks ? removeTasks(task.subTasks) : [],
        }));
    setTodos(removeTasks(todos));
  };

  // Add a sub-task
  const addSubTask = (parentId, title) => {
    const addTask = (tasks) =>
      tasks.map((task) => {
        if (task.id === parentId) {
          const newSubTask = {
            id: Date.now(),
            title,
            completed: false,
            subTasks: [],
          };
          return {
            ...task,
            subTasks: [...(task.subTasks || []), newSubTask],
          };
        } else {
          return {
            ...task,
            subTasks: task.subTasks ? addTask(task.subTasks) : [],
          };
        }
      });
    setTodos(addTask(todos));
    setSubTaskTitle('');
  };

  // Handle completion change
  const handleCompletionChange = (checked) => {
    if (checked && todo.subTasks && todo.subTasks.length > 0) {
      if (!areSubTasksCompleted(todo.subTasks)) {
        setShowCompleteAlert(true);
        return;
      }
    }
    updateTodo(todo.id, { completed: checked });
  };

  // Handle delete click
  const handleDeleteClick = () => {
    if (todo.subTasks && todo.subTasks.length > 0 && !areSubTasksCompleted(todo.subTasks)) {
      setShowDeleteAlert(true);
    } else {
      deleteTodo(todo.id);
    }
  };

  return (

    <div className="pl-4 border-l border-gray-300">
      <div className="flex items-center mb-2">
        {/* Toggle Sub-Tasks Visibility */}
        {todo.subTasks && todo.subTasks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSubTasks(!showSubTasks)}
            className="mr-2"
            disabled={readOnly}
          >
            {showSubTasks ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Checkbox */}
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleCompletionChange}
          className="mr-2"
          disabled={readOnly}
        />

        {/* Task Title */}
        {isEditing ? (
          <Input
            value={todo.title}
            onChange={(e) => updateTodo(todo.id, { title: e.target.value })}
            onKeyDown={handleEditKeyDown}
            className="mr-2"
            ref={inputRef}
            disabled={readOnly}
          />
        ) : (
          <span
            className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''
              }`}
          >
            {todo.title}
          </span>
        )}

        {/* Edit Button */}
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsEditing(!isEditing);
              if (!isEditing) {
                // Focus the input when entering edit mode
                setTimeout(() => {
                  inputRef.current && inputRef.current.focus();
                }, 0);
              }
            }}
            className="mr-2"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}

        {/* Delete Button */}
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="mr-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}

        {/* Add Sub-Task Button */}
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowSubTasks(true);
              setShowAddSubTaskForm(!showAddSubTaskForm);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* AlertDialog for Delete */}
      {showDeleteAlert && (
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cannot Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                All subtasks must be completed before deleting this task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={() => setShowDeleteAlert(false)}>OK</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* AlertDialog for Completion */}
      {showCompleteAlert && (
        <AlertDialog open={showCompleteAlert} onOpenChange={setShowCompleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cannot Complete Task</AlertDialogTitle>
              <AlertDialogDescription>
                All subtasks must be completed before completing this task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={() => setShowCompleteAlert(false)}>OK</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Sub-Tasks */}
      <AnimatePresence>
        {showAddSubTaskForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!subTaskTitle.trim()) {
                setSubTaskError('Please enter a sub-task title.');
                return;
              }
              addSubTask(todo.id, subTaskTitle.trim());
              setSubTaskTitle('');
              setSubTaskError('');
              setShowAddSubTaskForm(false); // Hide the form after adding
            }}
            className="flex flex-col mb-2"
          >
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Add sub-task..."
                value={subTaskTitle}
                onChange={(e) => {
                  setSubTaskTitle(e.target.value);
                  if (e.target.value.trim()) {
                    setSubTaskError('');
                  }
                }}
                className="mr-2"
              />
              <Button type="submit" size="sm">
                Add
              </Button>
            </div>
            {subTaskError && (
              <span className="text-red-500 text-sm mt-1">{subTaskError}</span>
            )}
          </form>
        )}
        {showSubTasks && (
          <motion.div
            className="ml-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {/* Add Sub-Task Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!subTaskTitle.trim()) return;
                addSubTask(todo.id, subTaskTitle.trim());
              }}
              className="flex items-center mb-2"
            >
              <Input
                type="text"
                placeholder="Add sub-task..."
                value={subTaskTitle}
                onChange={(e) => setSubTaskTitle(e.target.value)}
                className="mr-2"
              />
              <Button type="submit" size="sm">
                Add
              </Button>
            </form>

            {/* Render Sub-Tasks */}
            {todo.subTasks &&
              todo.subTasks.map((subTask) => (
                <TodoItem
                  key={subTask.id}
                  todo={subTask}
                  todos={todos}
                  setTodos={setTodos}
                />
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
