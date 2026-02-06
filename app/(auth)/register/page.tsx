'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';
import { validateEmail, validatePassword } from '@/lib/utils';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiAlertCircle, FiCheck } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    password: '',
    password_confirm: '',
  });
  const [validations, setValidations] = useState({
    email: false,
    password: false,
    passwordMatch: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === 'email') {
      setValidations((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (name === 'password') {
      setValidations((prev) => ({
        ...prev,
        password: validatePassword(value),
        passwordMatch: value === formData.password_confirm,
      }));
    } else if (name === 'password_confirm') {
      setValidations((prev) => ({
        ...prev,
        passwordMatch: formData.password === value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.full_name || !formData.email || !formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validations.email) {
      toast.error('Please enter a valid email');
      return;
    }

    if (!validations.password) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (!validations.passwordMatch) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await register({
        full_name: formData.full_name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      toast.success('Account created successfully!');
      router.push('/browse');
    } catch (err) {
      toast.error(error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join Need and find local services</p>
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
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-900 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="input-base pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="input-base pl-10"
                  disabled={isLoading}
                  required
                />
                {formData.email && (
                  <FiCheck className={`absolute right-3 top-3.5 ${validations.email ? 'text-green-600' : 'text-gray-300'}`} />
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="johndoe"
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
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="input-base pl-10"
                  disabled={isLoading}
                  required
                />
                {formData.password && (
                  <FiCheck className={`absolute right-3 top-3.5 ${validations.password ? 'text-green-600' : 'text-gray-300'}`} />
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">At least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="password_confirm"
                  name="password_confirm"
                  type="password"
                  value={formData.password_confirm}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="input-base pl-10"
                  disabled={isLoading}
                  required
                />
                {formData.password_confirm && (
                  <FiCheck className={`absolute right-3 top-3.5 ${validations.passwordMatch ? 'text-green-600' : 'text-gray-300'}`} />
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm text-gray-600">
              <input type="checkbox" className="mt-1" required />
              <span>
                I agree to the{' '}
                <Link href="/terms" className="text-primary font-semibold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !validations.email || !validations.password || !validations.passwordMatch}
              className="w-full btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 text-sm mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
