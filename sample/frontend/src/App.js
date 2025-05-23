// App.js

// Updated App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // New import
import SetupCredentials from './components/SetupCredentials'; // New import
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import AdminSetup from './components/AdminSetup';
import './App.css';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

window.API_BASE_URL = API_BASE_URL;

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [setupComplete, setSetupComplete] = useState(null);
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-setup`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSetupComplete(data.setupComplete);
    } catch (error) {
      console.error('Error checking setup status:', error);
      setSetupComplete(false);
    } finally {
      setCheckingSetup(false);
    }
  };

  if (loading || checkingSetup) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '20px' }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          
          {/* Initial admin setup route (for first-time setup) */}
          {!setupComplete && (
            <Route 
              path="/admin-setup" 
              element={
                <AdminSetup onSetupComplete={() => {
                  setSetupComplete(true);
                }} />
              } 
            />
          )}
          
          {/* Login route */}
          <Route 
            path="/admin-login" 
            element={
              isAuthenticated ? 
              <Navigate to="/admin-dashboard" replace /> : 
              <AdminLogin />
            } 
          />
          
          {/* Credential setup route - for changing default credentials */}
          <Route 
            path="/admin-setup-credentials" 
            element={<SetupCredentials />}
          />
          
          {/* Dashboard route - now protected */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Add other admin routes here, all protected */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                {/* Your other admin components */}
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect admin-setup to login if setup is complete */}
          {setupComplete && (
            <Route 
              path="/admin-setup" 
              element={<Navigate to="/admin-login" replace />} 
            />
          )}
        </Routes>
      </main>
    </>
  );
}

export default App;