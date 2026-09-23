import { useEffect, useState } from 'react';
import { matchAPI, type Match } from '../../services/matchService';

const Results = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [homeScores, setHomeScores] = useState<Record<number, string>>({});
  const [awayScores, setAwayScores] = useState<Record<number, string>>({});

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadMatches = async () => {
    try {
      setError('');

      const data = await matchAPI.getAll();

      setMatches(data);

      const homeScoreData: Record<number, string> = {};
      const awayScoreData: Record<number, string> = {};

      data.forEach((match) => {
        homeScoreData[match.id] = String(match.homeScore ?? 0);
        awayScoreData[match.id] = String(match.awayScore ?? 0);
      });

      setHomeScores(homeScoreData);
      setAwayScores(awayScoreData);
    } catch {
      setError('Failed to load matches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleUpdateResult = async (match: Match) => {
    setError('');
    setSuccess('');

    const homeScore = Number(homeScores[match.id]);
    const awayScore = Number(awayScores[match.id]);

    if (
      !Number.isInteger(homeScore) ||
      !Number.isInteger(awayScore) ||
      homeScore < 0 ||
      awayScore < 0
    ) {
      setError('Scores must be non-negative whole numbers.');
      return;
    }

    setUpdatingId(match.id);

    try {
      await matchAPI.updateResult(match.id, {
        homeScore,
        awayScore,
      });

      setSuccess(
        `Result updated: ${match.homeTeam.teamName} ${homeScore} - ${awayScore} ${match.awayTeam.teamName}`,
      );

      await loadMatches();
    } catch (error: any) {
      console.error('RESULT UPDATE ERROR:', error);
      console.error(error?.response?.data);

      setError(
        error?.response?.data?.message ||
          'Failed to update match result.',
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-BD', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getStatusClasses = (status: string) => {
    if (status === 'completed') {
      return 'bg-emerald-100 text-emerald-700';
    }

    if (status === 'live') {
      return 'bg-red-100 text-red-700';
    }

    return 'bg-blue-100 text-blue-700';
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Match Results
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Enter and update results for tournament matches.
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
          {success}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading matches...
          </p>
        </div>
      ) : matches.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="text-4xl">⚽</div>

          <h3 className="mt-3 font-semibold text-slate-800">
            No matches available
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Create a match first from Match Management.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {matches.map((match) => (
            <div
              key={match.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              {/* Match Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Round {match.round}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                      match.status,
                    )}`}
                  >
                    {match.status}
                  </span>
                </div>

                <span className="text-xs text-slate-400">
                  Match #{match.id}
                </span>
              </div>

              {/* Match Info */}
              <div className="mt-4 border-b border-slate-100 pb-4">
                <p className="text-sm font-semibold text-slate-800">
                  {match.tournament.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  🗓️ {formatDate(match.matchDate)}
                  {match.venue && ` • 📍 ${match.venue}`}
                </p>
              </div>

              {/* Teams + Score */}
              <div className="mt-6 grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
                {/* Home */}
                <div className="text-center">
                  {match.homeTeam.logo ? (
                    <img
                      src={match.homeTeam.logo}
                      alt={match.homeTeam.teamName}
                      className="mx-auto h-14 w-14 object-contain"
                    />
                  ) : (
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                      ⚽
                    </div>
                  )}

                  <h2 className="mt-3 font-bold text-slate-900">
                    {match.homeTeam.teamName}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {match.homeTeam.playerName}
                  </p>

                  <input
                    type="number"
                    min="0"
                    value={homeScores[match.id] ?? '0'}
                    onChange={(event) =>
                      setHomeScores((previous) => ({
                        ...previous,
                        [match.id]: event.target.value,
                      }))
                    }
                    className="mx-auto mt-4 block w-24 rounded-xl border border-slate-300 px-3 py-3 text-center text-xl font-bold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* VS */}
                <div className="text-center">
                  <p className="text-sm font-black text-slate-400">
                    VS
                  </p>
                </div>

                {/* Away */}
                <div className="text-center">
                  {match.awayTeam.logo ? (
                    <img
                      src={match.awayTeam.logo}
                      alt={match.awayTeam.teamName}
                      className="mx-auto h-14 w-14 object-contain"
                    />
                  ) : (
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                      ⚽
                    </div>
                  )}

                  <h2 className="mt-3 font-bold text-slate-900">
                    {match.awayTeam.teamName}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {match.awayTeam.playerName}
                  </p>

                  <input
                    type="number"
                    min="0"
                    value={awayScores[match.id] ?? '0'}
                    onChange={(event) =>
                      setAwayScores((previous) => ({
                        ...previous,
                        [match.id]: event.target.value,
                      }))
                    }
                    className="mx-auto mt-4 block w-24 rounded-xl border border-slate-300 px-3 py-3 text-center text-xl font-bold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Update Button */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => handleUpdateResult(match)}
                  disabled={updatingId === match.id}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updatingId === match.id
                    ? 'Updating Result...'
                    : match.status === 'completed'
                      ? 'Update Result'
                      : 'Submit Result'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Results;