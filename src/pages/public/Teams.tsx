import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { teamAPI, type Team } from '../../services/teamService';

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await teamAPI.getAll();
        setTeams(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load teams.');
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Tournament Participants
          </p>

          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Teams
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
            Explore all participating teams and view their tournament
            statistics, fixtures and results.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-600">
              Loading teams...
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Please wait while we load the tournament teams.
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mb-3 text-4xl">⚠️</div>

            <h2 className="text-lg font-bold text-red-800">
              Unable to Load Teams
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && teams.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mb-4 text-5xl">🎮</div>

            <h2 className="text-xl font-bold text-slate-900">
              No Teams Registered Yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Teams will appear here once they are registered for the
              tournament.
            </p>
          </div>
        )}

        {/* Teams Grid */}
        {!loading && !error && teams.length > 0 && (
          <>
            {/* Team Count */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                {teams.length}{' '}
                {teams.length === 1 ? 'Team' : 'Teams'} Registered
              </p>

              <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                eFootball
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  to={`/team/${team.id}`}
                  className="group block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Team Logo */}
                  <div className="flex items-center gap-4">

                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 p-2">
                      {team.logo ? (
                        <img
                          src={team.logo}
                          alt={`${team.teamName} logo`}
                          className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-3xl">⚽</span>
                      )}
                    </div>

                    {/* Team Basic Info */}
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-xl font-bold text-slate-900 transition group-hover:text-blue-600">
                        {team.teamName}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Player
                      </p>

                      <p className="truncate text-sm font-semibold text-slate-700">
                        {team.playerName}
                      </p>
                    </div>

                  </div>

                  {/* Divider */}
                  <div className="my-5 border-t border-slate-100" />

                  {/* Tournament */}
                  {team.tournament && (
                    <div className="mb-4 rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Tournament
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                        {team.tournament.name}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Team ID: #{team.id}
                    </span>

                    <span className="text-sm font-bold text-blue-600 transition group-hover:translate-x-1">
                      View Details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Teams;