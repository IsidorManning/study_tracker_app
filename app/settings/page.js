"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Box, 
  Alert, 
  IconButton,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import { 
  IconUser, 
  IconMail, 
  IconLock, 
  IconTrash,
  IconEye,
  IconEyeOff
} from '@tabler/icons-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <Box className="min-h-screen p-8">
      <Box className="max-w-2xl mx-auto">
        <Typography variant="h4" component="h1" color="text.pink" gutterBottom>
          Settings
        </Typography>

        {/* Profile Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            bgcolor: 'background.paper',
            borderRadius: 2
          }}
        >
          <Stack spacing={4}>
            <Box>
              <Typography variant="h6" color="text.pink" gutterBottom>
                <IconUser className="inline-block mr-2" size={20} />
                Profile
              </Typography>

              {/* Username Form */}
              <form onSubmit={handleUpdateProfile}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'text.pink' },
                        '&:hover fieldset': { borderColor: 'text.pink' },
                        '&.Mui-focused fieldset': { borderColor: 'text.pink' },
                      },
                      '& .MuiInputLabel-root': { color: 'text.pink' },
                      '& .MuiInputLabel-root.Mui-focused': { color: 'text.pink' },
                      '& .MuiInputBase-input': { color: 'text.pink' },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      bgcolor: 'text.pink',
                      '&:hover': {
                        bgcolor: 'text.pink',
                        opacity: 0.9,
                        transform: 'scale(1.02)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Username'}
                  </Button>
                </Stack>
              </form>
            </Box>

            <Divider sx={{ borderColor: 'text.pink', opacity: 0.2 }} />

            {/* Email Form */}
            <Box>
              <Typography variant="h6" color="text.pink" gutterBottom>
                <IconMail className="inline-block mr-2" size={20} />
                Email
              </Typography>
              <form onSubmit={handleUpdateEmail}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'text.pink' },
                        '&:hover fieldset': { borderColor: 'text.pink' },
                        '&.Mui-focused fieldset': { borderColor: 'text.pink' },
                      },
                      '& .MuiInputLabel-root': { color: 'text.pink' },
                      '& .MuiInputLabel-root.Mui-focused': { color: 'text.pink' },
                      '& .MuiInputBase-input': { color: 'text.pink' },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      bgcolor: 'text.pink',
                      '&:hover': {
                        bgcolor: 'text.pink',
                        opacity: 0.9,
                        transform: 'scale(1.02)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Email'}
                  </Button>
                </Stack>
              </form>
            </Box>

            <Divider sx={{ borderColor: 'text.pink', opacity: 0.2 }} />

            {/* Password Form */}
            <Box>
              <Typography variant="h6" color="text.pink" gutterBottom>
                <IconLock className="inline-block mr-2" size={20} />
                Password
              </Typography>
              <form onSubmit={handleUpdatePassword}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'text.pink' }}
                          >
                            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'text.pink' },
                        '&:hover fieldset': { borderColor: 'text.pink' },
                        '&.Mui-focused fieldset': { borderColor: 'text.pink' },
                      },
                      '& .MuiInputLabel-root': { color: 'text.pink' },
                      '& .MuiInputLabel-root.Mui-focused': { color: 'text.pink' },
                      '& .MuiInputBase-input': { color: 'text.pink' },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{ color: 'text.pink' }}
                          >
                            {showConfirmPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'text.pink' },
                        '&:hover fieldset': { borderColor: 'text.pink' },
                        '&.Mui-focused fieldset': { borderColor: 'text.pink' },
                      },
                      '& .MuiInputLabel-root': { color: 'text.pink' },
                      '& .MuiInputLabel-root.Mui-focused': { color: 'text.pink' },
                      '& .MuiInputBase-input': { color: 'text.pink' },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      bgcolor: 'text.pink',
                      '&:hover': {
                        bgcolor: 'text.pink',
                        opacity: 0.9,
                        transform: 'scale(1.02)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </Stack>
              </form>
            </Box>
          </Stack>

          {/* Message Display */}
          {message.text && (
            <Alert 
              severity={message.type === 'success' ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {message.text}
            </Alert>
          )}
        </Paper>

        {/* Account Information */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            bgcolor: 'background.paper',
            borderRadius: 2
          }}
        >
          <Typography variant="h6" color="text.pink" gutterBottom>
            Account Information
          </Typography>
          <Stack spacing={2}>
            <Typography color="text.pink">
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography color="text.pink">
              <strong>Provider:</strong> {user?.app_metadata?.provider || 'Email'}
            </Typography>
            <Typography color="text.pink">
              <strong>Last Sign In:</strong>{' '}
              {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
            </Typography>
          </Stack>
        </Paper>

        {/* Delete Account Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'error.main'
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            <IconTrash className="inline-block mr-2" size={20} />
            Danger Zone
          </Typography>
          <Typography color="error" paragraph>
            Once you delete your account, there is no going back. Please be certain.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteAccount}
            disabled={loading}
            sx={{
              '&:hover': {
                transform: 'scale(1.02)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Delete Account
          </Button>
        </Paper>
      </Box>
    </Box>
  );
} 