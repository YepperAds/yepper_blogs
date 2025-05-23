// SetupCredentials.js - New component specifically for changing default credentials
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SetupCredentials = () => {
  const [credentials, setCredentials] = useState({ newUsername: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { completeSetup, getApiUrl, isAuthenticated, needsSetup } = useAuth();

  // Redirect if not authenticated or setup is already complete
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
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        background: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        padding: '15px', 
        borderRadius: '5px', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ Security Setup Required</h3>
        <p style={{ margin: 0, color: '#856404' }}>
          You're currently using default credentials. For security reasons, you must create your own username and password before accessing the admin panel.
        </p>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Create Your Admin Credentials</h2>
        
        {error && (
          <div style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              New Username:
            </label>
            <input
              type="text"
              value={credentials.newUsername}
              onChange={(e) => handleInputChange('newUsername', e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Enter your new username"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              New Password:
            </label>
            <input
              type="password"
              value={credentials.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              required
              minLength="6"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Enter your new password (min 6 characters)"
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Confirm Password:
            </label>
            <input
              type="password"
              value={credentials.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Confirm your new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Setting Up...' : 'Complete Setup'}
          </button>
        </form>

        <div style={{ 
          background: '#e7f3ff', 
          padding: '15px', 
          borderRadius: '4px', 
          marginTop: '20px' 
        }}>
          <small style={{ color: '#31708f' }}>
            <strong>Important:</strong> Please remember your new credentials. You won't be able to recover them, and the default credentials will no longer work.
          </small>
        </div>
      </div>
    </div>
  );
};

export default SetupCredentials;