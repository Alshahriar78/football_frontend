import React, { useState, useEffect } from 'react';
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

interface TopScorer {
  team: Team;
  goals: number;
  matches: number;
  avgGoals: number;
}

interface BestDefense {
  team: Team;
  goalsConceded: number;
  cleanSheets: number;
  matches: number;
}

interface RecentForm {
  team: Team;
  recentResults: string[];
  recentPoints: number;
  formScore: number;
}

const Statistics = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [bestDefense, setBestDefense] = useState<BestDefense[]>([]);
  const [recentForm, setRecentForm] = useState<RecentForm[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1024;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsResponse, matchesResponse] = await Promise.all([
          teamAPI.getAll(),
          matchAPI.getAll()
        ]);
        setTeams(teamsResponse.data);
        setMatches(matchesResponse.data);
        calculateStatistics(teamsResponse.data, matchesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateStatistics = (teams: Team[], matches: Match[]) => {
    const completedMatches = matches.filter(m => m.status === 'completed' && m.homeScore !== null && m.awayScore !== null);
    const scorers: { [key: number]: { goals: number; matches: number } } = {};
    const defense: { [key: number]: { conceded: number; cleanSheets: number; matches: number } } = {};
    const form: { [key: number]: { results: string[]; points: number } } = {};

    teams.forEach(team => {
      scorers[team.id] = { goals: 0, matches: 0 };
      defense[team.id] = { conceded: 0, cleanSheets: 0, matches: 0 };
      form[team.id] = { results: [], points: 0 };
    });

    completedMatches.forEach(match => {
      const homeTeamId = match.homeTeam.id;
      const awayTeamId = match.awayTeam.id;
      const homeScore = match.homeScore!;
      const awayScore = match.awayScore!;

      if (scorers[homeTeamId] && scorers[awayTeamId]) {
        scorers[homeTeamId].goals += homeScore;
        scorers[homeTeamId].matches++;
        scorers[awayTeamId].goals += awayScore;
        scorers[awayTeamId].matches++;
        defense[homeTeamId].conceded += awayScore;
        defense[homeTeamId].matches++;
        defense[awayTeamId].conceded += homeScore;
        defense[awayTeamId].matches++;
        if (awayScore === 0) defense[homeTeamId].cleanSheets++;
        if (homeScore === 0) defense[awayTeamId].cleanSheets++;
      }
    });

    teams.forEach(team => {
      const teamMatches = completedMatches
        .filter(m => m.homeTeam.id === team.id || m.awayTeam.id === team.id)
        .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
        .slice(0, 5);

      teamMatches.forEach(match => {
        const isHome = match.homeTeam.id === team.id;
        const teamScore = isHome ? match.homeScore! : match.awayScore!;
        const opponentScore = isHome ? match.awayScore! : match.homeScore!;
        let result = '';
        let points = 0;
        if (teamScore > opponentScore) { result = 'W'; points = 3; }
        else if (teamScore < opponentScore) { result = 'L'; points = 0; }
        else { result = 'D'; points = 1; }
        form[team.id].results.push(result);
        form[team.id].points += points;
      });
    });

    setTopScorers(
      teams.filter(t => scorers[t.id].matches > 0)
        .map(t => ({ team: t, goals: scorers[t.id].goals, matches: scorers[t.id].matches, avgGoals: scorers[t.id].goals / scorers[t.id].matches }))
        .sort((a, b) => b.goals - a.goals).slice(0, 10)
    );

    setBestDefense(
      teams.filter(t => defense[t.id].matches > 0)
        .map(t => ({ team: t, goalsConceded: defense[t.id].conceded, cleanSheets: defense[t.id].cleanSheets, matches: defense[t.id].matches }))
        .sort((a, b) => a.goalsConceded - b.goalsConceded).slice(0, 10)
    );

    setRecentForm(
      teams.filter(t => form[t.id].results.length > 0)
        .map(t => ({ team: t, recentResults: form[t.id].results, recentPoints: form[t.id].points, formScore: form[t.id].points / form[t.id].results.length }))
        .sort((a, b) => b.formScore - a.formScore).slice(0, 10)
    );
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6b7280', fontSize: isMobile ? '1rem' : '1.25rem' }}>Loading statistics...</div>
      </div>
    );
  }

  const StatCard = ({ title, items, color, borderColor, bgColor, valueColor }: any) => (
    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: isMobile ? '1rem' : '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>No data available yet</p>
        ) : (
          items.map((item: any, index: number) => (
            <div key={item.team.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: isMobile ? '0.5rem' : '0.75rem',
              backgroundColor: index < 3 ? bgColor : '#f9fafb',
              borderRadius: '0.5rem',
              border: `1px solid ${index < 3 ? borderColor : '#e5e7eb'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <div style={{
                  width: isMobile ? '1.25rem' : '1.5rem',
                  height: isMobile ? '1.25rem' : '1.5rem',
                  backgroundColor: index < 3 ? color : '#6b7280',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: isMobile ? '0.75rem' : '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.team.name}
                  </div>
                  <div style={{ fontSize: isMobile ? '0.6rem' : '0.75rem', color: '#6b7280' }}>
                    {item.subtitle}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                {item.badges && item.badges}
                <div style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'bold', color: valueColor }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const topScorerItems = topScorers.map(s => ({
    team: s.team,
    subtitle: `${s.matches} matches • Avg: ${s.avgGoals.toFixed(1)}/game`,
    value: s.goals,
    badges: null
  }));

  const bestDefenseItems = bestDefense.map(d => ({
    team: d.team,
    subtitle: `${d.cleanSheets} clean sheets in ${d.matches} matches`,
    value: d.goalsConceded,
    badges: null
  }));

  const recentFormItems = recentForm.map(f => ({
    team: f.team,
    subtitle: '',
    value: f.recentPoints,
    badges: (
      <div style={{ display: 'flex', gap: '0.2rem' }}>
        {f.recentResults.map((result, i) => (
          <span key={i} style={{
            width: isMobile ? '0.875rem' : '1rem',
            height: isMobile ? '0.875rem' : '1rem',
            backgroundColor: result === 'W' ? '#16a34a' : result === 'D' ? '#d97706' : '#dc2626',
            color: 'white',
            borderRadius: '0.125rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.5rem',
            fontWeight: 'bold'
          }}>
            {result}
          </span>
        ))}
      </div>
    )
  }));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: isMobile ? '1rem' : '2rem' }}>
      <header style={{ marginBottom: isMobile ? '1rem' : '2rem' }}>
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
          Tournament Statistics
        </h1>
        <p style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', margin: '0 0 1rem 0' }}>
          Performance analysis from completed matches
        </p>
        <nav>
          <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>← Back to Home</a>
        </nav>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : 'repeat(3, 1fr)',
        gap: isMobile ? '1rem' : '1.5rem'
      }}>
        <StatCard
          title="⚽ Top Scoring Teams"
          items={topScorerItems}
          color="#f59e0b"
          borderColor="#fbbf24"
          bgColor="#fef3c7"
          valueColor="#059669"
        />
        <StatCard
          title="🛡️ Best Defense"
          items={bestDefenseItems}
          color="#3b82f6"
          borderColor="#3b82f6"
          bgColor="#dbeafe"
          valueColor="#3b82f6"
        />
        <StatCard
          title="📈 Recent Form (Last 5)"
          items={recentFormItems}
          color="#16a34a"
          borderColor="#16a34a"
          bgColor="#dcfce7"
          valueColor="#16a34a"
        />
      </div>
    </div>
  );
};

export default Statistics;