'use client';

import { useState } from 'react';
import { z } from 'zod';
import apiClient, { Task } from '@/lib/api-client';

interface TaskListProps {
  tasks: Task[];
  onUpdate: () => void;
}

// Validation schema for editing
const editTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  due_date: z.string().min(1, 'Due date is required'),
});

type EditTaskFormData = z.infer<typeof editTaskSchema>;

export default function TaskList({ tasks, onUpdate }: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    due_date: '',
  });
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof EditTaskFormData, string>>>({});
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleToggleComplete = async (taskId: string) => {
    setLoadingTaskId(taskId);
    setError('');

    try {
      await apiClient.patch(`/api/tasks/${taskId}/complete`);
      onUpdate();
    } catch (error: any) {
      setError('Failed to update task status');
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditFormData({
      title: task.title,
      description: task.description,
      due_date: task.due_date,
    });
    setEditErrors({});
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditFormData({ title: '', description: '', due_date: '' });
    setEditErrors({});
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
  };

  const handleSaveEdit = async (taskId: string) => {
    setEditErrors({});
    setError('');

    // Validate form
    const result = editTaskSchema.safeParse(editFormData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof EditTaskFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const path = error.path[0] as keyof EditTaskFormData;
        fieldErrors[path] = error.message;
      });
      setEditErrors(fieldErrors);
      return;
    }

    setLoadingTaskId(taskId);

    try {
      await apiClient.put(`/api/tasks/${taskId}`, {
        title: editFormData.title,
        description: editFormData.description,
        due_date: editFormData.due_date,
      });
      setEditingTaskId(null);
      onUpdate();
    } catch (error: any) {
      setError('Failed to update task');
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoadingTaskId(taskId);
    setError('');

    try {
      await apiClient.delete(`/api/tasks/${taskId}`);
      onUpdate();
    } catch (error: any) {
      setError('Failed to delete task');
    } finally {
      setLoadingTaskId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dateString: string, completed: boolean) => {
    if (completed) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-600">
          Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
        Your Tasks ({tasks.length})
      </h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
              task.completed
                ? 'border-green-500'
                : isOverdue(task.due_date, task.completed)
                ? 'border-red-500'
                : 'border-blue-500'
            }`}
          >
            {editingTaskId === task.id ? (
              // Edit Mode
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      editErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Title"
                  />
                  {editErrors.title && (
                    <p className="mt-1 text-xs text-red-600">{editErrors.title}</p>
                  )}
                </div>

                <div>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows={2}
                    className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
                      editErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Description"
                  />
                  {editErrors.description && (
                    <p className="mt-1 text-xs text-red-600">{editErrors.description}</p>
                  )}
                </div>

                <div>
                  <input
                    type="date"
                    name="due_date"
                    value={editFormData.due_date}
                    onChange={handleEditChange}
                    className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      editErrors.due_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {editErrors.due_date && (
                    <p className="mt-1 text-xs text-red-600">{editErrors.due_date}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(task.id)}
                    disabled={loadingTaskId === task.id}
                    className="flex-1 px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loadingTaskId === task.id ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={loadingTaskId === task.id}
                    className="flex-1 px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className={`text-lg font-semibold ${
                      task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    disabled={loadingTaskId === task.id}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-primary-500'
                    }`}
                    title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {task.completed && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </button>
                </div>

                <p
                  className={`text-sm mb-3 ${
                    task.completed ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {task.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span
                    className={`font-medium ${
                      isOverdue(task.due_date, task.completed)
                        ? 'text-red-600'
                        : task.completed
                        ? 'text-gray-400'
                        : 'text-gray-700'
                    }`}
                  >
                    Due: {formatDate(task.due_date)}
                  </span>
                  {task.completed && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  )}
                  {isOverdue(task.due_date, task.completed) && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      Overdue
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartEdit(task)}
                    disabled={loadingTaskId === task.id}
                    className="flex-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:opacity-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    disabled={loadingTaskId === task.id}
                    className="flex-1 px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50 transition-colors"
                  >
                    {loadingTaskId === task.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
