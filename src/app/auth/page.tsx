'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();

  // Handle URL error parameters
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized') {
      setError('You do not have permission to access the admin area. Please contact the administrator.');
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Check if user is an admin in the public.users table
      const { data: userData, error: userError } = await supabase
        .from('users')  // Using public.users table
        .select('role')
        .eq('id', data.user?.id)
        .single();
      
      if (userError) {
        console.error("Error fetching user role:", userError);
        setError('Error verifying user role. Please try again.');
        return;
      }
      
      if (!userData || userData.role !== 'admin') {
        setError('You do not have admin privileges. Please contact the administrator.');
        await supabase.auth.signOut();
        return;
      }
      
      setMessage('Sign in successful! Redirecting to admin dashboard...');
      
      // If user is admin, redirect to admin dashboard
      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Please try again.';
      setError(`An unexpected error occurred: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Set message based on whether email confirmation is required
      if (data.user?.identities?.length === 0) {
        setMessage('This email is already registered. Please sign in instead.');
      } else {
        setMessage('Registration successful! Please check your email to confirm your account.');
      }
      
      // Note: Users will need to be manually assigned the admin role after registration
      // This is a security measure to prevent anyone from registering as an admin
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Please try again.';
      setError(`An unexpected error occurred: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <img 
                src="/logo.png" 
                alt="The Boring Coffee Logo" 
                className="h-16 mx-auto mb-2"
              />
            </Link>
            <h2 className="text-2xl font-bold text-gray-800">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isSignUp 
                ? 'Sign up to access admin features' 
                : 'Sign in to manage your coffee shop'}
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-800 rounded">
              {error}
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-800 rounded">
              {message}
            </div>
          )}
          
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="••••••••"
                required
              />
              {isSignUp && (
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F5CB5C] text-[#333533] py-2 px-4 rounded-md hover:bg-[#F3C13A] transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#F5CB5C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setMessage(null);
              }}
              className="text-sm text-gray-600 hover:text-primary hover:underline transition duration-300"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-center text-gray-500">
            Note: Admin access requires approval from an existing administrator after registration
          </p>
        </div>
      </div>
    </div>
  );
} 