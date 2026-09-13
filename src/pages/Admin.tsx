import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('teams');
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const isMobile = window.innerWidth < 768;

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      alert('Access denied! Please login first.');
      navigate('/login');
      return;
    }
    
    setAuthLoading(false);
  }, [navigate]);

  const [newTeam, setNewTeam] = useState({
    name: '',
    logo: '',
    founded: new Date().getFullYear(),
    stadium: '',
    city: ''
  });

  const [newMatch, setNewMatch] = useState({
    homeTeamId: '',
    awayTeamId: '',
    matchDate: '',
    venue: '',
    round: 1
  });

  const [scores, setScores] = useState<{ [key: number]: { home: string; away: string } }>({});

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await matchAPI.getAll();
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchTeams();
      fetchMatches();
    }
  }, [authLoading]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('isAdminAuthenticated');
      localStorage.removeItem('adminUsername');
      localStorage.removeItem('loginTime');
      alert('Logged out successfully!');
      navigate('/login');
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await teamAPI.create(newTeam);
      setNewTeam({ name: '', logo: '', founded: new Date().getFullYear(), stadium: '', city: '' });
      fetchTeams();
      alert('Team/Player created successfully!');
    } catch (error) {
      alert('Error creating team/player');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await matchAPI.create({
        homeTeam: { id: parseInt(newMatch.homeTeamId) },
        awayTeam: { id: parseInt(newMatch.awayTeamId) },
        matchDate: newMatch.matchDate,
        venue: newMatch.venue,
        round: newMatch.round,
        status: 'scheduled'
      });
      setNewMatch({ homeTeamId: '', awayTeamId: '', matchDate: '', venue: '', round: 1 });
      fetchMatches();
      alert('Match created successfully!');
    } catch (error) {
      alert('Error creating match');
    } finally {
      setLoading(false);
    }
  };

  const updateMatchResult = async (matchId: number) => {
    const score = scores[matchId];
    if (!score) return;
    const homeScore = parseInt(score.home) || 0;
    const awayScore = parseInt(score.away) || 0;
    try {
      await matchAPI.update(matchId, { homeScore, awayScore, status: 'completed' });
      setScores(prev => { const s = { ...prev }; delete s[matchId]; return s; });
      fetchMatches();
      alert('Result updated successfully!');
    } catch (error) {
      alert('Error updating result');
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
    if (confirm('Are you sure you want to delete this team/player?')) {
      try {
        await teamAPI.delete(teamId);
        fetchTeams();
        alert('Team/Player deleted successfully!');
      } catch (error) {
        alert('Error deleting team/player');
      }
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔐</div>
          <div style={{ color: '#6b7280', fontSize: isMobile ? '1rem' : '1.25rem' }}>Checking authentication...</div>
        </div>
      </div>
    );
  }

  const adminUsername = localStorage.getItem('adminUsername') || 'Admin';
  const loginTime = localStorage.getItem('loginTime');

  const inputStyle = {
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    width: '100%',
    fontSize: isMobile ? '0.875rem' : '1rem',
    boxSizing: 'border-box' as const
  };

  const tabLabels: { [key: string]: string } = {
    teams: '👥 Teams',
    matches: '📅 Matches',
    results: '⚽ Results'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: isMobile ? '1rem' : '2rem' }}>
      {/* Header with Auth Info */}
      <header style={{ marginBottom: isMobile ? '1rem' : '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '1.25rem' : '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 0.5rem 0'
            }}>
              🎮 eFootball Admin Panel
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              margin: 0
            }}>
              Manage teams, schedule matches and enter results
            </p>
          </div>

          {/* Auth Status & Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #16a34a',
              borderRadius: '0.5rem',
              padding: '0.5rem 0.75rem',
              fontSize: isMobile ? '0.7rem' : '0.75rem',
              color: '#166534'
            }}>
              ✅ Logged in as: <strong>{adminUsername}</strong>
              {loginTime && (
                <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>
                  Since: {new Date(loginTime).toLocaleTimeString()}
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.75rem' : '0.875rem'
              }}
            >
              🔓 Logout
            </button>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
            ← Back to Home
          </a>
          <span style={{ color: '#e5e7eb' }}>|</span>
          <a href="/login" style={{ color: '#6b7280', textDecoration: 'none', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
            🔐 Login Page
          </a>
        </nav>
      </header>

      {/* Tab Navigation */}
      <div style={{
        backgroundColor: 'white',
        padding: isMobile ? '0.75rem' : '1rem',
        borderRadius: '0.5rem',
        marginBottom: isMobile ? '1rem' : '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          gap: isMobile ? '0.5rem' : '1rem',
          flexWrap: 'nowrap',
          overflowX: 'auto'
        }}>
          {['teams', 'matches', 'results'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: isMobile ? '0.5rem 0.75rem' : '0.5rem 1.5rem',
                backgroundColor: activeTab === tab ? '#3b82f6' : '#f3f4f6',
                color: activeTab === tab ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* ===== TEAMS TAB ===== */}
      {activeTab === 'teams' && (
        <div>
          <h2 style={{ fontSize: isMobile ? '1.125rem' : '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#1f2937' }}>
            Teams / Players Management
          </h2>

          {/* Add Team Form */}
          <div style={{
            backgroundColor: 'white',
            padding: isMobile ? '1rem' : '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: isMobile ? '1rem' : '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#1f2937' }}>
              ➕ Add New Team / Player
            </h3>
            <form onSubmit={handleCreateTeam}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '0.75rem',
                marginBottom: '0.75rem'
              }}>
                <input
                  type="text"
                  placeholder="Team/Player Name *"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  required
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Favorite Club (e.g. Barcelona)"
                  value={newTeam.stadium}
                  onChange={(e) => setNewTeam({ ...newTeam, stadium: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="City/Location"
                  value={newTeam.city}
                  onChange={(e) => setNewTeam({ ...newTeam, city: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder="Gaming Since Year"
                  value={newTeam.founded}
                  onChange={(e) => setNewTeam({ ...newTeam, founded: parseInt(e.target.value) })}
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: isMobile ? '0.625rem 1rem' : '0.75rem 2rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                {loading ? 'Adding...' : '✅ Add Team/Player'}
              </button>
            </form>
          </div>

          {/* Teams List */}
          <div style={{
            backgroundColor: 'white',
            padding: isMobile ? '1rem' : '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#1f2937' }}>
              Registered Teams/Players ({teams.length})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0.75rem'
            }}>
              {teams.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No teams added yet</p>
              ) : (
                teams.map((team) => (
                  <div key={team.id} style={{
                    padding: isMobile ? '0.75rem' : '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
                        <div style={{
                          width: isMobile ? '2rem' : '2.5rem',
                          height: isMobile ? '2rem' : '2.5rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: isMobile ? '0.875rem' : '1rem',
                          flexShrink: 0
                        }}>
                          🎮
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <h4 style={{ fontWeight: 'bold', color: '#1f2937', margin: 0, fontSize: isMobile ? '0.875rem' : '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {team.name}
                          </h4>
                          <p style={{ fontSize: isMobile ? '0.75rem' : '0.875rem', color: '#3b82f6', margin: 0 }}>{team.stadium}</p>
                        </div>
                      </div>
                      <div style={{ fontSize: isMobile ? '0.7rem' : '0.875rem', color: '#6b7280' }}>
                        <p style={{ margin: '0.2rem 0' }}>📍 {team.city}</p>
                        <p style={{ margin: '0.2rem 0' }}>🎮 Since: {team.founded}</p>
                        <p style={{ margin: '0.2rem 0' }}>
                          <strong>{team.played}P</strong> · {team.won}W · {team.drawn}D · {team.lost}L · <strong>{team.points}pts</strong>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      style={{
                        padding: isMobile ? '0.25rem 0.5rem' : '0.375rem 0.75rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: isMobile ? '0.65rem' : '0.75rem',
                        flexShrink: 0,
                        fontWeight: 'bold'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== MATCHES TAB ===== */}
      {activeTab === 'matches' && (
        <div>
          <h2 style={{ fontSize: isMobile ? '1.125rem' : '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#1f2937' }}>
            Match Management
          </h2>

          {/* Schedule Match Form */}
          <div style={{
            backgroundColor: 'white',
            padding: isMobile ? '1rem' : '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: isMobile ? '1rem' : '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#1f2937' }}>
              📅 Schedule New Match
            </h3>
            <form onSubmit={handleCreateMatch}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '0.75rem',
                marginBottom: '0.75rem'
              }}>
                <select
                  value={newMatch.homeTeamId}
                  onChange={(e) => setNewMatch({ ...newMatch, homeTeamId: e.target.value })}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Player 1 (Home) *</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                <select
                  value={newMatch.awayTeamId}
                  onChange={(e) => setNewMatch({ ...newMatch, awayTeamId: e.target.value })}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Player 2 (Away) *</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                <input
                  type="datetime-local"
                  value={newMatch.matchDate}
                  onChange={(e) => setNewMatch({ ...newMatch, matchDate: e.target.value })}
                  required
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Platform (e.g. PS5, PC) *"
                  value={newMatch.venue}
                  onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                  required
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder="Round *"
                  value={newMatch.round}
                  onChange={(e) => setNewMatch({ ...newMatch, round: parseInt(e.target.value) })}
                  min="1"
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: isMobile ? '0.625rem 1rem' : '0.75rem 2rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                {loading ? 'Scheduling...' : '📅 Schedule Match'}
              </button>
            </form>
          </div>

          {/* All Matches List */}
          <div style={{
            backgroundColor: 'white',
            padding: isMobile ? '1rem' : '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#1f2937' }}>
              All Matches ({matches.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {matches.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No matches scheduled yet</p>
              ) : (
                matches.map((match) => (
                  <div key={match.id} style={{
                    padding: isMobile ? '0.75rem' : '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    backgroundColor: '#f9fafb'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: '0.5rem'
                    }}>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#1f2937', fontSize: isMobile ? '0.875rem' : '1rem' }}>
                          {match.homeTeam?.name} vs {match.awayTeam?.name}
                        </span>
                        <div style={{ fontSize: isMobile ? '0.7rem' : '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          Round {match.round} · {match.venue} · {new Date(match.matchDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '1rem',
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          backgroundColor: match.status === 'completed' ? '#dcfce7' : '#dbeafe',
                          color: match.status === 'completed' ? '#166534' : '#1e40af'
                        }}>
                          {match.status}
                        </span>
                        {match.status === 'completed' && (
                          <span style={{ fontWeight: 'bold', color: '#059669', fontSize: isMobile ? '0.875rem' : '1rem' }}>
                            {match.homeScore} - {match.awayScore}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== RESULTS TAB ===== */}
      {activeTab === 'results' && (
        <div>
          <h2 style={{ fontSize: isMobile ? '1.125rem' : '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#1f2937' }}>
            Enter Match Results
          </h2>

          <div style={{
            backgroundColor: 'white',
            padding: isMobile ? '1rem' : '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#1f2937' }}>
              Pending Matches ({matches.filter(m => m.status === 'scheduled').length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {matches.filter(m => m.status === 'scheduled').length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No pending matches</p>
              ) : (
                matches.filter(m => m.status === 'scheduled').map((match) => (
                  <div key={match.id} style={{
                    padding: isMobile ? '0.75rem' : '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    backgroundColor: '#f9fafb'
                  }}>
                    {/* Match Info */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      flexDirection: isMobile ? 'column' : 'row',
                      marginBottom: '0.75rem',
                      gap: '0.25rem'
                    }}>
                      <span style={{ fontWeight: 'bold', color: '#1f2937', fontSize: isMobile ? '0.875rem' : '1rem' }}>
                        {match.homeTeam?.name} vs {match.awayTeam?.name}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
                        Round {match.round} · {match.venue}
                      </span>
                    </div>

                    {/* Score Input */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr auto 1fr auto' : 'auto auto auto auto auto',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <input
                        type="number"
                        placeholder={isMobile ? match.homeTeam?.name?.split(' ')[0] : `${match.homeTeam?.name} Score`}
                        min="0"
                        value={scores[match.id]?.home || ''}
                        onChange={(e) => setScores(prev => ({
                          ...prev,
                          [match.id]: { ...prev[match.id], home: e.target.value }
                        }))}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          textAlign: 'center',
                          fontSize: isMobile ? '0.875rem' : '1rem',
                          width: '100%'
                        }}
                      />
                      <span style={{ textAlign: 'center', fontWeight: 'bold', color: '#6b7280' }}>—</span>
                      <input
                        type="number"
                        placeholder={isMobile ? match.awayTeam?.name?.split(' ')[0] : `${match.awayTeam?.name} Score`}
                        min="0"
                        value={scores[match.id]?.away || ''}
                        onChange={(e) => setScores(prev => ({
                          ...prev,
                          [match.id]: { ...prev[match.id], away: e.target.value }
                        }))}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          textAlign: 'center',
                          fontSize: isMobile ? '0.875rem' : '1rem',
                          width: '100%'
                        }}
                      />
                      <button
                        onClick={() => updateMatchResult(match.id)}
                        style={{
                          padding: isMobile ? '0.5rem' : '0.5rem 1rem',
                          backgroundColor: '#059669',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                          gridColumn: isMobile ? '1 / -1' : 'auto'
                        }}
                      >
                        ✅ Update Result
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;