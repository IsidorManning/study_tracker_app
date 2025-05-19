"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function SettingsPage() {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setUsername(user.user_metadata?.username || user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username: username,
          full_name: username
        }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        email: email
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Email update initiated! Please check your email for confirmation.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      // Sign out the user after successful deletion
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-main mb-8">Settings</h1>

        {/* Profile Section */}
        <div className="bg-mbg-2 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-main mb-4">Profile</h2>

          {/* Username Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-4 mb-8">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-acc-2 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-mbg-1 border border-acc-1 rounded-lg text-main focus:outline-none focus:ring-2 focus:ring-main"
                placeholder="Enter your username"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-bg1 bg-main hover:bg-opacity-90 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Updating...' : 'Update Username'}
            </button>
          </form>

          {/* Email Form */}
          <form onSubmit={handleUpdateEmail} className="space-y-4 mb-8">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-acc-2 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-mbg-1 border border-acc-1 rounded-lg text-main focus:outline-none focus:ring-2 focus:ring-main"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-bg1 bg-main hover:bg-opacity-90 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Updating...' : 'Update Email'}
            </button>
          </form>

          {/* Password Form */}
          <form onSubmit={handleUpdatePassword} className="space-y-4 mb-8">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-acc-2 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-mbg-1 border border-acc-1 rounded-lg text-main focus:outline-none focus:ring-2 focus:ring-main"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-acc-2 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-mbg-1 border border-acc-1 rounded-lg text-main focus:outline-none focus:ring-2 focus:ring-main"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-bg1 bg-main hover:bg-opacity-90 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          {/* Message Display */}
          {message.text && (
            <div className={`p-3 rounded-lg mb-4 ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="bg-mbg-2 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-main mb-4">Account Information</h2>
          <div className="space-y-2">
            <p className="text-acc-2">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p className="text-acc-2">
              <span className="font-medium">Provider:</span> {user?.app_metadata?.provider || 'Email'}
            </p>
            <p className="text-acc-2">
              <span className="font-medium">Last Sign In:</span>{' '}
              {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
          <p className="text-red-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
} 