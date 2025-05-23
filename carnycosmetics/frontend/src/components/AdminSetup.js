// AdminSetup.js
import React, { useState } from 'react';

const AdminSetup = ({ onSetupComplete }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    setupToken: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onSetupComplete(data.token, data.admin);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-6">
      {/* Floating elements */}
      <div className="absolute top-20 left-20 animate-bounce delay-100">
        <div className="text-4xl">⚙️</div>
      </div>
      <div className="absolute top-32 right-32 animate-bounce delay-300">
        <div className="text-4xl">✨</div>
      </div>
      <div className="absolute bottom-32 left-32 animate-bounce delay-500">
        <div className="text-4xl">🔧</div>
      </div>
      <div className="absolute bottom-20 right-20 animate-bounce delay-700">
        <div className="text-4xl">🌸</div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border-2 border-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-indigo-500/5"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⚙️</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Admin Setup
            </h2>
            <p className="text-gray-600 mt-2">Initialize your beauty dashboard 🌟</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
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
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="w-full px-4 py-4 pl-12 border-2 border-pink-200 rounded-2xl text-lg focus:border-purple-400 focus:outline-none transition-colors duration-300 bg-gradient-to-r from-pink-50/50 to-purple-50/50"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔒</span>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Setup Token"
                  value={formData.setupToken}
                  onChange={(e) => setFormData({...formData, setupToken: e.target.value})}
                  required
                  className="w-full px-4 py-4 pl-12 border-2 border-pink-200 rounded-2xl text-lg focus:border-purple-400 focus:outline-none transition-colors duration-300 bg-gradient-to-r from-pink-50/50 to-purple-50/50"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔑</span>
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
                  Setting up...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🚀</span>
                  Setup Admin
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;