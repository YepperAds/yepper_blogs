// SetupCredentials.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SetupCredentials = () => {
  const [credentials, setCredentials] = useState({ newUsername: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { completeSetup, getApiUrl, isAuthenticated, needsSetup } = useAuth();

  if (!isAuthenticated || !needsSetup) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (credentials.newPassword !== credentials.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (credentials.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${getApiUrl()}/auth/complete-setup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newUsername: credentials.newUsername,
          newPassword: credentials.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update the auth context
        completeSetup(data.admin);
        // Update the token in case it was refreshed
        localStorage.setItem('adminToken', data.token);
      } else {
        setError(data.message || 'Setup failed');
      }
    } catch (error) {
      console.error('Setup error:', error);
      setError('Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-6">
      {/* Floating elements */}
      <div className="absolute top-20 left-20 animate-bounce delay-100">
        <div className="text-4xl">🔐</div>
      </div>
      <div className="absolute top-32 right-32 animate-bounce delay-300">
        <div className="text-4xl">✨</div>
      </div>
      <div className="absolute bottom-32 left-32 animate-bounce delay-500">
        <div className="text-4xl">🛡️</div>
      </div>
      <div className="absolute bottom-20 right-20 animate-bounce delay-700">
        <div className="text-4xl">🌸</div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border-2 border-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-indigo-500/5"></div>
        
        <div className="relative z-10">
          {/* Security Warning */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⚠️</span>
              <h3 className="font-bold text-amber-700">Security Setup Required</h3>
            </div>
            <p className="text-amber-600 text-sm leading-relaxed">
              You're currently using default credentials. For security reasons, you must create your own username and password before accessing the admin panel.
            </p>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Create Your Admin Credentials
            </h2>
            <p className="text-gray-600 mt-2">Secure your beauty dashboard ✨</p>
          </div>
          
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xl">❌</span>
                <span className="text-red-600 font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">👤</span>
                New Username:
              </label>
              <input
                type="text"
                value={credentials.newUsername}
                onChange={(e) => handleInputChange('newUsername', e.target.value)}
                required
                className="w-full px-4 py-4 border-2 border-pink-200 rounded-2xl text-lg focus:border-purple-400 focus:outline-none transition-colors duration-300 bg-gradient-to-r from-pink-50/50 to-purple-50/50"
                placeholder="Enter your new username"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">🔒</span>
                New Password:
              </label>
              <input
                type="password"
                value={credentials.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                required
                minLength="6"
                className="w-full px-4 py-4 border-2 border-pink-200 rounded-2xl text-lg focus:border-purple-400 focus:outline-none transition-colors duration-300 bg-gradient-to-r from-pink-50/50 to-purple-50/50"
                placeholder="Enter your new password (min 6 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">🔒</span>
                Confirm Password:
              </label>
              <input
                type="password"
                value={credentials.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                className="w-full px-4 py-4 border-2 border-pink-200 rounded-2xl text-lg focus:border-purple-400 focus:outline-none transition-colors duration-300 bg-gradient-to-r from-pink-50/50 to-purple-50/50"
                placeholder="Confirm your new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin text-xl">⏳</div>
                  Setting Up...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>✨</span>
                  Complete Setup
                </span>
              )}
            </button>
          </form>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4 mt-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <strong className="text-blue-700 block mb-1">Important:</strong>
                <small className="text-blue-600 leading-relaxed">
                  Please remember your new credentials. You won't be able to recover them, and the default credentials will no longer work.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupCredentials;