// SetupPrompt.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SetupPrompt = () => {
  const [credentials, setCredentials] = useState({ newUsername: '', newPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, getApiUrl } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${getApiUrl()}/auth/complete-setup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.admin);
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
    <div className="setup-container" style={{
      maxWidth: '500px',
      margin: '50px auto',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Complete Your Setup</h2>
      
      <div style={{
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '25px',
        fontSize: '14px',
        border: '1px solid #ffeaa7'
      }}>
        <strong>Security Notice:</strong> You're currently using default credentials. 
        Please create your own username and password to secure your blog admin panel.
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            New Username:
          </label>
          <input
            type="text"
            placeholder="Enter your new username"
            value={credentials.newUsername}
            onChange={(e) => handleInputChange('newUsername', e.target.value)}
            required
            minLength="3"
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
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            New Password:
          </label>
          <input
            type="password"
            placeholder="Enter your new password"
            value={credentials.newPassword}
            onChange={(e) => handleInputChange('newPassword', e.target.value)}
            required
            minLength="6"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          <small style={{ color: '#6c757d' }}>Minimum 6 characters</small>
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
            backgroundColor: loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Setting up...' : 'Complete Setup'}
        </button>
      </form>
    </div>
  );
};

export default SetupPrompt;