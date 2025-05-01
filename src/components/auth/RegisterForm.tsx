"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await register(email, password, name);
      router.push('/'); // Redirect to home page after successful registration
    } catch (err: any) {
      // More specific error handling
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already registered');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-[#111111] rounded-xl border border-[#B146FF]/20">
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#B146FF] to-pink-500 mb-8">
          Create an Account
        </h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400 text-center">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-black border border-[#B146FF]/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#B146FF] focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-black border border-[#B146FF]/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#B146FF] focus:border-transparent"
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
              className="w-full p-3 bg-black border border-[#B146FF]/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#B146FF] focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-[#B146FF] hover:bg-[#9333EA] text-white rounded-lg py-3 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Creating Account...
              </div>
            ) : (
              'Sign up'
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-[#B146FF] hover:text-[#9333EA] font-medium transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}