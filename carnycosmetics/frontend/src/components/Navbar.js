// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <Link 
              to="/" 
              className="text-white text-2xl font-bold hover:text-pink-200 transition-colors duration-300 flex items-center gap-2"
            >
              <span className="text-3xl">✨</span>
              CN Cosmetics Shop
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="text-white hover:text-pink-200 transition-colors duration-300 px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm font-medium"
            >
              🏠 Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/admin-dashboard" 
                  className="text-white hover:text-pink-200 transition-colors duration-300 px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm font-medium"
                >
                  📊 Dashboard
                </Link>
                <span className="text-pink-100 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  💅 Welcome, {admin?.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <Link 
                to="/admin-login" 
                className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-pink-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🔐 Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;