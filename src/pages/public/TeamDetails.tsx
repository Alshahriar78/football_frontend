import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { teamAPI, type Team } from '../../services/teamService';
import { matchAPI, type Match } from '../../services/matchService';

const TeamDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [team, setTeam] = useState<Team | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTeamDetails = async () => {
      try {
        setLoading(true);
        setError('');

        if (!id) {
          throw new Error('Team ID not found');
        }

        const teamId = Number(id);

        if (Number.isNaN(teamId)) {
          throw new Error('Invalid team ID');
        }

        const [teamData, allMatches] = await Promise.all([
          teamAPI.getOne(teamId),
          matchAPI.getAll(),
        ]);

        setTeam(teamData);

        const teamMatches = allMatches.filter(
          (match) =>
            match.homeTeam.id === teamId ||
            match.awayTeam.id === teamId,
        );

        setMatches(teamMatches);
      } catch (err) {
        console.error(err);
        setError('Failed to load team details.');
      } finally {
        setLoading(false);
      }
    };

    loadTeamDetails();
  }, [id]);

  const statistics = useMemo(() => {
    let played = 0;
    let won = 0;
    let draw = 0;
    let lost = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    matches
      .filter((match) => match.status === 'completed')
      .forEach((match) => {
        const isHome = match.homeTeam.id === team?.id;

        const teamScore = isHome
          ? match.homeScore
          : match.awayScore;

        const opponentScore = isHome
          ? match.awayScore
          : match.homeScore;

        played++;

        goalsFor += teamScore;
        goalsAgainst += opponentScore;

        if (teamScore > opponentScore) {
          won++;
        } else if (teamScore === opponentScore) {
          draw++;
        } else {
          lost++;
        }
      });

    const goalDifference = goalsFor - goalsAgainst;
    const points = won * 3 + draw;

    return {
      played,
      won,
      draw,
      lost,
      goalsFor,
      goalsAgainst,
      goalDifference,
      points,
    };
  }, [matches, team]);

  const upcomingMatches = matches
    .filter((match) => match.status === 'scheduled')
    .sort(
      (a, b) =>
        new Date(a.matchDate).getTime() -
        new Date(b.matchDate).getTime(),
    );

  const completedMatches = matches
    .filter((match) => match.status === 'completed')
    .sort(
      (a, b) =>
        new Date(b.matchDate).getTime() -
        new Date(a.matchDate).getTime(),
    );

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

  const getOpponent = (match: Match) => {
    return match.homeTeam.id === team?.id
      ? match.awayTeam
      : match.homeTeam;
  };

  const getTeamScore = (match: Match) => {
    return match.homeTeam.id === team?.id
      ? match.homeScore
      : match.awayScore;
  };

  const getOpponentScore = (match: Match) => {
    return match.homeTeam.id === team?.id
      ? match.awayScore
      : match.homeScore;
  };

  const getResult = (match: Match) => {
    const teamScore = getTeamScore(match);
    const opponentScore = getOpponentScore(match);

    if (teamScore > opponentScore) {
      return 'W';
    }

    if (teamScore < opponentScore) {
      return 'L';
    }

    return 'D';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <div className="text-lg font-semibold text-slate-600">
            Loading team...
          </div>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-5xl">⚠️</div>

          <h1 className="text-2xl font-bold text-slate-900">
            Team Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            {error || 'The requested team could not be found.'}
          </p>

          <Link
            to="/teams"
            className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
          >
            ← Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          to="/teams"
          className="mb-5 inline-flex items-center text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        >
          ← Back to Teams
        </Link>

        {/* Team Header */}
        <section className="overflow-hidden rounded-2xl bg-slate-900 shadow-lg">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row">

              {/* Logo */}
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-3 shadow-md sm:h-32 sm:w-32">
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.teamName}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-5xl">⚽</span>
                )}
              </div>

              {/* Team Info */}
              <div className="text-center sm:text-left">
                <p className="mb-1 text-sm font-medium uppercase tracking-wider text-slate-300">
                  Team Profile
                </p>

                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  {team.teamName}
                </h1>

                <p className="mt-2 text-slate-300">
                  Player: {team.playerName}
                </p>

                {team.tournament && (
                  <p className="mt-1 text-sm text-slate-400">
                    Tournament: {team.tournament.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-6">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Team Statistics
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">

            <StatCard
              label="Played"
              value={statistics.played}
            />

            <StatCard
              label="Won"
              value={statistics.won}
            />

            <StatCard
              label="Draw"
              value={statistics.draw}
            />

            <StatCard
              label="Lost"
              value={statistics.lost}
            />

            <StatCard
              label="GF"
              value={statistics.goalsFor}
            />

            <StatCard
              label="GA"
              value={statistics.goalsAgainst}
            />

            <StatCard
              label="GD"
              value={
                statistics.goalDifference > 0
                  ? `+${statistics.goalDifference}`
                  : statistics.goalDifference
              }
            />

            <StatCard
              label="Points"
              value={statistics.points}
            />

          </div>
        </section>

        {/* Upcoming Matches */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Upcoming Matches
            </h2>

            <Link
              to="/fixtures"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              All Fixtures →
            </Link>
          </div>

          {upcomingMatches.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-slate-500 shadow-sm">
              No upcoming matches.
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingMatches.map((match) => {
                const opponent = getOpponent(match);

                return (
                  <div
                    key={match.id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="text-sm font-semibold text-blue-600">
                          Round {match.round}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {formatDate(match.matchDate)} ·{' '}
                          {formatTime(match.matchDate)}
                        </p>

                        {match.venue && (
                          <p className="mt-1 text-xs text-slate-400">
                            📍 {match.venue}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            {team.teamName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {team.playerName}
                          </p>
                        </div>

                        <div className="font-bold text-slate-400">
                          VS
                        </div>

                        <div>
                          <p className="font-bold text-slate-900">
                            {opponent.teamName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {opponent.playerName}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Completed Matches */}
        <section className="mt-8 pb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Match Results
            </h2>

            <Link
              to="/results"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              All Results →
            </Link>
          </div>

          {completedMatches.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-slate-500 shadow-sm">
              No completed matches yet.
            </div>
          ) : (
            <div className="space-y-4">
              {completedMatches.map((match) => {
                const opponent = getOpponent(match);
                const result = getResult(match);

                return (
                  <div
                    key={match.id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="text-sm font-semibold text-slate-500">
                          Round {match.round}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(match.matchDate)}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-4">

                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            {team.teamName}
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">
                            {getTeamScore(match)} -{' '}
                            {getOpponentScore(match)}
                          </div>

                          <span
                            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                              result === 'W'
                                ? 'bg-green-100 text-green-700'
                                : result === 'D'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {result}
                          </span>
                        </div>

                        <div>
                          <p className="font-bold text-slate-900">
                            {opponent.teamName}
                          </p>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number | string;
}

const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
};

export default TeamDetails;