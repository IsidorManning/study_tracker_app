"use client"
import React, { useState } from 'react';
import { IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await signIn({ email, password });
      if (error) throw error;
      
      // Redirect to dashboard on successful login
      router.push('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `/`
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
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-acc-2">
            Please sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-main bg-mbg-2 rounded-lg hover:bg-mbg-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main transition-colors"
            >
              <IconBrandGoogle className="w-5 h-5 mr-2" />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-main bg-mbg-2 rounded-lg hover:bg-mbg-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main transition-colors"
            >
              <IconBrandGithub className="w-5 h-5 mr-2" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative">
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-mbg-1 text-acc-2">Or continue with:</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
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
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-acc-1 placeholder-acc-2 text-main rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent bg-mbg-2"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-main focus:ring-main border-acc-1 rounded bg-mbg-2"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-acc-2">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-main hover:text-acc-2 transition-colors">
                Forgot your password?
              </a>
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-acc-2">
              Don&apos;t have an account?
              <a href="/signup" className="ml-2 inline font-medium text-main hover:text-acc-2 transition-colors">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;