
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { announcementAPI } from '../../services/announcementService';
import type { Announcement } from '../../services/announcementService';

import { galleryAPI } from '../../services/galleryService';
import type { GalleryItem } from '../../services/galleryService';

const Home = () => {
  const [latestAnnouncement, setLatestAnnouncement] =
    useState<Announcement | null>(null);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  const [loadingAnnouncement, setLoadingAnnouncement] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    const loadLatestAnnouncement = async () => {
      try {
        const data = await announcementAPI.getPublished();

        if (data.length > 0) {
          setLatestAnnouncement(data[0]);
        }
      } catch (error) {
        console.error(
          'Failed to load latest announcement:',
          error,
        );
      } finally {
        setLoadingAnnouncement(false);
      }
    };

    loadLatestAnnouncement();
  }, []);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await galleryAPI.getPublished();

        setGalleryItems(data.slice(0, 4));
      } catch (error) {
        console.error(
          'Failed to load gallery:',
          error,
        );
      } finally {
        setLoadingGallery(false);
      }
    };

    loadGallery();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ================= HERO ================= */}
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-12 lg:px-8">

        <div className="overflow-hidden rounded-2xl bg-slate-900 px-6 py-12 text-center text-white sm:px-10 lg:px-16 lg:py-20">

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Welcome to
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-6xl">
            Mokamtola eFootball Tournament
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base lg:text-lg">
            Follow tournament fixtures, results,
            standings and participating teams
            from one place.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/fixtures"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View Fixtures
            </Link>

            <Link
              to="/standings"
              className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View Standings
            </Link>

          </div>

        </div>

      </section>


      {/* ================= LATEST ANNOUNCEMENT ================= */}
      {!loadingAnnouncement && latestAnnouncement && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="mb-5 flex items-end justify-between gap-4">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Stay Updated
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Latest Announcement
              </h2>
            </div>

            <Link
              to="/announcements"
              className="hidden text-sm font-semibold text-blue-600 transition hover:text-blue-700 sm:block"
            >
              View All →
            </Link>

          </div>


          <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="grid md:grid-cols-2">

              {/* Announcement Image */}
              {latestAnnouncement.imageUrl ? (
                <div className="relative h-64 overflow-hidden bg-slate-100 md:h-full md:min-h-[360px]">

                  <img
                    src={latestAnnouncement.imageUrl}
                    alt={latestAnnouncement.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                  <div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-800 shadow-sm">
                    Latest Update
                  </div>

                </div>
              ) : (
                <div className="flex min-h-[250px] items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 md:min-h-[360px]">

                  <div className="text-center text-white">

                    <div className="text-6xl">
                      📢
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-300">
                      Tournament Announcement
                    </p>

                  </div>

                </div>
              )}


              {/* Announcement Content */}
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">

                <div className="flex flex-wrap items-center gap-3">

                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">

                    <span className="h-2 w-2 rounded-full bg-blue-600" />

                    Official Update

                  </span>

                  <span className="text-xs font-medium text-slate-400">

                    {new Date(
                      latestAnnouncement.createdAt,
                    ).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}

                  </span>

                </div>


                <h3 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">

                  {latestAnnouncement.title}

                </h3>


                <div className="mt-5 h-px bg-slate-100" />


                <p className="mt-5 line-clamp-4 whitespace-pre-wrap text-sm leading-7 text-slate-600 sm:text-base">

                  {latestAnnouncement.content}

                </p>


                <div className="mt-7">

                  <Link
                    to="/announcements"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                  >
                    Read Announcement

                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>

                  </Link>

                </div>

              </div>

            </div>

          </article>


          <div className="mt-5 text-center sm:hidden">

            <Link
              to="/announcements"
              className="text-sm font-semibold text-blue-600"
            >
              View All Announcements →
            </Link>

          </div>

        </section>
      )}


      {/* ================= GALLERY ================= */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

        <div className="mb-6 flex items-end justify-between gap-4">

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Tournament Moments
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Latest Gallery
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Explore the latest moments and memories from
              Mokamtola eFootball Tournament.
            </p>

          </div>


          <Link
            to="/gallery"
            className="hidden text-sm font-semibold text-blue-600 transition hover:text-blue-700 sm:block"
          >
            View Full Gallery →
          </Link>

        </div>


        {loadingGallery ? (

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (

              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-slate-200"
              />

            ))}

          </div>

        ) : galleryItems.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

            <div className="text-5xl">
              📸
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No gallery photos yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Tournament photos and memorable moments
              will appear here.
            </p>

          </div>

        ) : (

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {galleryItems.map((item) => (

              <Link
                key={item.id}
                to="/gallery"
                className="group relative overflow-hidden rounded-2xl bg-slate-200 shadow-sm"
              >

                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                />


                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />


                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">

                  {item.category && (
                    <span className="mb-2 inline-block rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
                      {item.category}
                    </span>
                  )}

                  <h3 className="line-clamp-2 text-base font-bold">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-slate-300">
                      {item.description}
                    </p>
                  )}

                </div>


                {/* Hover Icon */}
                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-sm text-slate-900 opacity-0 shadow-lg transition duration-300 group-hover:opacity-100">
                  ↗
                </div>

              </Link>

            ))}

          </div>

        )}


        {/* Mobile Gallery Button */}
        <div className="mt-6 text-center sm:hidden">

          <Link
            to="/gallery"
            className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            View Full Gallery →
          </Link>

        </div>

      </section>


      {/* ================= QUICK LINKS ================= */}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-2 sm:px-6 lg:px-8">

        <div className="grid gap-4 sm:grid-cols-3">

          <Link
            to="/teams"
            className="rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="text-3xl">
              👥
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              Participating Teams
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              See all registered teams and players.
            </p>

          </Link>


          <Link
            to="/fixtures"
            className="rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="text-3xl">
              📅
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              Match Fixtures
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Check upcoming matches and schedules.
            </p>

          </Link>


          <Link
            to="/results"
            className="rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="text-3xl">
              🏆
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              Match Results
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Follow completed match results.
            </p>

          </Link>

        </div>

      </section>

    </main>
  );
};

export default Home;

