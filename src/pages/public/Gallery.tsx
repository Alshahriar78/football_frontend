import { useEffect, useState } from 'react';
import { galleryAPI } from '../../services/galleryService';
import type { GalleryItem } from '../../services/galleryService';

const Gallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await galleryAPI.getPublished();
        setGallery(data);
      } catch (error) {
        console.error('Failed to load gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gray-900 px-4 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Gallery
          </h1>

          <p className="mt-2 text-gray-300">
            Moments from Mokamtola eFootball Cup 2026.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        {loading ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">
              Loading gallery...
            </p>
          </div>
        ) : gallery.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              No gallery images yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Tournament photos will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Information */}
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h2>

                  {item.description && (
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>
                  )}

                  {item.category && (
                    <span className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {item.category}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Gallery;