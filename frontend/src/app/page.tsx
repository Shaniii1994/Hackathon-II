'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/tasks');
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Todo App
          </h1>
          <p className="text-lg text-gray-600">
            Manage your tasks efficiently and stay organized
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
          >
            Register
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-semibold text-gray-900 mb-1">Create Tasks</h3>
            <p className="text-sm text-gray-600">
              Add tasks with titles, descriptions, and due dates
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-900 mb-1">Track Progress</h3>
            <p className="text-sm text-gray-600">
              Mark tasks as complete and monitor your progress
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-1">Secure</h3>
            <p className="text-sm text-gray-600">
              Your tasks are protected with JWT authentication
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
