import { useEffect, useState } from 'react';
import { announcementAPI } from '../../services/announcementService';
import type { Announcement } from '../../services/announcementService';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const data = await announcementAPI.getPublished();
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to load announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gray-900 px-4 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Announcements
          </h1>

          <p className="mt-2 text-gray-300">
            Latest updates from Mokamtola eFootball Cup 2026.
          </p>
        </div>
      </section>

      {/* Announcements */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        {loading ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">
              Loading announcements...
            </p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              No announcements yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Tournament announcements will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {announcement.title}
                  </h2>

                  <time className="shrink-0 text-sm text-gray-400">
                    {new Date(
                      announcement.createdAt,
                    ).toLocaleDateString()}
                  </time>
                </div>

                <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-600">
                  {announcement.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Announcements;