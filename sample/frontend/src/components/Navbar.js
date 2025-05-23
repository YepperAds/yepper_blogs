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
    <nav style={{
      backgroundColor: '#343a40',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white'
    }}>
      <div>
        <Link 
          to="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          My Shop
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link 
          to="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px'
          }}
        >
          Home
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link 
              to="/admin-dashboard" 
              style={{ 
                color: 'white', 
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px'
              }}
            >
              Dashboard
            </Link>
            <span style={{ color: '#adb5bd' }}>
              Welcome, {admin?.username}
            </span>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link 
            to="/admin-login" 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: '#007bff'
            }}
          >
            Admin Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;