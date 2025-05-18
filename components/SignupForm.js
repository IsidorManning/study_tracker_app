"use client"
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Validate username
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp({ email, password, username });
      if (error) throw error;
      
      // Redirect to dashboard on successful signup
      router.push('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mbg-1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-main">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-acc-2">
            Join us to start tracking your study sessions
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Social Signup Buttons */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={() => handleSocialSignup('google')}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-main bg-mbg-2 rounded-lg hover:bg-mbg-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main transition-colors"
            >
              <IconBrandGoogle className="w-5 h-5 mr-2" />
              Sign up with Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignup('github')}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-main bg-mbg-2 rounded-lg hover:bg-mbg-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main transition-colors"
            >
              <IconBrandGithub className="w-5 h-5 mr-2" />
              Sign up with GitHub
            </button>
          </div>

          <div className="relative">
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-mbg-1 text-acc-2">Or sign up with email:</span>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-acc-1 placeholder-acc-2 text-main rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent bg-mbg-2"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-acc-1 placeholder-acc-2 text-main rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent bg-mbg-2"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-acc-1 placeholder-acc-2 text-main rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent bg-mbg-2"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-acc-1 placeholder-acc-2 text-main rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent bg-mbg-2"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-bg1 bg-main hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-acc-2">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-main hover:text-acc-2 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
