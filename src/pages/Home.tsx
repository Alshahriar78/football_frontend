import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const isMobile = window.innerWidth < 768;

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch('https://football-backend-ili4.onrender.com/matches')
      .then((res) => res.json())
      .then((data) => {
        const upcomingMatches = data
          .filter((match: any) => match.status === 'scheduled')
          .sort(
            (a: any, b: any) =>
              new Date(a.matchDate).getTime() -
              new Date(b.matchDate).getTime()
          );

        setMatches(upcomingMatches);
      })
      .catch((error) => {
        console.error('Failed to load fixtures:', error);
      });
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: isMobile ? '1rem' : '2rem',
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: '#1f2937',
          padding: isMobile ? '1rem' : '1.5rem',
          borderRadius: '0.5rem',
          marginBottom: isMobile ? '1rem' : '2rem',
        }}
      >

        <img
    src="/logo.jpg"
    alt="Tournament Logo"
    style={{
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      objectFit: 'cover',
      display: 'block',
      margin: '0 auto 10px auto',
    }}
  />

        <h1
          style={{
            color: 'white',
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: 0,
          }}
          
        >
          Mokamtola eFootball Tournament
        </h1>
        <h2
        style={{
            color: 'red',
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: 0,
          }}>GET READY FOR UPDATE VERSION</h2>

        <p
          style={{
            color: '#d1d5db',
            textAlign: 'center',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            margin: '0.5rem 0 0 0',
          }}
        >
          Live scores, fixtures, standings and statistics
        </p>
      </header>

      {/* Navigation */}
      <nav
        style={{
          backgroundColor: 'white',
          padding: isMobile ? '0.75rem' : '1rem',
          borderRadius: '0.5rem',
          marginBottom: isMobile ? '1rem' : '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '0.5rem' : '2rem',
            flexWrap: 'nowrap',
            minWidth: 'min-content',
          }}
        >
          <Link to="/" style={navStyle(isMobile, true)}>
            🏠 Home
          </Link>

          <Link to="/fixtures" style={navStyle(isMobile)}>
            📅 Fixtures
          </Link>

          <Link to="/results" style={navStyle(isMobile)}>
            📊 Results
          </Link>

          <Link to="/standings" style={navStyle(isMobile)}>
            🏆 Standings
          </Link>

          <Link to="/statistics" style={navStyle(isMobile)}>
            📈 Statistics
          </Link>

          <Link to="/teams" style={navStyle(isMobile)}>
            👥 Teams
          </Link>

          <Link to="/login" style={navStyle(isMobile, false, true)}>
            🔐 Admin Login
          </Link>
        </div>
      </nav>

      {/* Welcome + Upcoming Fixtures */}
      <div
        style={{
          backgroundColor: 'white',
          padding: isMobile ? '1.5rem' : '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: isMobile ? '1rem' : '2rem',
        }}
      >
        {/* Welcome */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2
            style={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 0.75rem 0',
            }}
          >
            Welcome to eFootball Tournament
          </h2>

          <p
            style={{
              color: '#6b7280',
              fontSize: isMobile ? '0.875rem' : '1rem',
              margin: 0,
            }}
          >
            Upcoming matches and fixtures
          </p>
          
        </div>

        {/* Upcoming Fixtures */}
        <div>
          <h3
            style={{
              fontSize: isMobile ? '1rem' : '1.25rem',
              fontWeight: 'bold',
              color: '#1e40af',
              marginBottom: '1rem',
            }}
          >
            📅 Upcoming Fixtures
          </h3>

          {matches.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                color: '#6b7280',
              }}
            >
              No upcoming fixtures
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              {matches.slice(0, 6).map((match: any) => (
                <div
                  key={match.id}
                  style={{
                    border: '1px solid #dbeafe',
                    backgroundColor: '#eff6ff',
                    borderRadius: '0.5rem',
                    padding: isMobile ? '1rem' : '1.25rem',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      color: '#6b7280',
                      fontSize: '0.8rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {new Date(match.matchDate).toLocaleDateString()} —{' '}
                    {new Date(match.matchDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#1f2937',
                      }}
                    >
                      {match.homeTeam?.name || 'Home Team'}
                    </div>

                    <div
                      style={{
                        fontWeight: 'bold',
                        color: '#dc2626',
                        fontSize: '0.9rem',
                      }}
                    >
                      VS
                    </div>

                    <div
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#1f2937',
                      }}
                    >
                      {match.awayTeam?.name || 'Away Team'}
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: 'center',
                      marginTop: '0.75rem',
                      fontSize: '0.75rem',
                      color: '#2563eb',
                    }}
                  >
                    🕐 Scheduled
                  </div>
                </div>
              ))}
            </div>
          )}

          {matches.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link
                to="/fixtures"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                View All Fixtures →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: 'white',
          padding: isMobile ? '1rem' : '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: isMobile ? '0.75rem' : '0.875rem',
        }}
      >
        <p style={{ margin: '0.5rem 0' }}>
          ⚽ eFootball Tournament Management System
        </p>
      </div>
    </div>
  );
};

const navStyle = (
  isMobile: boolean,
  active = false,
  danger = false
) => ({
  color: danger ? '#dc2626' : active ? '#3b82f6' : '#6b7280',
  fontWeight: active || danger ? 'bold' : 'normal',
  textDecoration: 'none',
  fontSize: isMobile ? '0.75rem' : '0.875rem',
  whiteSpace: 'nowrap' as const,
});

export default Home;