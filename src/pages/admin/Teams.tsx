
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from 'react';

import { teamAPI, type Team } from '../../services/teamService';
import {
  tournamentAPI,
  type Tournament,
} from '../../services/tournamentService';
import { uploadAPI } from '../../services/uploadService';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const [teamName, setTeamName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [phone, setPhone] = useState('');
  const [tournamentId, setTournamentId] = useState('');

  // Player photo
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      setError('');

      const [teamData, tournamentData] = await Promise.all([
        teamAPI.getAll(),
        tournamentAPI.getAll(),
      ]);

      setTeams(teamData);
      setTournaments(tournamentData);

      if (tournamentData.length > 0 && !tournamentId) {
        setTournamentId(String(tournamentData[0].id));
      }
    } catch (error) {
      console.error('Failed to load teams or tournaments:', error);

      setError('Failed to load teams or tournaments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Clean preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    setError('');
    setSuccess('');

    if (!file) {
      return;
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(
        'Please select a JPG, JPEG, PNG, or WebP image.',
      );

      event.target.value = '';
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Player photo must be smaller than 5 MB.');

      event.target.value = '';
      return;
    }

    // Remove previous preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(newPreviewUrl);
  };

  const removePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl('');

    const fileInput = document.getElementById(
      'player-photo',
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = '';
    }
  };

  const resetForm = () => {
    setTeamName('');
    setPlayerName('');
    setPhone('');
    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl('');

    const fileInput = document.getElementById(
      'player-photo',
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!tournamentId) {
      setError('Please select a tournament.');
      return;
    }

    if (!teamName.trim()) {
      setError('Please enter a team name.');
      return;
    }

    if (!playerName.trim()) {
      setError('Please enter a player name.');
      return;
    }

    setCreating(true);

    try {
      let playerPhotoUrl: string | undefined;

      // Upload player photo first
      if (selectedFile) {
        const uploadResult = await uploadAPI.image(
          selectedFile,
        );

        playerPhotoUrl = uploadResult.url;
      }

      // Create team
      await teamAPI.create({
        teamName: teamName.trim(),
        playerName: playerName.trim(),
        phone: phone.trim() || undefined,
        logo: playerPhotoUrl,
        tournamentId: Number(tournamentId),
      });

      resetForm();

      setSuccess('Team registered successfully.');

      await loadData();
    } catch (error) {
      console.error('Failed to register team:', error);

      setError(
        'Failed to register team. Please try again.',
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Teams
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Register and manage tournament teams.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        {/* Create Team */}
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Register Team
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a team to a tournament.
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
                onChange={(event) =>
                  setTournamentId(event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select tournament
                </option>

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

            {/* Team Name */}
            <div>
              <label
                htmlFor="team-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Team Name
              </label>

              <input
                id="team-name"
                type="text"
                value={teamName}
                onChange={(event) =>
                  setTeamName(event.target.value)
                }
                placeholder="e.g. Real Madrid"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Player Name */}
            <div>
              <label
                htmlFor="player-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Player Name
              </label>

              <input
                id="player-name"
                type="text"
                value={playerName}
                onChange={(event) =>
                  setPlayerName(event.target.value)
                }
                placeholder="e.g. Al Shahoriar"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Phone
                <span className="ml-1 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="01XXXXXXXXX"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Player Photo */}
            <div>
              <label
                htmlFor="player-photo"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Player Photo
                <span className="ml-1 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              {previewUrl ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-4">
                    {/* Preview */}
                    <img
                      src={previewUrl}
                      alt="Player preview"
                      className="h-20 w-20 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-700">
                        {selectedFile?.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {selectedFile
                          ? `${(
                              selectedFile.size /
                              1024 /
                              1024
                            ).toFixed(2)} MB`
                          : ''}
                      </p>

                      <button
                        type="button"
                        onClick={removePhoto}
                        className="mt-2 text-xs font-semibold text-red-600 transition hover:text-red-700"
                      >
                        Remove photo
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="player-photo"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                    📷
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Upload player photo
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    JPG, PNG or WebP • Maximum 5 MB
                  </p>

                  <span className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
                    Choose Photo
                  </span>
                </label>
              )}

              <input
                id="player-photo"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
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
              disabled={
                creating || tournaments.length === 0
              }
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating
                ? selectedFile
                  ? 'Uploading & Registering...'
                  : 'Registering...'
                : 'Register Team'}
            </button>
          </form>
        </div>

        {/* Team List */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Registered Teams
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {teams.length} team
                  {teams.length !== 1 ? 's' : ''}{' '}
                  registered
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {teams.length}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              <p className="text-sm text-slate-500">
                Loading teams...
              </p>
            </div>
          ) : teams.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl">👥</div>

              <h3 className="mt-3 font-semibold text-slate-800">
                No teams yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Register the first team from the form.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    {/* Player Photo */}
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={team.playerName}
                        className="h-16 w-16 shrink-0 rounded-full border-2 border-slate-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl">
                        👤
                      </div>
                    )}

                    {/* Team Info */}
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-slate-900">
                        {team.teamName}
                      </h3>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {team.playerName}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                    {team.phone && (
                      <p className="text-xs text-slate-500">
                        📞 {team.phone}
                      </p>
                    )}

                    {team.tournament && (
                      <p className="truncate text-xs text-slate-500">
                        🏆 {team.tournament.name}
                      </p>
                    )}

                    <p className="text-xs text-slate-400">
                      Team ID: #{team.id}
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

export default Teams;

