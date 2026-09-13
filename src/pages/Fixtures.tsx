import React, { useState, useEffect } from 'react';
import { matchAPI } from '../services/api';

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Match {
  id: number;
  matchDate: string;
  status: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  venue: string;
  round: number;
}

const Fixtures = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await matchAPI.getAll();
      const scheduled = response.data.filter((m: Match) => m.status === 'scheduled');
      setMatches(scheduled);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6b7280', fontSize: isMobile ? '1rem' : '1.25rem' }}>Loading fixtures...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: isMobile ? '1rem' : '2rem' }}>
      <header style={{ marginBottom: isMobile ? '1rem' : '2rem' }}>
        <h1 style={{ 
          fontSize: isMobile ? '1.5rem' : '2rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          margin: '0 0 0.5rem 0' 
        }}>
          Upcoming Fixtures
        </h1>
        <p style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', margin: '0 0 1rem 0' }}>
          Scheduled matches for the tournament
        </p>
        <nav>
          <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>← Back to Home</a>
        </nav>
      </header>

      {matches.length === 0 ? (
        <div style={{ 
          backgroundColor: 'white', 
          padding: isMobile ? '2rem 1rem' : '3rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center', 
          color: '#6b7280',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          No upcoming fixtures scheduled
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.75rem' : '1rem' }}>
          {matches.map((match) => (
            <div key={match.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              padding: isMobile ? '1rem' : '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              {/* Round & Date */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <span style={{ 
                  backgroundColor: '#dbeafe', 
                  color: '#1e40af', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '1rem', 
                  fontSize: isMobile ? '0.65rem' : '0.75rem',
                  fontWeight: 'bold'
                }}>
                  Round {match.round}
                </span>
                <span style={{ color: '#6b7280', fontSize: isMobile ? '0.65rem' : '0.75rem' }}>
                  📅 {new Date(match.matchDate).toLocaleDateString('en-GB', {
                    weekday: isMobile ? 'short' : 'long',
                    year: 'numeric',
                    month: isMobile ? 'short' : 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              {/* Teams & Score */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr auto 1fr' : '1fr auto 1fr',
                alignItems: 'center',
                gap: isMobile ? '0.5rem' : '1rem'
              }}>
                {/* Home Team */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: '#1f2937',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    {match.homeTeam.name}
                  </div>
                  <div style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', color: '#6b7280' }}>Home</div>
                </div>

                {/* VS */}
                <div style={{ 
                  backgroundColor: '#f3f4f6',
                  padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    fontSize: isMobile ? '1rem' : '1.25rem', 
                    fontWeight: 'bold', 
                    color: '#6b7280' 
                  }}>VS</div>
                  <div style={{ fontSize: isMobile ? '0.6rem' : '0.75rem', color: '#9ca3af' }}>
                    {new Date(match.matchDate).toLocaleTimeString('en-GB', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                {/* Away Team */}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: '#1f2937',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    {match.awayTeam.name}
                  </div>
                  <div style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', color: '#6b7280' }}>Away</div>
                </div>
              </div>

              {/* Venue */}
              {match.venue && (
                <div style={{ 
                  marginTop: '1rem', 
                  paddingTop: '0.75rem', 
                  borderTop: '1px solid #e5e7eb',
                  color: '#6b7280',
                  fontSize: isMobile ? '0.65rem' : '0.75rem',
                  textAlign: 'center'
                }}>
                  🏟️ {match.venue}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fixtures;