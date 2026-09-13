import React, { useState, useEffect } from 'react';
import { teamAPI } from '../services/api';

interface Team {
  id: number;
  name: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

const Standings = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      const sorted = response.data.sort((a: Team, b: Team) => {
        if (b.points !== a.points) return b.points - a.points;
        const bGD = b.goalsFor - b.goalsAgainst;
        const aGD = a.goalsFor - a.goalsAgainst;
        if (bGD !== aGD) return bGD - aGD;
        return b.goalsFor - a.goalsFor;
      });
      setTeams(sorted);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6b7280', fontSize: isMobile ? '1rem' : '1.25rem' }}>Loading standings...</div>
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
          League Standings
        </h1>
        <p style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', margin: '0 0 1rem 0' }}>
          Current tournament standings — auto updated after each match
        </p>
        <nav>
          <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>← Back to Home</a>
        </nav>
      </header>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '500px' : '600px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1f2937', color: 'white' }}>
              <th style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', fontSize: isMobile ? '0.65rem' : '0.75rem', width: '2rem' }}>#</th>
              <th style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'left', fontSize: isMobile ? '0.65rem' : '0.75rem' }}>Team</th>
              <th style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', fontSize: isMobile ? '0.65rem' : '0.75rem' }}>P</th>
              <th style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', fontSize: isMobile ? '0.65rem' : '0.75rem' }}>W</th>
              <th style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', fontSize: isMobile ? '0.65rem' : '0.75rem' }}>D</th>
              <th style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', fontSize: isMobile ? '0.65rem' : '0.75rem' }}>L</th>
              <th style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', fontSize: isMobile ? '0.65rem' : '0.75rem' }}>GF</th>
              <th style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', fontSize: isMobile ? '0.65rem' : '0.75rem' }}>GA</th>
              <th style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', fontSize: isMobile ? '0.65rem' : '0.75rem' }}>GD</th>
              <th style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', fontSize: isMobile ? '0.65rem' : '0.75rem' }}>PTS</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  No teams available
                </td>
              </tr>
            ) : (
              teams.map((team, index) => {
                const gd = team.goalsFor - team.goalsAgainst;
                let rowBg = 'white';
                if (index === 0) rowBg = '#fef3c7';
                else if (index < 3) rowBg = '#f0fdf4';

                return (
                  <tr key={team.id} style={{
                    backgroundColor: rowBg,
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center' }}>
                      <div style={{
                        width: isMobile ? '1.25rem' : '1.5rem',
                        height: isMobile ? '1.25rem' : '1.5rem',
                        backgroundColor: index === 0 ? '#f59e0b' : index < 3 ? '#16a34a' : '#6b7280',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMobile ? '0.6rem' : '0.75rem',
                        fontWeight: 'bold',
                        margin: '0 auto'
                      }}>
                        {index + 1}
                      </div>
                    </td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', fontWeight: 'bold', color: '#1f2937', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                      {team.name}
                    </td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{team.played}</td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', color: '#16a34a', fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{team.won}</td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', color: '#d97706', fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{team.drawn}</td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', color: '#dc2626', fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{team.lost}</td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', color: '#1f2937', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{team.goalsFor}</td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', color: '#1f2937', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{team.goalsAgainst}</td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', color: gd >= 0 ? '#16a34a' : '#dc2626', fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                      {gd >= 0 ? '+' : ''}{gd}
                    </td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center' }}>
                      <span style={{
                        backgroundColor: '#1f2937',
                        color: 'white',
                        padding: isMobile ? '0.2rem 0.4rem' : '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontWeight: 'bold',
                        fontSize: isMobile ? '0.65rem' : '0.875rem'
                      }}>
                        {team.points}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '1rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        fontSize: isMobile ? '0.65rem' : '0.75rem',
        color: '#6b7280'
      }}>
        <span>🟡 1st Place</span>
        <span>🟢 Top 3</span>
        <span>⚫ Others</span>
      </div>
    </div>
  );
};

export default Standings;