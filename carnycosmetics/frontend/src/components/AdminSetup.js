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
    <div className="setup-container">
      <h2>Admin Setup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Setup Token"
          value={formData.setupToken}
          onChange={(e) => setFormData({...formData, setupToken: e.target.value})}
          required
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Setting up...' : 'Setup Admin'}
        </button>
      </form>
    </div>
  );
};

export default AdminSetup;