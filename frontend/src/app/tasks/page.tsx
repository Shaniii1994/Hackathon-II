'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { isAuthenticated, logout } from '@/lib/auth';
import apiClient, { Task } from '@/lib/api-client';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

export default function TasksPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    setIsReady(true);
  }, [router]);

  const {
    data: tasks,
    isLoading,
    error,
    refetch,
  } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await apiClient.get('/api/tasks');
      return response.data;
    },
    enabled: isReady,
  });

  const handleLogout = () => {
    logout();
  };

  if (!isReady) {
    return null;
  }

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              My Tasks
            </h1>
            <p className="mt-1 text-gray-600">
              Manage your tasks and stay organized
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Task Form */}
        <div className="mb-8">
          <TaskForm onSuccess={refetch} />
        </div>

        {/* Task List */}
        <div>
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              Error loading tasks. Please try again.
            </div>
          )}

          {!isLoading && !error && tasks && (
            <TaskList tasks={tasks} onUpdate={refetch} />
          )}
        </div>
      </div>
    </main>
  );
}
