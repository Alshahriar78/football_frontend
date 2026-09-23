import { type FormEvent, useEffect, useState } from 'react';
import { matchAPI, type Match } from '../../services/matchService';
import {
  tournamentAPI,
  type Tournament,
} from '../../services/tournamentService';
import { teamAPI, type Team } from '../../services/teamService';

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [tournamentId, setTournamentId] = useState('');
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [venue, setVenue] = useState('');
  const [round, setRound] = useState('1');

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      setError('');

      const [matchData, tournamentData, teamData] = await Promise.all([
        matchAPI.getAll(),
        tournamentAPI.getAll(),
        teamAPI.getAll(),
      ]);

      setMatches(matchData);
      setTournaments(tournamentData);
      setTeams(teamData);

      if (tournamentData.length > 0 && !tournamentId) {
        setTournamentId(String(tournamentData[0].id));
      }
    } catch {
      setError('Failed to load match data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedTournamentTeams = teams.filter(
    (team) => team.tournament?.id === Number(tournamentId),
  );

  useEffect(() => {
    setHomeTeamId('');
    setAwayTeamId('');
  }, [tournamentId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!tournamentId) {
      setError('Please select a tournament.');
      return;
    }

    if (!homeTeamId || !awayTeamId) {
      setError('Please select both teams.');
      return;
    }

    if (homeTeamId === awayTeamId) {
      setError('Home team and away team cannot be the same.');
      return;
    }

    if (!matchDate) {
      setError('Please select match date and time.');
      return;
    }

    if (!round || Number(round) < 1) {
      setError('Round must be at least 1.');
      return;
    }

    setCreating(true);

    try {
      await matchAPI.create({
        tournamentId: Number(tournamentId),
        homeTeamId: Number(homeTeamId),
        awayTeamId: Number(awayTeamId),
        matchDate,
        venue: venue || undefined,
        round: Number(round),
      });

      setHomeTeamId('');
      setAwayTeamId('');
      setMatchDate('');
      setVenue('');
      setRound('1');

      setSuccess('Match scheduled successfully.');

      await loadData();
    } catch (error: any) {
      console.error('MATCH CREATE ERROR:', error);
      console.error(error?.response?.data);

      setError(
        error?.response?.data?.message || 'Failed to schedule match.',
      );
    } finally {
      setCreating(false);
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
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Matches
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Schedule and manage tournament matches.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        {/* Create Match */}
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Schedule Match
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new tournament fixture.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tournament */}
            <div>
              <label
                htmlFor="tournament"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Tournament
              </label>

              <select
                id="tournament"
                value={tournamentId}
                onChange={(event) => setTournamentId(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select tournament</option>

                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Home Team */}
            <div>
              <label
                htmlFor="home-team"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Home Team
              </label>

              <select
                id="home-team"
                value={homeTeamId}
                onChange={(event) => setHomeTeamId(event.target.value)}
                required
                disabled={selectedTournamentTeams.length < 2}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">Select home team</option>

                {selectedTournamentTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.teamName} — {team.playerName}
                  </option>
                ))}
              </select>
            </div>

            {/* Away Team */}
            <div>
              <label
                htmlFor="away-team"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Away Team
              </label>

              <select
                id="away-team"
                value={awayTeamId}
                onChange={(event) => setAwayTeamId(event.target.value)}
                required
                disabled={selectedTournamentTeams.length < 2}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">Select away team</option>

                {selectedTournamentTeams
                  .filter((team) => team.id !== Number(homeTeamId))
                  .map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.teamName} — {team.playerName}
                    </option>
                  ))}
              </select>

              {selectedTournamentTeams.length < 2 && (
                <p className="mt-2 text-xs text-amber-600">
                  At least 2 teams are required in this tournament.
                </p>
              )}
            </div>

            {/* Match Date */}
            <div>
              <label
                htmlFor="match-date"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Match Date & Time
              </label>

              <input
                id="match-date"
                type="datetime-local"
                value={matchDate}
                onChange={(event) => setMatchDate(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Venue */}
            <div>
              <label
                htmlFor="venue"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Venue
                <span className="ml-1 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <input
                id="venue"
                type="text"
                value={venue}
                onChange={(event) => setVenue(event.target.value)}
                placeholder="e.g. Mokamtola"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Round */}
            <div>
              <label
                htmlFor="round"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Round
              </label>

              <input
                id="round"
                type="number"
                min="1"
                value={round}
                onChange={(event) => setRound(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Messages */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={creating || selectedTournamentTeams.length < 2}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? 'Scheduling...' : 'Schedule Match'}
            </button>
          </form>
        </div>

        {/* Match List */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Scheduled Matches
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {matches.length} match
                  {matches.length !== 1 ? 'es' : ''} total
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {matches.length}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              <p className="text-sm text-slate-500">
                Loading matches...
              </p>
            </div>
          ) : matches.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl">📅</div>

              <h3 className="mt-3 font-semibold text-slate-800">
                No matches yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Schedule the first match from the form.
              </p>
            </div>
          ) : (
            <div className="space-y-4 p-4 sm:p-5">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm sm:p-5"
                >
                  {/* Top */}
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

                  {/* Teams */}
                  <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
                    {/* Home */}
                    <div className="min-w-0 text-center">
                      {match.homeTeam.logo ? (
                        <img
                          src={match.homeTeam.logo}
                          alt={match.homeTeam.teamName}
                          className="mx-auto h-12 w-12 object-contain sm:h-14 sm:w-14"
                        />
                      ) : (
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl sm:h-14 sm:w-14">
                          ⚽
                        </div>
                      )}

                      <h3 className="mt-2 truncate text-sm font-bold text-slate-900 sm:text-base">
                        {match.homeTeam.teamName}
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {match.homeTeam.playerName}
                      </p>
                    </div>

                    {/* Score / VS */}
                    <div className="text-center">
                      {match.status === 'completed' ? (
                        <div className="text-xl font-black text-slate-900 sm:text-2xl">
                          {match.homeScore} - {match.awayScore}
                        </div>
                      ) : (
                        <div className="text-sm font-black text-slate-400 sm:text-base">
                          VS
                        </div>
                      )}
                    </div>

                    {/* Away */}
                    <div className="min-w-0 text-center">
                      {match.awayTeam.logo ? (
                        <img
                          src={match.awayTeam.logo}
                          alt={match.awayTeam.teamName}
                          className="mx-auto h-12 w-12 object-contain sm:h-14 sm:w-14"
                        />
                      ) : (
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl sm:h-14 sm:w-14">
                          ⚽
                        </div>
                      )}

                      <h3 className="mt-2 truncate text-sm font-bold text-slate-900 sm:text-base">
                        {match.awayTeam.teamName}
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {match.awayTeam.playerName}
                      </p>
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="mt-5 grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:grid-cols-2">
                    <p>
                      🗓️ <span className="font-medium">Date:</span>{' '}
                      {formatDate(match.matchDate)}
                    </p>

                    <p>
                      🏆 <span className="font-medium">Tournament:</span>{' '}
                      {match.tournament.name}
                    </p>

                    {match.venue && (
                      <p>
                        📍 <span className="font-medium">Venue:</span>{' '}
                        {match.venue}
                      </p>
                    )}

                    <p>
                      🆔 <span className="font-medium">Match ID:</span> #
                      {match.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Matches;