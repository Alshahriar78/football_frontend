import { useEffect, useState } from 'react';

import {
  standingsAPI,
  type Standing,
} from '../../services/standingsService';

import {
  tournamentAPI,
  type Tournament,
} from '../../services/tournamentService';

const Standings = () => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const [selectedTournamentId, setSelectedTournamentId] =
    useState('');

  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingStandings, setLoadingStandings] = useState(false);

  const [error, setError] = useState('');

  // Load tournaments
  useEffect(() => {
    const loadTournaments = async () => {
      try {
        setError('');

        const data = await tournamentAPI.getAll();

        setTournaments(data);

        // Select first tournament automatically
        if (data.length > 0) {
          setSelectedTournamentId(String(data[0].id));
        }
      } catch {
        setError('Failed to load tournaments.');
      } finally {
        setLoadingTournaments(false);
      }
    };

    loadTournaments();
  }, []);

  // Load standings whenever tournament changes
  useEffect(() => {
    if (!selectedTournamentId) {
      return;
    }

    const loadStandings = async () => {
      try {
        setLoadingStandings(true);
        setError('');

        const data = await standingsAPI.getByTournament(
          Number(selectedTournamentId),
        );

        setStandings(data);
      } catch {
        setStandings([]);
        setError('Failed to load standings.');
      } finally {
        setLoadingStandings(false);
      }
    };

    loadStandings();
  }, [selectedTournamentId]);

  const selectedTournament = tournaments.find(
    (tournament) =>
      tournament.id === Number(selectedTournamentId),
  );

  if (loadingTournaments) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-slate-500">
          Loading tournaments...
        </p>
      </div>
    );
  }

  if (error && tournaments.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          Tournament Table
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
          Points Table
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          View the latest tournament standings.
        </p>
      </div>

      {/* Tournament Selector */}
      {tournaments.length > 0 && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Select Tournament
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Choose a tournament to view its points table.
              </p>
            </div>

            <select
              value={selectedTournamentId}
              onChange={(event) =>
                setSelectedTournamentId(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:w-80"
            >
              {tournaments.map((tournament) => (
                <option
                  key={tournament.id}
                  value={tournament.id}
                >
                  {tournament.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Selected Tournament */}
      {selectedTournament && (
        <div className="mb-6 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                Current Tournament
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                {selectedTournament.name}
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-500">
                {selectedTournament.startDate} →{' '}
                {selectedTournament.endDate}
              </p>

              <span className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-violet-700">
                {selectedTournament.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loading Standings */}
      {loadingStandings ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading standings...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : standings.length === 0 ? (
        /* Empty State */
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="text-4xl">🏆</div>

          <h2 className="mt-3 text-lg font-semibold text-slate-800">
            No standings available
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Teams and completed matches will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Team</th>
                    <th className="px-5 py-4 text-center">P</th>
                    <th className="px-5 py-4 text-center">W</th>
                    <th className="px-5 py-4 text-center">D</th>
                    <th className="px-5 py-4 text-center">L</th>
                    <th className="px-5 py-4 text-center">GF</th>
                    <th className="px-5 py-4 text-center">GA</th>
                    <th className="px-5 py-4 text-center">GD</th>
                    <th className="px-5 py-4 text-center">Pts</th>
                  </tr>
                </thead>

                <tbody>
                  {standings.map((team, index) => (
                    <tr
                      key={team.teamId}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="px-5 py-5">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                            index === 0
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="font-semibold text-slate-900">
                          {team.teamName}
                        </div>
                      </td>

                      <td className="px-5 py-5 text-center text-slate-700">
                        {team.played}
                      </td>

                      <td className="px-5 py-5 text-center text-slate-700">
                        {team.won}
                      </td>

                      <td className="px-5 py-5 text-center text-slate-700">
                        {team.draw}
                      </td>

                      <td className="px-5 py-5 text-center text-slate-700">
                        {team.lost}
                      </td>

                      <td className="px-5 py-5 text-center text-slate-700">
                        {team.goalsFor}
                      </td>

                      <td className="px-5 py-5 text-center text-slate-700">
                        {team.goalsAgainst}
                      </td>

                      <td className="px-5 py-5 text-center font-semibold">
                        <span
                          className={
                            team.goalDifference > 0
                              ? 'text-emerald-600'
                              : team.goalDifference < 0
                                ? 'text-red-600'
                                : 'text-slate-600'
                          }
                        >
                          {team.goalDifference > 0
                            ? `+${team.goalDifference}`
                            : team.goalDifference}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-center">
                        <span className="text-lg font-black text-slate-900">
                          {team.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {standings.map((team, index) => (
              <div
                key={team.teamId}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                {/* Team Header */}
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        index === 0
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {index + 1}
                    </span>

                    <h2 className="truncate font-bold text-slate-900">
                      {team.teamName}
                    </h2>
                  </div>

                  <div className="ml-3 text-right">
                    <p className="text-xs text-slate-400">
                      POINTS
                    </p>

                    <p className="text-2xl font-black text-slate-900">
                      {team.points}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-4 gap-2">
                  <div className="rounded-lg bg-slate-50 p-2 text-center">
                    <p className="text-[10px] font-semibold text-slate-400">
                      P
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      {team.played}
                    </p>
                  </div>

                  <div className="rounded-lg bg-emerald-50 p-2 text-center">
                    <p className="text-[10px] font-semibold text-emerald-600">
                      W
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      {team.won}
                    </p>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-2 text-center">
                    <p className="text-[10px] font-semibold text-amber-600">
                      D
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      {team.draw}
                    </p>
                  </div>

                  <div className="rounded-lg bg-red-50 p-2 text-center">
                    <p className="text-[10px] font-semibold text-red-600">
                      L
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      {team.lost}
                    </p>
                  </div>
                </div>

                {/* Goal Stats */}
                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400">
                      GF
                    </p>

                    <p className="font-semibold text-slate-700">
                      {team.goalsFor}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] text-slate-400">
                      GA
                    </p>

                    <p className="font-semibold text-slate-700">
                      {team.goalsAgainst}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] text-slate-400">
                      GD
                    </p>

                    <p
                      className={`font-semibold ${
                        team.goalDifference > 0
                          ? 'text-emerald-600'
                          : team.goalDifference < 0
                            ? 'text-red-600'
                            : 'text-slate-600'
                      }`}
                    >
                      {team.goalDifference > 0
                        ? `+${team.goalDifference}`
                        : team.goalDifference}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Legend */}
      {standings.length > 0 && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <span>
              <strong>P</strong> = Played
            </span>

            <span>
              <strong>W</strong> = Won
            </span>

            <span>
              <strong>D</strong> = Draw
            </span>

            <span>
              <strong>L</strong> = Lost
            </span>

            <span>
              <strong>GF</strong> = Goals For
            </span>

            <span>
              <strong>GA</strong> = Goals Against
            </span>

            <span>
              <strong>GD</strong> = Goal Difference
            </span>

            <span>
              <strong>Pts</strong> = Points
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default Standings;