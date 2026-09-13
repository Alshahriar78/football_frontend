import React from 'react';

const Home = () => {
  const isMobile = window.innerWidth < 768;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: isMobile ? '1rem' : '2rem' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#1f2937', 
        padding: isMobile ? '1rem' : '1.5rem', 
        borderRadius: '0.5rem', 
        marginBottom: isMobile ? '1rem' : '2rem'
      }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: isMobile ? '1.5rem' : '2rem', 
          fontWeight: 'bold', 
          textAlign: 'center',
          margin: 0
        }}>
          Mokamtola eFootball Tournament
        </h1>
        <p style={{ 
          color: '#d1d5db', 
          textAlign: 'center', 
          fontSize: isMobile ? '0.75rem' : '0.875rem',
          margin: '0.5rem 0 0 0'
        }}>
          Live scores, fixtures, standings and statistics
        </p>
      </header>

      {/* Navigation */}
      <nav style={{ 
        backgroundColor: 'white', 
        padding: isMobile ? '0.75rem' : '1rem', 
        borderRadius: '0.5rem', 
        marginBottom: isMobile ? '1rem' : '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflowX: 'auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: isMobile ? 'flex-start' : 'center', 
          gap: isMobile ? '0.5rem' : '2rem', 
          flexWrap: 'nowrap',
          minWidth: 'min-content'
        }}>
          <a href="/" style={{ 
            color: '#3b82f6', 
            fontWeight: 'bold', 
            textDecoration: 'none',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            whiteSpace: 'nowrap'
          }}>🏠 Home</a>
          <a href="/fixtures" style={{ 
            color: '#6b7280', 
            textDecoration: 'none',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            whiteSpace: 'nowrap'
          }}>📅 Fixtures</a>
          <a href="/results" style={{ 
            color: '#6b7280', 
            textDecoration: 'none',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            whiteSpace: 'nowrap'
          }}>📊 Results</a>
          <a href="/standings" style={{ 
            color: '#6b7280', 
            textDecoration: 'none',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            whiteSpace: 'nowrap'
          }}>🏆 Standings</a>
          <a href="/statistics" style={{ 
            color: '#6b7280', 
            textDecoration: 'none',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            whiteSpace: 'nowrap'
          }}>📈 Statistics</a>
          <a href="/teams" style={{ 
            color: '#6b7280', 
            textDecoration: 'none',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            whiteSpace: 'nowrap'
          }}>👥 Teams</a>
          <a href="/login" style={{ 
            color: '#dc2626', 
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            whiteSpace: 'nowrap'
          }}>🔐 Admin Login</a>
        </div>
      </nav>

      {/* Welcome Section */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: isMobile ? '1.5rem' : '2rem', 
        borderRadius: '0.5rem',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: isMobile ? '1rem' : '2rem'
      }}>
        <h2 style={{ 
          fontSize: isMobile ? '1.25rem' : '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem', 
          color: '#1f2937',
          margin: '0 0 1rem 0'
        }}>
          Welcome to eFootball Tournament
        </h2>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '1.5rem',
          fontSize: isMobile ? '0.875rem' : '1rem',
          margin: '0 0 1.5rem 0'
        }}>
          Track live matches, view league standings, analyze statistics, and follow your favorite players in the online tournament
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: isMobile ? '0.75rem' : '1rem'
        }}>
          <div style={{ 
            backgroundColor: '#eff6ff', 
            padding: isMobile ? '1rem' : '1.5rem', 
            borderRadius: '0.5rem',
            border: '1px solid #dbeafe'
          }}>
            <h3 style={{ color: '#1e40af', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: isMobile ? '0.875rem' : '1rem', margin: '0 0 0.5rem 0' }}>🎮 Fixtures</h3>
            <p style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', margin: 0 }}>View upcoming matches</p>
          </div>
          
          <div style={{ 
            backgroundColor: '#f0fdf4', 
            padding: isMobile ? '1rem' : '1.5rem', 
            borderRadius: '0.5rem',
            border: '1px solid #dcfce7'
          }}>
            <h3 style={{ color: '#166534', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: isMobile ? '0.875rem' : '1rem', margin: '0 0 0.5rem 0' }}>📊 Results</h3>
            <p style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', margin: 0 }}>Check match scores</p>
          </div>
          
          <div style={{ 
            backgroundColor: '#fefce8', 
            padding: isMobile ? '1rem' : '1.5rem', 
            borderRadius: '0.5rem',
            border: '1px solid #fef3c7'
          }}>
            <h3 style={{ color: '#a16207', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: isMobile ? '0.875rem' : '1rem', margin: '0 0 0.5rem 0' }}>🏆 Standings</h3>
            <p style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', margin: 0 }}>Live league table</p>
          </div>

          <div style={{ 
            backgroundColor: '#fdf2f8', 
            padding: isMobile ? '1rem' : '1.5rem', 
            borderRadius: '0.5rem',
            border: '1px solid #fbcfe8'
          }}>
            <h3 style={{ color: '#be185d', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: isMobile ? '0.875rem' : '1rem', margin: '0 0 0.5rem 0' }}>📈 Statistics</h3>
            <p style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', margin: 0 }}>Performance analysis</p>
          </div>

          <div style={{ 
            backgroundColor: '#f3e8ff', 
            padding: isMobile ? '1rem' : '1.5rem', 
            borderRadius: '0.5rem',
            border: '1px solid #e9d5ff'
          }}>
            <h3 style={{ color: '#7c3aed', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: isMobile ? '0.875rem' : '1rem', margin: '0 0 0.5rem 0' }}>👥 Teams</h3>
            <p style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', margin: 0 }}>Browse players</p>
          </div>

          <div style={{ 
            backgroundColor: '#fef2f2', 
            padding: isMobile ? '1rem' : '1.5rem', 
            borderRadius: '0.5rem',
            border: '1px solid #fecaca'
          }}>
            <h3 style={{ color: '#dc2626', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: isMobile ? '0.875rem' : '1rem', margin: '0 0 0.5rem 0' }}>🔐 Admin Login</h3>
            <p style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', margin: 0 }}>Manage tournament</p>
          </div>
        </div>
      </div>

      {/* Admin Info Card */}
      <div style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fed7aa',
        borderRadius: '0.5rem',
        padding: isMobile ? '1rem' : '1.5rem',
        marginBottom: isMobile ? '1rem' : '2rem'
      }}>
        <h3 style={{ 
          color: '#c2410c', 
          fontSize: isMobile ? '0.875rem' : '1rem', 
          fontWeight: 'bold', 
          margin: '0 0 0.5rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🔐 Administrator Access
        </h3>
        <p style={{ color: '#ea580c', fontSize: isMobile ? '0.75rem' : '0.875rem', margin: '0 0 0.75rem 0' }}>
          Secure admin panel to manage teams, schedule matches, and enter results
        </p>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '0.75rem',
          alignItems: isMobile ? 'stretch' : 'center'
        }}>
          <a 
            href="/login" 
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              textAlign: 'center'
            }}
          >
            🚀 Access Admin Panel
          </a>
          <span style={{ color: '#92400e', fontSize: '0.75rem' }}>
            Demo: admin / admin123
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        backgroundColor: 'white',
        padding: isMobile ? '1rem' : '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: isMobile ? '0.75rem' : '0.875rem'
      }}>
        <p style={{ margin: '0.5rem 0' }}>⚽ eFootball Tournament Management System</p>
        <p style={{ margin: '0.5rem 0', color: '#9ca3af' }}>Powered by NestJS + React + PostgreSQL</p>
        <div style={{ 
          marginTop: '0.75rem', 
          paddingTop: '0.75rem', 
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          fontSize: '0.7rem'
        }}>
          <span>🔒 Authentication System</span>
          <span>📱 Mobile Responsive</span>
          <span>📊 Real-time Statistics</span>
          <span>⚡ Auto League Table</span>
        </div>
      </div>
    </div>
  );
};

export default Home;