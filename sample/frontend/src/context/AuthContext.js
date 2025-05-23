// AuthContext.js - Enhanced version
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [needsSetup, setNeedsSetup] = useState(false); // New state

  // Get API base URL
  const getApiUrl = () => {
    return window.API_BASE_URL || (
      process.env.NODE_ENV === 'production' 
        ? '/api' 
        : 'http://localhost:5000/api'
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/verify`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setAdmin(data.admin);
        // Check if user needs to complete setup (change default credentials)
        setNeedsSetup(!data.admin.isSetup);
      } else {
        // Token is invalid
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setAdmin(null);
        setNeedsSetup(false);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      setAdmin(null);
      setNeedsSetup(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (token, adminData) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
    setAdmin(adminData);
    // Check if setup is needed after login
    setNeedsSetup(!adminData.isSetup);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setAdmin(null);
    setNeedsSetup(false);
  };

  const completeSetup = (adminData) => {
    setAdmin(adminData);
    setNeedsSetup(false);
  };

  const value = {
    isAuthenticated,
    admin,
    loading,
    needsSetup, // Expose this state
    login,
    logout,
    completeSetup, // New method
    getApiUrl
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};