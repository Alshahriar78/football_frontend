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

      const scheduled = response.data
        .filter((m: Match) => m.status === 'scheduled')
        .sort((a: Match, b: Match) => {
          if (a.round !== b.round) {
            return a.round - b.round;
          }

          return (
            new Date(a.matchDate).getTime() -
            new Date(b.matchDate).getTime()
          );
        });

      setMatches(scheduled);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedMatches = matches.reduce(
    (groups: Record<number, Match[]>, match) => {
      if (!groups[match.round]) {
        groups[match.round] = [];
      }

      groups[match.round].push(match);
      return groups;
    },
    {}
  );

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: '#6b7280',
            fontSize: isMobile ? '1rem' : '1.25rem',
          }}
        >
          Loading fixtures...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: isMobile ? '1rem' : '2rem',
      }}
    >
      <header style={{ marginBottom: isMobile ? '1rem' : '2rem' }}>
        <h1
          style={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 0.5rem 0',
          }}
        >
          Upcoming Fixtures
        </h1>

        <p
          style={{
            color: '#6b7280',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            margin: '0 0 1rem 0',
          }}
        >
          Scheduled matches for the tournament
        </p>

        <a
          href="/"
          style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
          }}
        >
          ← Back to Home
        </a>
      </header>

      {matches.length === 0 ? (
        <div
          style={{
            backgroundColor: 'white',
            padding: isMobile ? '2rem 1rem' : '3rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
            color: '#6b7280',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          No upcoming fixtures scheduled
        </div>
      ) : (
        Object.keys(groupedMatches)
          .sort((a, b) => Number(a) - Number(b))
          .map((round) => (
            <div key={round} style={{ marginBottom: '2rem' }}>
              {/* Round Header */}
              <div
                style={{
                  backgroundColor: '#1e40af',
                  color: 'white',
                  padding: isMobile ? '0.75rem' : '1rem',
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  fontSize: isMobile ? '1rem' : '1.2rem',
                }}
              >
                ⚽ Round {round}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {groupedMatches[Number(round)].map((match) => (
                  <div
                    key={match.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      padding: isMobile ? '1rem' : '1.5rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* Date */}
                    <div
                      style={{
                        textAlign: 'center',
                        marginBottom: '1rem',
                        color: '#6b7280',
                        fontSize: isMobile ? '0.7rem' : '0.85rem',
                      }}
                    >
                      📅{' '}
                      {new Date(match.matchDate).toLocaleDateString(
                        'en-GB',
                        {
                          weekday: isMobile ? 'short' : 'long',
                          day: 'numeric',
                          month: isMobile ? 'short' : 'long',
                          year: 'numeric',
                        }
                      )}
                    </div>

                    {/* Match */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontWeight: 'bold',
                            color: '#111827',
                          }}
                        >
                          {match.homeTeam.name}
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: '#f3f4f6',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.5rem',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 'bold',
                            fontSize: '1rem',
                          }}
                        >
                          VS
                        </div>

                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: '#6b7280',
                          }}
                        >
                          {new Date(
                            match.matchDate
                          ).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>

                      <div style={{ textAlign: 'left' }}>
                        <div
                          style={{
                            fontWeight: 'bold',
                            color: '#111827',
                          }}
                        >
                          {match.awayTeam.name}
                        </div>
                      </div>
                    </div>

                    {match.venue && (
                      <div
                        style={{
                          marginTop: '1rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid #e5e7eb',
                          textAlign: 'center',
                          color: '#6b7280',
                          fontSize: '0.75rem',
                        }}
                      >
                        🏟️ {match.venue}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default Fixtures;