import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamAPI } from '../services/api';

interface Team {
  id: number;
  name: string;
  logo: string;
  founded: number;
  stadium: string;
  city: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1024;

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ color: '#6b7280', fontSize: isMobile ? '1rem' : '1.25rem' }}>Loading teams...</div>
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
          marginBottom: '0.5rem',
          margin: '0 0 0.5rem 0'
        }}>
          eFootball Players / Teams
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: isMobile ? '0.75rem' : '0.875rem', 
          marginBottom: '1rem',
          margin: '0 0 1rem 0'
        }}>
          Browse all registered players/teams in the tournament
        </p>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>← Back to Home</a>
        </nav>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: isMobile ? '1rem' : '1.5rem'
      }}>
        {teams.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
            No teams added yet
          </div>
        ) : (
          teams.map((team) => (
            <div 
              key={team.id}
              onClick={() => navigate(`/team/${team.id}`)}
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '0.5rem', 
                padding: isMobile ? '1rem' : '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }
              }}
            >
              {/* Logo */}
              {team.logo && (
                <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                  <img 
                    src={team.logo} 
                    alt={team.name}
                    style={{ 
                      width: '100%', 
                      height: isMobile ? '150px' : '200px', 
                      objectFit: 'cover', 
                      borderRadius: '0.5rem' 
                    }}
                  />
                </div>
              )}

              {/* Team Name */}
              <h3 style={{ 
                fontSize: isMobile ? '1rem' : '1.125rem', 
                fontWeight: 'bold', 
                color: '#1f2937', 
                marginBottom: '0.5rem', 
                margin: '0 0 0.5rem 0' 
              }}>
                {team.name}
              </h3>

              {/* Team Info */}
              <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                <p style={{ margin: '0.25rem 0' }}>📍 {team.city}</p>
                <p style={{ margin: '0.25rem 0' }}>🏟️ {team.stadium}</p>
                <p style={{ margin: '0.25rem 0' }}>🏆 Founded: {team.founded}</p>
              </div>

              {/* Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: isMobile ? '0.5rem' : '0.5rem',
                marginBottom: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{ backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>P</div>
                  <div style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{team.played}</div>
                </div>
                <div style={{ backgroundColor: '#dcfce7', padding: '0.5rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#166534' }}>W</div>
                  <div style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', color: '#16a34a' }}>{team.won}</div>
                </div>
                <div style={{ backgroundColor: '#fef3c7', padding: '0.5rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#a16207' }}>D</div>
                  <div style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', color: '#d97706' }}>{team.drawn}</div>
                </div>
                <div style={{ backgroundColor: '#fee2e2', padding: '0.5rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#991b1b' }}>L</div>
                  <div style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', color: '#dc2626' }}>{team.lost}</div>
                </div>
                <div style={{ backgroundColor: '#dbeafe', padding: '0.5rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#1e40af' }}>GF</div>
                  <div style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>{team.goalsFor}</div>
                </div>
                <div style={{ backgroundColor: '#f3e8ff', padding: '0.5rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#6b21a8' }}>GA</div>
                  <div style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', color: '#a855f7' }}>{team.goalsAgainst}</div>
                </div>
              </div>

              {/* Points */}
              <div style={{ 
                backgroundColor: '#fef2f2', 
                padding: isMobile ? '0.5rem' : '0.75rem', 
                borderRadius: '0.5rem',
                textAlign: 'center',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '0.65rem', color: '#7c2d12', marginBottom: '0.25rem' }}>POINTS</div>
                <div style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 'bold', color: '#ea580c' }}>{team.points}</div>
              </div>

              {/* Click to View */}
              <div style={{ 
                marginTop: '1rem',
                padding: isMobile ? '0.5rem' : '0.75rem',
                backgroundColor: '#eff6ff',
                borderRadius: '0.5rem',
                textAlign: 'center',
                color: '#1e40af',
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                fontWeight: '500'
              }}>
                Click to view full profile →
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Teams;