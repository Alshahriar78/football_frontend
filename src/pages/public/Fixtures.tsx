import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  matchAPI,
  type Match,
} from '../../services/matchService';

const Fixtures = () => {
  const [matches, setMatches] =
    useState<Match[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data =
          await matchAPI.getAll();

        setMatches(data);
      } catch {
        setError(
          'Failed to load fixtures.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  const upcomingMatches = useMemo(() => {
    return matches
      .filter(
        (match) =>
          match.status === 'scheduled',
      )
      .sort(
        (a, b) =>
          new Date(
            a.matchDate,
          ).getTime() -
          new Date(
            b.matchDate,
          ).getTime(),
      );
  }, [matches]);

  const formatDate = (
    dateString: string,
  ) => {
    return new Date(
      dateString,
    ).toLocaleDateString(
      'en-BD',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    );
  };

  const formatTime = (
    dateString: string,
  ) => {
    return new Date(
      dateString,
    ).toLocaleTimeString(
      'en-BD',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      },
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-slate-500">
          Loading fixtures...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Header */}

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Schedule
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
          Upcoming Fixtures
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Check the upcoming tournament matches.
        </p>
      </div>

      {/* Empty */}

      {upcomingMatches.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="text-4xl">
            📅
          </div>

          <h2 className="mt-3 text-lg font-semibold text-slate-800">
            No upcoming matches
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            New fixtures will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">

          {upcomingMatches.map(
            (match) => (
              <div
                key={match.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >

                {/* Match Header */}

                <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      Round {match.round}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {match.tournament.name}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Scheduled
                  </span>

                </div>

                {/* Teams */}

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-7 sm:gap-8 sm:px-8 sm:py-10">

                  {/* Home */}

                  <div className="min-w-0 text-center">

                    {match.homeTeam.logo ? (
                      <img
                        src={
                          match.homeTeam.logo
                        }
                        alt={
                          match.homeTeam.teamName
                        }
                        className="mx-auto h-16 w-16 object-contain sm:h-20 sm:w-20"
                      />
                    ) : (
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl sm:h-20 sm:w-20">
                        ⚽
                      </div>
                    )}

                    <h2 className="mt-3 truncate text-sm font-bold text-slate-900 sm:text-lg">
                      {match.homeTeam.teamName}
                    </h2>

                    <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                      {match.homeTeam.playerName}
                    </p>

                  </div>

                  {/* VS */}

                  <div className="text-center">

                    <div className="text-xl font-black text-slate-300 sm:text-2xl">
                      VS
                    </div>

                  </div>

                  {/* Away */}

                  <div className="min-w-0 text-center">

                    {match.awayTeam.logo ? (
                      <img
                        src={
                          match.awayTeam.logo
                        }
                        alt={
                          match.awayTeam.teamName
                        }
                        className="mx-auto h-16 w-16 object-contain sm:h-20 sm:w-20"
                      />
                    ) : (
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl sm:h-20 sm:w-20">
                        ⚽
                      </div>
                    )}

                    <h2 className="mt-3 truncate text-sm font-bold text-slate-900 sm:text-lg">
                      {match.awayTeam.teamName}
                    </h2>

                    <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                      {match.awayTeam.playerName}
                    </p>

                  </div>

                </div>

                {/* Match Information */}

                <div className="grid grid-cols-1 border-t border-slate-100 sm:grid-cols-2">

                  <div className="flex items-center justify-center gap-2 border-b border-slate-100 px-4 py-4 text-sm text-slate-600 sm:border-b-0 sm:border-r">
                    🗓️
                    <span>
                      {formatDate(
                        match.matchDate,
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 px-4 py-4 text-sm text-slate-600">
                    🕐
                    <span>
                      {formatTime(
                        match.matchDate,
                      )}
                    </span>

                    {match.venue && (
                      <>
                        <span className="text-slate-300">
                          •
                        </span>

                        <span>
                          📍 {match.venue}
                        </span>
                      </>
                    )}
                  </div>

                </div>

              </div>
            ),
          )}

        </div>
      )}

    </section>
  );
};

export default Fixtures;