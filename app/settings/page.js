"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function SettingsPage() {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      // Get username from user metadata
      setUsername(user.user_metadata?.username || user.user_metadata?.full_name || '');
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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-main mb-8">Settings</h1>

        {/* Profile Section */}
        <div className="bg-mbg-2 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-main mb-4">Profile</h2>

          {/* Username Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
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

            {/* Message Display */}
            {message.text && (
              <div className={`p-3 rounded-lg ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-bg1 bg-main hover:bg-opacity-90 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Account Information */}
        <div className="bg-mbg-2 rounded-lg p-6">
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
      </div>
    </div>
  );
} 