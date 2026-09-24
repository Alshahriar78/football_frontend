
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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gray-950 px-4 py-16 text-white sm:py-20">
        {/* Background decoration */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Tournament Updates
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Announcements
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Stay updated with the latest news, registration updates,
            schedules and important information from Mokamtola eFootball Cup
            2026.
          </p>
        </div>
      </section>

      {/* Announcements */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
              <p className="mt-4 text-sm font-medium text-gray-500">
                Loading announcements...
              </p>
            </div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              📢
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No announcements yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Tournament announcements and important updates will appear
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Announcement Image */}
                {announcement.imageUrl ? (
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-72 md:h-80"
                    />

                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
                    <span className="text-5xl opacity-80">📢</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 sm:p-8">
                  {/* Date */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>

                      {new Date(
                        announcement.createdAt,
                      ).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>

                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                      Official Update
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                    {announcement.title}
                  </h2>

                  {/* Divider */}
                  <div className="mt-5 h-px bg-gray-100" />

                  {/* Content */}
                  <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-gray-600 sm:text-lg">
                    {announcement.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Announcements;

