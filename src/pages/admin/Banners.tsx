import { useEffect, useState } from 'react';

import api from '../../services/api';
import { uploadAPI } from '../../services/uploadService';

interface Banner {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

interface CreateBannerData {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  displayOrder: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const Banners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  const [form, setForm] = useState<CreateBannerData>({
    title: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    isActive: true,
    displayOrder: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /*
   * --------------------------------
   * Load Banners
   * --------------------------------
   */

  const loadBanners = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get<Banner[]>('/banners');

      setBanners(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  /*
   * --------------------------------
   * Form Change
   * --------------------------------
   */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * --------------------------------
   * Image Select
   * --------------------------------
   */

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError('');
    setSuccess('');

    // File size validation
    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setPreviewUrl('');

      event.target.value = '';

      setError('Image size must be less than 5 MB.');

      return;
    }

    // File type validation
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);
      setPreviewUrl('');

      event.target.value = '';

      setError(
        'Only JPG, JPEG, PNG and WebP images are allowed.',
      );

      return;
    }

    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  };

  /*
   * --------------------------------
   * Remove Selected Image
   * --------------------------------
   */

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  /*
   * --------------------------------
   * Submit
   * --------------------------------
   */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      /*
       * Validate title
       */

      if (!form.title.trim()) {
        setError('Banner title is required.');
        return;
      }

      /*
       * Validate image
       */

      if (!selectedFile) {
        setError('Please select a banner image.');
        return;
      }

      /*
       * --------------------------------
       * Step 1: Upload image
       * --------------------------------
       */

      const uploadResult = await uploadAPI.image(selectedFile);

      /*
       * --------------------------------
       * Step 2: Create banner
       * --------------------------------
       */

      const payload = {
        title: form.title.trim(),
        description:
          form.description?.trim() || undefined,
        imageUrl: uploadResult.url,
        buttonText:
          form.buttonText?.trim() || undefined,
        buttonLink:
          form.buttonLink?.trim() || undefined,
        isActive: form.isActive,
        displayOrder: Number(form.displayOrder),
      };

      await api.post('/banners', payload);

      /*
       * --------------------------------
       * Success
       * --------------------------------
       */

      setSuccess('Banner created successfully.');

      setForm({
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '',
        isActive: true,
        displayOrder: 0,
      });

      setSelectedFile(null);
      setPreviewUrl('');

      await loadBanners();
    } catch (err) {
      console.error(err);

      setError(
        'Failed to upload image or create banner.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * --------------------------------
   * Date Format
   * --------------------------------
   */

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-BD', {
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
          Content Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Banners
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create and manage homepage banners for your tournament.
        </p>
      </div>

      {/* Messages */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Create Banner */}

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-slate-900">
                Add New Banner
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Add a banner that can be displayed on the homepage.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              {/* Title */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Mokamtola eFootball Cup 2026"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Description */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Join the biggest eFootball tournament in Mokamtola."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Image Upload */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Banner Image
                </label>

                {!previewUrl ? (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50">
                    <div className="text-4xl">🖼️</div>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Choose Banner Image
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      JPG, PNG or WebP • Maximum 5 MB
                    </p>

                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="relative aspect-[16/7] bg-slate-100">
                      <img
                        src={previewUrl}
                        alt="Banner preview"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute right-3 top-3 rounded-lg bg-black/70 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="bg-white px-4 py-3">
                      <p className="truncate text-sm font-semibold text-slate-700">
                        {selectedFile?.name}
                      </p>

                      {selectedFile && (
                        <p className="mt-1 text-xs text-slate-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Button Text */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Button Text
                </label>

                <input
                  type="text"
                  name="buttonText"
                  value={form.buttonText}
                  onChange={handleChange}
                  placeholder="View Fixtures"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Button Link */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Button Link
                </label>

                <input
                  type="text"
                  name="buttonLink"
                  value={form.buttonLink}
                  onChange={handleChange}
                  placeholder="/fixtures"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Display Order */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Display Order
                </label>

                <input
                  type="number"
                  name="displayOrder"
                  value={form.displayOrder}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Smaller numbers appear first.
                </p>
              </div>

              {/* Active */}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      isActive: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Active Banner
                  </p>

                  <p className="text-xs text-slate-400">
                    Make this banner available for the homepage.
                  </p>
                </div>
              </label>

              {/* Submit */}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? 'Uploading & Creating...'
                  : 'Create Banner'}
              </button>
            </form>
          </div>
        </div>

        {/* Banner List */}

        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Existing Banners
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {banners.length}{' '}
                  {banners.length === 1
                    ? 'banner'
                    : 'banners'}{' '}
                  found
                </p>
              </div>

              <button
                type="button"
                onClick={loadBanners}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {loading ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  Loading banners...
                </div>
              ) : banners.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-8 text-center">
                  <div className="text-4xl">🖼️</div>

                  <p className="mt-3 font-semibold text-slate-700">
                    No banners yet
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Create your first banner using the form.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      className="overflow-hidden rounded-2xl border border-slate-200"
                    >
                      {/* Image Preview */}

                      <div className="relative aspect-[16/7] overflow-hidden bg-slate-100">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />

                        <div className="absolute left-3 top-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              banner.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {banner.isActive
                              ? 'Active'
                              : 'Inactive'}
                          </span>
                        </div>

                        <div className="absolute right-3 top-3">
                          <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                            Order #{banner.displayOrder}
                          </span>
                        </div>
                      </div>

                      {/* Banner Info */}

                      <div className="p-4 sm:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              {banner.title}
                            </h3>

                            {banner.description && (
                              <p className="mt-1 text-sm text-slate-500">
                                {banner.description}
                              </p>
                            )}
                          </div>

                          <span className="shrink-0 text-xs text-slate-400">
                            ID #{banner.id}
                          </span>
                        </div>

                        {/* Button Preview */}

                        {banner.buttonText && (
                          <div className="mt-4">
                            <span className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                              {banner.buttonText}
                            </span>

                            {banner.buttonLink && (
                              <p className="mt-2 break-all text-xs text-slate-400">
                                Link: {banner.buttonLink}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="mt-4 border-t border-slate-100 pt-3">
                          <p className="text-xs text-slate-400">
                            Created:{' '}
                            {formatDate(banner.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banners;