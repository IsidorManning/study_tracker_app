"use client"
import React, { useState } from 'react';
import { IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Button, TextField, Checkbox, FormControlLabel, Box, Typography, Container, Paper } from '@mui/material';

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
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
        className='rounded-xl'
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" color="pink" gutterBottom>
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please sign in to your account
            </Typography>
          </Box>

          {/* Error Message */}
          {error && (
            <Box sx={{ bgcolor: 'error.light', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {/* Social Login Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<IconBrandGoogle sx={{ color: 'text.pink' }} />}
              onClick={() => handleSocialLogin('google')}
              sx={{ 
                textTransform: 'none',
                color: 'text.pink',
                borderColor: 'text.pink',
                '&:hover': {
                  backgroundColor: 'background.secondary',
                  opacity: 0.9
                }
              }}
            >
              Continue with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<IconBrandGithub sx={{ color: 'text.pink' }} />}
              onClick={() => handleSocialLogin('github')}
              sx={{ 
                textTransform: 'none',
                color: 'text.pink',
                borderColor: 'text.pink',
                '&:hover': {
                  backgroundColor: 'background.secondary',
                  opacity: 0.9
                }
              }}
            >
              Continue with GitHub
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Or continue with:
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'text.pink',
                  },
                  '&:hover fieldset': {
                    borderColor: 'text.pink',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'text.pink',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.pink',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'text.pink',
                },
                '& .MuiInputBase-input': {
                  color: 'text.pink',
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'text.pink',
                  },
                  '&:hover fieldset': {
                    borderColor: 'text.pink',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'text.pink',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.pink',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'text.pink',
                },
                '& .MuiInputBase-input': {
                  color: 'text.pink',
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: 'text.pink',
                      '&.Mui-checked': {
                        color: 'text.pink',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: 'text.pink' }}>
                    Remember me
                  </Typography>
                }
              />
              <Button 
                sx={{ 
                  textTransform: 'none',
                  color: 'text.pink',
                  '&:hover': {
                    backgroundColor: 'background.secondary',
                    opacity: 0.9
                  }
                }}
              >
                Forgot password?
              </Button>
            </Box>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                bgcolor: 'text.pink',
                '&:hover': {
                  bgcolor: 'text.pink',
                  opacity: 0.9
                },
                '&:disabled': {
                  bgcolor: 'text.pink',
                  opacity: 0.5
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{' '}
                <Button
                  href="/signup"
                  sx={{ 
                    textTransform: 'none',
                    color: 'text.pink',
                    '&:hover': {
                      backgroundColor: 'background.secondary',
                      opacity: 0.9
                    }
                  }}
                >
                  Sign up
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginForm;