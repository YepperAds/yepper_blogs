// AdminLogin.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupInfo, setSetupInfo] = useState(null);
  const { login, getApiUrl } = useAuth();

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/check-setup`);
      const data = await response.json();
      setSetupInfo(data);
      
      // Auto-fill default credentials if not setup
      if (data.defaultCredentials) {
        setCredentials({
          username: data.defaultCredentials.username,
          password: data.defaultCredentials.password
        });
      }
    } catch (error) {
      console.error('Setup check failed:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${getApiUrl()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.admin);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your connection and try again.');
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
        <div className="text-4xl">💄</div>
      </div>
      <div className="absolute bottom-20 right-20 animate-bounce delay-700">
        <div className="text-4xl">🌸</div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border-2 border-pink-100 relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-indigo-500/5"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Admin Login
            </h2>
            <p className="text-gray-600 mt-2">Access your beauty dashboard ✨</p>
          </div>
          
          {setupInfo && setupInfo.defaultCredentials && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔑</span>
                <strong className="text-green-700">Default Login Credentials:</strong>
              </div>
              <div className="space-y-1 text-sm">
                <div className="text-green-600">
                  Username: <code className="bg-green-100 px-2 py-1 rounded">{setupInfo.defaultCredentials.username}</code>
                </div>
                <div className="text-green-600">
                  Password: <code className="bg-green-100 px-2 py-1 rounded">{setupInfo.defaultCredentials.password}</code>
                </div>
                <small className="text-green-500 block mt-2">
                  💡 You can change these after logging in.
                </small>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                  className="w-full px-4 py-4 pl-12 border-2 border-pink-200 rounded-2xl text-lg focus:border-purple-400 focus:outline-none transition-colors duration-300 bg-gradient-to-r from-pink-50/50 to-purple-50/50"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">👤</span>
              </div>
            </div>
            
            <div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="w-full px-4 py-4 pl-12 border-2 border-pink-200 rounded-2xl text-lg focus:border-purple-400 focus:outline-none transition-colors duration-300 bg-gradient-to-r from-pink-50/50 to-purple-50/50"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔒</span>
              </div>
            </div>
            
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <span className="text-red-600 font-medium">{error}</span>
                </div>
              </div>
            )}
            
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
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🚀</span>
                  Login to Dashboard
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;