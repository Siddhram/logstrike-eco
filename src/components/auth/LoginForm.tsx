"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      router.push('/'); // Redirect to home page after successful login
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center h-110 bg-[#111111]">
      <div className="w-full p-8 bg-[#0f0f0f] rounded-lg shadow-md border border-[#8B5CF6]/20">
        <h2 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-6">
          Login to Your Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#1A1A1A] border border-[#8B5CF6]/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#1A1A1A] border border-[#8B5CF6]/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg py-3 transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-300">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="text-[#8B5CF6] hover:underline transition-all duration-200"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}