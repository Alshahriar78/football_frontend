import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamAPI, matchAPI } from '../services/api';

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

interface HeadToHead {
  opponentId: number;
  opponentName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

const TeamProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [headToHeads, setHeadToHeads] = useState<HeadToHead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) { setError('Team ID not found'); setLoading(false); return; }
        const teamResponse = await teamAPI.getById(parseInt(id));
        setTeam(teamResponse.data);
        const matchesResponse = await matchAPI.getAll();
        const allMatches = matchesResponse.data;
        const teamMatches = allMatches
          .filter((m: Match) => (m.homeTeam.id === parseInt(id) || m.awayTeam.id === parseInt(id)) && m.status === 'completed')
          .sort((a: Match, b: Match) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());
        setMatches(teamMatches);

        const h2hMap: { [key: number]: HeadToHead } = {};
        teamMatches.forEach((match: Match) => {
          const isHome = match.homeTeam.id === parseInt(id);
          const opponent = isHome ? match.awayTeam : match.homeTeam;
          const teamScore = isHome ? match.homeScore! : match.awayScore!;
          const opponentScore = isHome ? match.awayScore! : match.homeScore!;
          if (!h2hMap[opponent.id]) {
            h2hMap[opponent.id] = { opponentId: opponent.id, opponentName: opponent.name, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 };
          }
          h2hMap[opponent.id].played++;
          h2hMap[opponent.id].goalsFor += teamScore;
          h2hMap[opponent.id].goalsAgainst += opponentScore;
          if (teamScore > opponentScore) h2hMap[opponent.id].won++;
          else if (teamScore < opponentScore) h2hMap[opponent.id].lost++;
          else h2hMap[opponent.id].drawn++;
        });
        setHeadToHeads(Object.values(h2hMap).sort((a, b) => b.played - a.played));
      } catch (error) {
        setError('Failed to load team data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6b7280' }}>Loading team profile...</div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: isMobile ? '1rem' : '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>← Back</button>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', textAlign: 'center', color: '#dc2626' }}>{error || 'Team not found'}</div>
      </div>
    );
  }

  const goalDifference = team.goalsFor - team.goalsAgainst;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: isMobile ? '1rem' : '2rem' }}>
      {/* Back Button */}
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
        ← Back
      </button>

      {/* Team Header */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: isMobile ? '1rem' : '2rem', marginBottom: isMobile ? '1rem' : '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', gap: isMobile ? '1rem' : '2rem', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
          {team.logo && (
            <img src={team.logo} alt={team.name} style={{ width: isMobile ? '80px' : '120px', height: isMobile ? '80px' : '120px', objectFit: 'cover', borderRadius: '0.5rem' }} />
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '2rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.5rem 0' }}>{team.name}</h1>
            <p style={{ color: '#6b7280', margin: '0.25rem 0', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>📍 {team.city}</p>
            <p style={{ color: '#6b7280', margin: '0.25rem 0', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>🏟️ {team.stadium}</p>
            <p style={{ color: '#6b7280', margin: '0.25rem 0', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>🏆 Founded: {team.founded}</p>
          </div>
        </div>
      </div>

      {/* Season Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(8, 1fr)',
        gap: isMobile ? '0.5rem' : '1rem',
        marginBottom: isMobile ? '1rem' : '2rem'
      }}>
        {[
          { label: 'PLAYED', value: team.played, bg: 'white', labelColor: '#6b7280', valueColor: '#1f2937' },
          { label: 'WINS', value: team.won, bg: '#dcfce7', labelColor: '#166534', valueColor: '#16a34a' },
          { label: 'DRAWS', value: team.drawn, bg: '#fef3c7', labelColor: '#a16207', valueColor: '#d97706' },
          { label: 'LOSSES', value: team.lost, bg: '#fee2e2', labelColor: '#991b1b', valueColor: '#dc2626' },
          { label: 'GF', value: team.goalsFor, bg: '#dbeafe', labelColor: '#1e40af', valueColor: '#3b82f6' },
          { label: 'GA', value: team.goalsAgainst, bg: '#f3e8ff', labelColor: '#6b21a8', valueColor: '#a855f7' },
          { label: 'GD', value: `${goalDifference >= 0 ? '+' : ''}${goalDifference}`, bg: '#f0fdf4', labelColor: '#166534', valueColor: goalDifference >= 0 ? '#16a34a' : '#dc2626' },
          { label: 'PTS', value: team.points, bg: '#fef2f2', labelColor: '#7c2d12', valueColor: '#ea580c' },
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: stat.bg, padding: isMobile ? '0.5rem 0.25rem' : '1.5rem', borderRadius: '0.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: isMobile ? '0.5rem' : '0.75rem', color: stat.labelColor, marginBottom: '0.25rem' }}>{stat.label}</div>
            <div style={{ fontSize: isMobile ? '1rem' : '2rem', fontWeight: 'bold', color: stat.valueColor }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Match History */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: isMobile ? '1rem' : '1.5rem', marginBottom: isMobile ? '1rem' : '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 1rem 0' }}>📋 Match History</h2>
        {matches.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No completed matches yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {matches.map((match) => {
              const isHome = match.homeTeam.id === team.id;
              const teamScore = isHome ? match.homeScore : match.awayScore;
              const opponentScore = isHome ? match.awayScore : match.homeScore;
              const opponent = isHome ? match.awayTeam : match.homeTeam;
              let result = 'D', resultColor = '#d97706';
              if (teamScore! > opponentScore!) { result = 'W'; resultColor = '#16a34a'; }
              else if (teamScore! < opponentScore!) { result = 'L'; resultColor = '#dc2626'; }

              return (
                <div key={match.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: isMobile ? '0.75rem' : '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1rem', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: isMobile ? '1.5rem' : '2rem',
                      height: isMobile ? '1.5rem' : '2rem',
                      backgroundColor: resultColor,
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: isMobile ? '0.65rem' : '0.875rem',
                      flexShrink: 0
                    }}>
                      {result}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: '#1f2937', fontWeight: '500', fontSize: isMobile ? '0.75rem' : '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        vs {opponent.name}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: isMobile ? '0.6rem' : '0.75rem' }}>
                        {new Date(match.matchDate).toLocaleDateString()} • Round {match.round}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    backgroundColor: '#f3f4f6',
                    padding: isMobile ? '0.25rem 0.5rem' : '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: isMobile ? '0.875rem' : '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{teamScore}</span>
                    <span style={{ color: '#9ca3af', fontSize: isMobile ? '0.75rem' : '1rem' }}>-</span>
                    <span style={{ fontSize: isMobile ? '0.875rem' : '1.25rem', fontWeight: 'bold', color: '#6b7280' }}>{opponentScore}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Head-to-Head */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: isMobile ? '1rem' : '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 1rem 0' }}>🎯 Head-to-Head Records</h2>
        {headToHeads.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No head-to-head records yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '400px' : '500px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  {['Opponent', 'P', 'W', 'D', 'L', 'GF:GA', 'GD'].map((h) => (
                    <th key={h} style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: h === 'Opponent' ? 'left' : 'center', color: '#6b7280', fontWeight: 'bold', fontSize: isMobile ? '0.65rem' : '0.875rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {headToHeads.map((h2h) => (
                  <tr key={h2h.opponentId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', color: '#1f2937', fontWeight: '500', fontSize: isMobile ? '0.7rem' : '0.875rem' }}>{h2h.opponentName}</td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', color: '#6b7280', fontSize: isMobile ? '0.7rem' : '0.875rem' }}>{h2h.played}</td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', color: '#16a34a', fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : '0.875rem' }}>{h2h.won}</td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', color: '#d97706', fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : '0.875rem' }}>{h2h.drawn}</td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', color: '#dc2626', fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : '0.875rem' }}>{h2h.lost}</td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', color: '#1f2937', fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : '0.875rem' }}>{h2h.goalsFor}:{h2h.goalsAgainst}</td>
                    <td style={{ padding: isMobile ? '0.5rem 0.25rem' : '0.75rem', textAlign: 'center', color: h2h.goalsFor - h2h.goalsAgainst >= 0 ? '#16a34a' : '#dc2626', fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : '0.875rem' }}>
                      {h2h.goalsFor - h2h.goalsAgainst >= 0 ? '+' : ''}{h2h.goalsFor - h2h.goalsAgainst}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamProfile;