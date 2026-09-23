import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  tournamentAPI,
  type Tournament,
} from '../../services/tournamentService';

import {
  teamAPI,
  type Team,
} from '../../services/teamService';

import {
  matchAPI,
  type Match,
} from '../../services/matchService';

const Dashboard = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const [tournamentData, teamData, matchData] =
          await Promise.all([
            tournamentAPI.getAll(),
            teamAPI.getAll(),
            matchAPI.getAll(),
          ]);

        setTournaments(tournamentData);
        setTeams(teamData);
        setMatches(matchData);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* --------------------------------
     Match Statistics
  -------------------------------- */

  const completedMatches = useMemo(() => {
    return matches.filter(
      (match) => match.status === 'completed',
    );
  }, [matches]);

  const upcomingMatches = useMemo(() => {
    return matches.filter(
      (match) => match.status === 'scheduled',
    );
  }, [matches]);

  /* --------------------------------
     Current Tournament
  -------------------------------- */

  const currentTournament = useMemo(() => {
    if (tournaments.length === 0) {
      return null;
    }

    const upcoming = tournaments
      .filter((tournament) => tournament.status === 'upcoming')
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() -
          new Date(b.startDate).getTime(),
      );

    if (upcoming.length > 0) {
      return upcoming[0];
    }

    return tournaments[0];
  }, [tournaments]);

  /* --------------------------------
     Recent Matches
  -------------------------------- */

  const recentMatches = useMemo(() => {
    return [...matches]
      .sort(
        (a, b) =>
          new Date(b.matchDate).getTime() -
          new Date(a.matchDate).getTime(),
      )
      .slice(0, 5);
  }, [matches]);

  /* --------------------------------
     Date Formatting
  -------------------------------- */

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-BD', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-BD', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /* --------------------------------
     Loading State
  -------------------------------- */

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="text-lg font-semibold text-slate-700">
            Loading dashboard...
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Fetching tournament data.
          </p>
        </div>
      </section>
    );
  }

  /* --------------------------------
     Error State
  -------------------------------- */

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="text-4xl">⚠️</div>

          <h2 className="mt-3 text-lg font-bold text-red-800">
            Dashboard Error
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  /* --------------------------------
     Dashboard Stats
  -------------------------------- */

  const stats = [
    {
      label: 'Tournaments',
      value: tournaments.length,
      icon: '🏆',
      description: 'Total tournaments',
    },
    {
      label: 'Teams',
      value: teams.length,
      icon: '👥',
      description: 'Registered teams',
    },
    {
      label: 'Matches',
      value: matches.length,
      icon: '⚽',
      description: 'Total matches',
    },
    {
      label: 'Completed',
      value: completedMatches.length,
      icon: '✅',
      description: 'Completed matches',
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

      {/* --------------------------------
          Header
      -------------------------------- */}

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Overview
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your eFootball tournament from one place.
        </p>
      </div>

      {/* --------------------------------
          Statistics
      -------------------------------- */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                {stat.icon}
              </div>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* --------------------------------
          Additional Match Overview
      -------------------------------- */}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Upcoming Matches
              </p>

              <p className="mt-2 text-3xl font-black text-slate-900">
                {upcomingMatches.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
              📅
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Scheduled matches waiting to be played.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Registered Teams
              </p>

              <p className="mt-2 text-3xl font-black text-slate-900">
                {teams.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
              👥
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Teams currently registered in tournaments.
          </p>
        </div>

      </div>

      {/* --------------------------------
          Current Tournament
      -------------------------------- */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Current Tournament
          </p>

          {currentTournament ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {currentTournament.name}
              </h2>

              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                  currentTournament.status === 'upcoming'
                    ? 'bg-blue-100 text-blue-700'
                    : currentTournament.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-700'
                }`}
              >
                {currentTournament.status}
              </span>

            </div>
          ) : (
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              No Tournament Available
            </h2>
          )}

        </div>

        {currentTournament && (
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-3 sm:p-6">

            <div>
              <p className="text-xs text-slate-400">
                Start Date
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {formatDate(currentTournament.startDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                End Date
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {formatDate(currentTournament.endDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Registered Teams
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {
                  teams.filter(
                    (team) =>
                      team.tournament?.id === currentTournament.id,
                  ).length
                }
              </p>
            </div>

          </div>
        )}

      </div>

      {/* --------------------------------
          Recent Matches
      -------------------------------- */}

      <div className="mt-8">

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Matches
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest scheduled and completed matches.
            </p>
          </div>

          <Link
            to="/admin/matches"
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
          >
            View All →
          </Link>

        </div>

        {recentMatches.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              No matches available yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">

            {recentMatches.map((match) => (
              <div
                key={match.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  {/* Teams */}
                  <div className="flex min-w-0 flex-1 items-center gap-3">

                    <div className="min-w-0 flex-1 text-right">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {match.homeTeam.teamName}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-900">
                      {match.status === 'completed'
                        ? `${match.homeScore} - ${match.awayScore}`
                        : 'VS'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {match.awayTeam.teamName}
                      </p>
                    </div>

                  </div>

                  {/* Match Info */}
                  <div className="flex items-center justify-between gap-4 sm:min-w-[230px] sm:justify-end">

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-medium text-slate-500">
                        Round {match.round}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(match.matchDate)} ·{' '}
                        {formatTime(match.matchDate)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        match.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {match.status}
                    </span>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>

      {/* --------------------------------
          Quick Actions
      -------------------------------- */}

      <div className="mt-8 pb-8">

        <h2 className="text-lg font-bold text-slate-900">
          Quick Actions
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <QuickAction
            to="/admin/tournaments"
            icon="🏆"
            title="Add Tournament"
            description="Create a new tournament."
          />

          <QuickAction
            to="/admin/teams"
            icon="👥"
            title="Add Team"
            description="Register a new team."
          />

          <QuickAction
            to="/admin/matches"
            icon="⚽"
            title="Schedule Match"
            description="Create a new fixture."
          />

          <QuickAction
            to="/admin/announcements"
            icon="📢"
            title="Announcement"
            description="Publish tournament news."
          />

        </div>
      </div>

    </section>
  );
};

/* --------------------------------
   Quick Action Component
-------------------------------- */

interface QuickActionProps {
  to: string;
  icon: string;
  title: string;
  description: string;
}

const QuickAction = ({
  to,
  icon,
  title,
  description,
}: QuickActionProps) => {
  return (
    <Link
      to={to}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="text-2xl">
        {icon}
      </span>

      <p className="mt-3 font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </Link>
  );
};

export default Dashboard;