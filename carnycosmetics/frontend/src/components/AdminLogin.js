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
    <div className="login-container" style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Login</h2>
      
      {setupInfo && setupInfo.defaultCredentials && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px',
          fontSize: '14px',
          border: '1px solid #c3e6cb'
        }}>
          <strong>Default Login Credentials:</strong><br/>
          Username: <code>{setupInfo.defaultCredentials.username}</code><br/>
          Password: <code>{setupInfo.defaultCredentials.password}</code><br/>
          <small>You can change these after logging in.</small>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        {error && (
          <div style={{
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
