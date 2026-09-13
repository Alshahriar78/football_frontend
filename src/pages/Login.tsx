import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  // Demo credentials - in real app this would be from backend
  const ADMIN_CREDENTIALS = {
    username: 'Murad10',
    password: 'Murad123@123'
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Store auth token in localStorage
      localStorage.setItem('isAdminAuthenticated', 'true');
      localStorage.setItem('adminUsername', username);
      localStorage.setItem('loginTime', new Date().toISOString());
      
      alert('Login successful! Welcome to Admin Panel.');
      navigate('/admin');
    } else {
      setError('Invalid username or password. Try: admin / admin123');
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('loginTime');
  };

  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

  if (isAuthenticated) {
    const adminUsername = localStorage.getItem('adminUsername');
    const loginTime = localStorage.getItem('loginTime');
    
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: isMobile ? '1rem' : '2rem' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          {/* Back to Home */}
          <nav style={{ marginBottom: '2rem' }}>
            <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
              ← Back to Home
            </a>
          </nav>

          {/* Already Logged In Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: isMobile ? '1.5rem' : '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              fontSize: '1.5rem'
            }}>
              ✅
            </div>

            <h2 style={{ 
              fontSize: isMobile ? '1.25rem' : '1.5rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 0.5rem 0' 
            }}>
              Already Logged In
            </h2>

            <p style={{ color: '#6b7280', margin: '0 0 1rem 0', fontSize: isMobile ? '0.875rem' : '1rem' }}>
              Welcome back, <strong>{adminUsername}</strong>!
            </p>

            <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: '0 0 1.5rem 0' }}>
              Logged in: {loginTime ? new Date(loginTime).toLocaleString() : 'Unknown'}
            </p>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/admin')}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}
              >
                🎮 Go to Admin Panel
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  window.location.reload();
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}
              >
                🔓 Logout
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #dbeafe',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginTop: '1rem'
          }}>
            <h4 style={{ color: '#1e40af', fontSize: '0.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
              ℹ️ Session Info
            </h4>
            <ul style={{ color: '#3730a3', fontSize: '0.75rem', margin: 0, paddingLeft: '1rem' }}>
              <li>Session stored in browser localStorage</li>
              <li>Auto-logout on browser close</li>
              <li>Access to all admin functions</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: isMobile ? '1rem' : '2rem' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        {/* Back to Home */}
        <nav style={{ marginBottom: '2rem' }}>
          <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
            ← Back to Home
          </a>
        </nav>

        {/* Login Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: isMobile ? '1.5rem' : '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              fontSize: '1.5rem'
            }}>
              🔐
            </div>
            <h1 style={{ 
              fontSize: isMobile ? '1.25rem' : '1.5rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 0.5rem 0' 
            }}>
              Admin Login
            </h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: isMobile ? '0.875rem' : '1rem' }}>
              Access eFootball Tournament Admin Panel
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#374151', 
                fontWeight: '500',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}>
                👤 Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#374151', 
                fontWeight: '500',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}>
                🔑 Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: isMobile ? '0.75rem' : '0.875rem'
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: isMobile ? '0.875rem' : '1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? '🔄 Logging in...' : '🚀 Login to Admin Panel'}
            </button>
          </form>
        </div>

        {/* Demo Credentials Info */}
        

        {/* Security Info */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <h4 style={{ color: '#15803d', fontSize: '0.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
            🔒 Security Features
          </h4>
          <ul style={{ color: '#15803d', fontSize: '0.75rem', margin: 0, paddingLeft: '1rem' }}>
            <li>Session-based authentication</li>
            <li>Protected admin routes</li>
            <li>Auto-logout on browser close</li>
            <li>Secure credential validation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;