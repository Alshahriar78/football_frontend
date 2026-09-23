import { type FormEvent, useState } from 'react';
import {
  tournamentAPI,
  type Tournament,
} from '../../services/tournamentService';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadTournaments = async () => {
    try {
      setError('');

      const data = await tournamentAPI.getAll();

      setTournaments(data);
    } catch {
      setError('Failed to load tournaments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before start date.');
      return;
    }

    setCreating(true);

    try {
      await tournamentAPI.create({
        name,
        startDate,
        endDate,
      });

      setName('');
      setStartDate('');
      setEndDate('');

      setSuccess('Tournament created successfully.');

      await loadTournaments();
    } catch {
      setError('Failed to create tournament.');
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Tournaments
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create and manage tournament information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        {/* Create Tournament */}
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Create Tournament
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a new tournament to the system.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="tournament-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Tournament Name
              </label>

              <input
                id="tournament-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Mokamtola eFootball Cup 2027"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="start-date"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Start Date
              </label>

              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="end-date"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                End Date
              </label>

              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={creating}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? 'Creating...' : 'Create Tournament'}
            </button>
          </form>
        </div>

        {/* Tournament List */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Tournament List
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {tournaments.length} tournament
                  {tournaments.length !== 1 ? 's' : ''} found
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {tournaments.length}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              <p className="text-sm text-slate-500">
                Loading tournaments...
              </p>
            </div>
          ) : tournaments.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl">🏆</div>

              <h3 className="mt-3 font-semibold text-slate-800">
                No tournaments yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create your first tournament from the form.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="p-5 transition hover:bg-slate-50 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Tournament Info */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-bold text-slate-900">
                          {tournament.name}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                            tournament.status === 'upcoming'
                              ? 'bg-blue-100 text-blue-700'
                              : tournament.status === 'completed'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {tournament.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {formatDate(tournament.startDate)} —{' '}
                        {formatDate(tournament.endDate)}
                      </p>
                    </div>

                    {/* ID */}
                    <div className="shrink-0">
                      <p className="text-xs text-slate-400">
                        Tournament ID
                      </p>

                      <p className="mt-1 font-mono text-sm font-semibold text-slate-700">
                        #{tournament.id}
                      </p>
                    </div>
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

export default Tournaments;