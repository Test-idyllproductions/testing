import React, { useState } from 'react';
import { useSupabaseStore } from '../lib/supabase-store';
import { useDialog } from '../lib/dialog-context';
import { UserRole } from '../types';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';

const SupabaseAuthView: React.FC = () => {
  const { signUp, signIn, currentView, setView, loading } = useSupabaseStore();
  const { showDialog } = useDialog();
  const [isLogin, setIsLogin] = useState(currentView === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    console.log('🔵 LOGIN START:', { email: formData.email, isLogin });

    try {
      if (isLogin) {
        console.log('🔵 Calling signIn...');
        const { error } = await signIn(formData.email, formData.password);
        console.log('🔵 signIn response:', { error: error?.message || 'none' });
        
        if (error) {
          console.log('🔴 LOGIN ERROR:', error.message);
          
          // Better error messages
          if (error.message?.includes('Invalid login credentials') || 
              error.message?.includes('Invalid email or password') ||
              error.message?.includes('Email not confirmed')) {
            showDialog({
              type: 'error',
              title: 'Login Failed',
              message: 'Account not found or incorrect password. Please create an account first if you are a new user.',
              actions: [
                { label: 'Create Account', onClick: () => setView('signup'), variant: 'primary' },
                { label: 'Try Again', onClick: () => {}, variant: 'secondary' }
              ]
            });
          } else {
            setError(error.message);
          }
        } else {
          console.log('✅ Login successful, waiting for redirect...');
          // Success! The store will handle redirect via useEffect
        }
        console.log('🔵 LOGIN END');
      } else {
        // All signups default to Editor role
        const { error } = await signUp(formData.email, formData.password, formData.username, UserRole.EDITOR);
        if (error) {
          // Check if user already exists
          if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
            showDialog({
              type: 'warning',
              title: 'Account Already Exists',
              message: 'You already have an account. Please go to Login.',
              actions: [
                { label: 'Go to Login', onClick: () => setView('login'), variant: 'primary' }
              ]
            });
          } else {
            setError(error.message);
          }
        } else {
          setError('');
          showDialog({
            type: 'success',
            title: 'Account Created Successfully',
            message: 'Your account is pending approval from management. Please login and wait for approval.',
            actions: [
              { label: 'Go to Login', onClick: () => setView('login'), variant: 'primary' }
            ]
          });
        }
      }
    } catch (err: any) {
      console.log('🔴 CATCH ERROR:', err.message || err);
      setError(err.message || 'An error occurred');
    } finally {
      console.log('🔵 Setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setView(isLogin ? 'signup' : 'login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => setView('landing')}
          className="mb-6 inline-flex items-center space-x-2 text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Welcome</span>
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <Logo size="xl" className="mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-primary mb-2">
            {isLogin ? 'Welcome Back' : 'Create New Account'}
          </h1>
          <p className="text-secondary">
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-8 shadow-2xl glow-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email or Username */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                Email or Username
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter your email or username"
              />
            </div>

            {/* Username (signup only) */}
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-secondary mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Choose a username"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-primary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed glow-border"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            {/* Toggle Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
              >
                {isLogin ? "Don't have an account? Create one" : 'Already have an account? Login'}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        {!isLogin && (
          <div className="mt-6 text-center">
            <p className="text-secondary text-sm">
              All new accounts are created as Editors and require management approval before accessing the workspace.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseAuthView;