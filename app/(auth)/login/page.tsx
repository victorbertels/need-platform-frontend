'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await login(username, password.slice(0, 72));
      toast.success('Login successful!');
      router.push('/browse');
    } catch (err) {
      toast.error(error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to your Need account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <FiAlertCircle className="flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
                Email or Username
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="you@example.com"
                  className="input-base pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="btn-secondary py-2 text-sm">Google</button>
            <button className="btn-secondary py-2 text-sm">Facebook</button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 text-sm mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
