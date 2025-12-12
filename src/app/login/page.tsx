'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Shield, AlertCircle, Eye, EyeOff, User, Lock, X } from 'lucide-react';

// LocalStorage key for saved username
const SAVED_USERNAME_KEY = 'crisis_dashboard_saved_username';

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [hasSavedUsername, setHasSavedUsername] = useState(false);

  // Load saved username on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUsername = localStorage.getItem(SAVED_USERNAME_KEY);
      if (savedUsername) {
        setFormData(prev => ({ ...prev, username: savedUsername }));
        setHasSavedUsername(true);
        setRememberMe(true);
      }
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      await login(formData.username, formData.password);
      
      // Save username to localStorage if "Remember me" is checked
      if (typeof window !== 'undefined') {
        if (rememberMe) {
          localStorage.setItem(SAVED_USERNAME_KEY, formData.username);
        } else {
          localStorage.removeItem(SAVED_USERNAME_KEY);
        }
      }
      
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const handleClearSavedUsername = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SAVED_USERNAME_KEY);
      setFormData(prev => ({ ...prev, username: '' }));
      setHasSavedUsername(false);
      setRememberMe(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold text-white mb-2">Crisis Management System</h1>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Sample credentials info box
  const sampleCredentials = [
    { username: 'admin', password: 'admin123', role: 'Administrator' },
    { username: 'dispatcher', password: 'dispatch123', role: 'Dispatcher' },
    { username: 'hospital', password: 'hospital123', role: 'Hospital Worker' },
    { username: 'responder', password: 'respond123', role: 'First Responder' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Crisis Management System
          </h1>
          <p className="text-slate-400">
            Sign in to access the dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
          {/* Saved Username Notice */}
          {hasSavedUsername && (
            <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg flex items-start justify-between">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-300 font-medium">Welcome back!</p>
                  <p className="text-xs text-blue-400 mt-0.5">Username remembered from last login</p>
                </div>
              </div>
              <button
                onClick={handleClearSavedUsername}
                className="text-blue-400 hover:text-blue-300 transition-colors"
                title="Clear saved username"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-3 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-12 py-3 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-slate-300">
                Remember my username
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors focus:ring-4 focus:ring-blue-500/50 focus:outline-none"
            >
              Sign In
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-3 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400 text-center">
              <Lock className="w-3 h-3 inline mr-1" />
              Your password is never saved. Only username is remembered.
            </p>
          </div>
        </div>

        {/* Sample Credentials */}
        <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            Sample Login Credentials
          </h3>
          <div className="space-y-2">
            {sampleCredentials.map((cred, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-slate-700/30 rounded text-xs"
              >
                <div className="flex-1">
                  <span className="text-slate-400">{cred.role}:</span>
                  <span className="text-blue-400 ml-2 font-mono">{cred.username}</span>
                  <span className="text-slate-500 mx-1">/</span>
                  <span className="text-slate-400 font-mono">{cred.password}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center">
            Click "Remember my username" to save your username for next time
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Secure access to crisis management system</p>
        </div>
      </div>
    </div>
  );
}