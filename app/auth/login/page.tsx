// src/app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(formData.email, formData.password);
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      // Store the token
      localStorage.setItem('token', response.jwt);
      
      // Set user location for ABAC checks
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const location = `${position.coords.latitude},${position.coords.longitude}`;
          localStorage.setItem('userLocation', location);
        });
      }

      // Redirect to home page
      router.push('/');
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login to Blog</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border border-gray-300 
                       shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 
                       focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border border-gray-300 
                       shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 
                       focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent 
                     rounded-md shadow-sm text-sm font-medium text-white 
                     ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
                     focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Demo Accounts:</p>
          <ul className="mt-2 space-y-1">
            <li>Author: author@example.com / testpass123</li>
            <li>Editor: editor@example.com / testpass123</li>
            <li>Subscriber: subscriber@example.com / testpass123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}