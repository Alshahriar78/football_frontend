import React, { useEffect, useState } from 'react';

import { announcementAPI } from '../../services/announcementService';

import type {
  Announcement,
  UpdateAnnouncementData,
} from '../../services/announcementService';

import { uploadAPI } from '../../services/uploadService';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<
    Announcement[]
  >([]);

  // =========================
  // Form State
  // =========================

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // =========================
  // Image State
  // =========================

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState('');

  // =========================
  // Edit State
  // =========================

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [currentImageUrl, setCurrentImageUrl] =
    useState('');

  // =========================
  // Loading State
  // =========================

  const [loading, setLoading] = useState(false);

  const [loadingAnnouncements, setLoadingAnnouncements] =
    useState(true);

  const [actionId, setActionId] =
    useState<number | null>(null);

  // =========================
  // Error
  // =========================

  const [error, setError] = useState('');

  // =========================
  // Load Announcements
  // =========================

  const loadAnnouncements = async () => {
    try {
      setLoadingAnnouncements(true);
      setError('');

      const data =
        await announcementAPI.getAll();

      setAnnouncements(data);
    } catch (error) {
      console.error(
        'Failed to load announcements:',
        error,
      );

      setError(
        'Failed to load announcements.',
      );
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // =========================
  // Image Select
  // =========================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError('');

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        'Only JPG, JPEG, PNG and WEBP images are allowed.',
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        'Image size must be less than 5MB.',
      );

      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  };

  // =========================
  // Remove Selected Image
  // =========================

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl('');

    const fileInput =
      document.getElementById(
        'announcement-image',
      ) as HTMLInputElement;

    if (fileInput) {
      fileInput.value = '';
    }
  };

  // =========================
  // Reset Form
  // =========================

  const resetForm = () => {
    setTitle('');
    setContent('');
    setIsPublished(true);

    setEditingId(null);
    setCurrentImageUrl('');

    removeImage();

    setError('');
  };

  // =========================
  // Start Edit
  // =========================

  const handleEdit = (
    item: Announcement,
  ) => {
    setError('');

    setEditingId(item.id);

    setTitle(item.title);
    setContent(item.content);

    setIsPublished(
      item.isPublished,
    );

    setCurrentImageUrl(
      item.imageUrl || '',
    );

    removeImage();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // =========================
  // Create / Update
  // =========================

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setError('');

    if (!title.trim()) {
      setError(
        'Please enter a title.',
      );

      return;
    }

    if (!content.trim()) {
      setError(
        'Please enter announcement content.',
      );

      return;
    }

    try {
      setLoading(true);

      let imageUrl =
        currentImageUrl;

      // Upload new image
      if (selectedFile) {
        const uploadResult =
          await uploadAPI.image(
            selectedFile,
          );

        imageUrl =
          uploadResult.url;
      }

      // =========================
      // Update
      // =========================

      if (editingId !== null) {
        const updateData: UpdateAnnouncementData =
          {
            title: title.trim(),

            content:
              content.trim(),

            imageUrl:
              imageUrl || undefined,

            isPublished,
          };

        await announcementAPI.update(
          editingId,
          updateData,
        );

        alert(
          'Announcement updated successfully!',
        );
      }

      // =========================
      // Create
      // =========================

      else {
        await announcementAPI.create({
          title: title.trim(),

          content:
            content.trim(),

          imageUrl:
            imageUrl || undefined,

          isPublished,
        });

        alert(
          'Announcement created successfully!',
        );
      }

      resetForm();

      await loadAnnouncements();
    } catch (error: any) {
      console.error(
        'Announcement operation failed:',
        error,
      );

      setError(
        error?.response?.data?.message ||
          'Announcement operation failed.',
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Delete
  // =========================

  const handleDelete = async (
    id: number,
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this announcement?',
      );

    if (!confirmed) return;

    try {
      setActionId(id);
      setError('');

      await announcementAPI.remove(id);

      setAnnouncements(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== id,
          ),
      );

      if (editingId === id) {
        resetForm();
      }

      alert(
        'Announcement deleted successfully!',
      );
    } catch (error: any) {
      console.error(
        'Failed to delete announcement:',
        error,
      );

      setError(
        error?.response?.data?.message ||
          'Failed to delete announcement.',
      );
    } finally {
      setActionId(null);
    }
  };

  // =========================
  // Publish / Unpublish
  // =========================

  const handleTogglePublish = async (
    item: Announcement,
  ) => {
    try {
      setActionId(item.id);
      setError('');

      const updated =
        await announcementAPI.togglePublish(
          item.id,
        );

      setAnnouncements(
        (previous) =>
          previous.map(
            (announcement) =>
              announcement.id === item.id
                ? updated
                : announcement,
          ),
      );
    } catch (error: any) {
      console.error(
        'Failed to toggle publish:',
        error,
      );

      setError(
        error?.response?.data?.message ||
          'Failed to update publish status.',
      );
    } finally {
      setActionId(null);
    }
  };

  // =========================
  // Format Date
  // =========================

  const formatDate = (
    date: string,
  ) => {
    return new Date(
      date,
    ).toLocaleDateString(
      'en-BD',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
    );
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Announcements
          </h1>

          <p className="mt-1 text-sm text-slate-500 md:text-base">
            Create and manage tournament announcements
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}

        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">

          <div className="mb-6 flex items-start justify-between gap-4">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingId !== null
                  ? 'Edit Announcement'
                  : 'Create Announcement'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId !== null
                  ? 'Update announcement information or replace the image.'
                  : 'Create a tournament announcement with an optional image.'}
              </p>
            </div>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel Edit
              </button>
            )}

          </div>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

              {/* Image */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Announcement Image
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                {!previewUrl ? (

                  editingId !== null &&
                  currentImageUrl ? (

                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">

                      <img
                        src={currentImageUrl}
                        alt={title}
                        className="h-64 w-full object-cover"
                      />

                      <label
                        htmlFor="announcement-image"
                        className="absolute bottom-3 left-3 cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-md transition hover:bg-slate-50"
                      >
                        Replace Image
                      </label>

                      <input
                        id="announcement-image"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                    </div>

                  ) : (

                    <label
                      htmlFor="announcement-image"
                      className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 text-center transition hover:border-blue-400 hover:bg-blue-50"
                    >

                      <div className="mb-3 text-4xl">
                        📢
                      </div>

                      <p className="font-semibold text-slate-700">
                        Click to upload image
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        JPG, PNG, WEBP • Maximum 5MB
                      </p>

                      <input
                        id="announcement-image"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                    </label>
                  )

                ) : (

                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">

                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-64 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-3 top-3 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-red-700"
                    >
                      Remove
                    </button>

                  </div>
                )}

                {selectedFile && (
                  <p className="mt-2 truncate text-xs text-slate-500">
                    Selected: {selectedFile.name}
                  </p>
                )}

              </div>

              {/* Fields */}

              <div className="space-y-5">

                {/* Title */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Title *
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value,
                      )
                    }
                    placeholder="Example: Registration Open"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* Content */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Content *
                  </label>

                  <textarea
                    value={content}
                    onChange={(e) =>
                      setContent(
                        e.target.value,
                      )
                    }
                    placeholder="Write your announcement..."
                    rows={7}
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* Publish */}

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) =>
                      setIsPublished(
                        e.target.checked,
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    Publish immediately
                  </span>

                </label>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? editingId !== null
                      ? 'Updating...'
                      : 'Uploading & Creating...'
                    : editingId !== null
                      ? 'Update Announcement'
                      : 'Create Announcement'}
                </button>

              </div>

            </div>

          </form>

        </div>

        {/* List */}

        <div>

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Announcements
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {announcements.length} announcement
                {announcements.length !== 1
                  ? 's'
                  : ''}
              </p>
            </div>

            <button
              type="button"
              onClick={loadAnnouncements}
              disabled={loadingAnnouncements}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {loadingAnnouncements
                ? 'Loading...'
                : 'Refresh'}
            </button>

          </div>

          {/* Loading */}

          {loadingAnnouncements ? (

            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">

              <div className="text-3xl">
                ⏳
              </div>

              <p className="mt-3 text-sm text-slate-500">
                Loading announcements...
              </p>

            </div>

          ) : announcements.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">

              <div className="text-4xl">
                📢
              </div>

              <p className="mt-3 font-semibold text-slate-700">
                No announcements yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create your first tournament announcement above.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {announcements.map(
                (item) => (

                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >

                    {/* Image */}

                    {item.imageUrl ? (

                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">

                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                        />

                        <div className="absolute left-3 top-3">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                              item.isPublished
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.isPublished
                              ? 'Published'
                              : 'Draft'}
                          </span>

                        </div>

                      </div>

                    ) : (

                      <div className="relative flex aspect-[16/9] items-center justify-center bg-slate-100">

                        <span className="text-5xl">
                          📢
                        </span>

                        <div className="absolute left-3 top-3">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                              item.isPublished
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.isPublished
                              ? 'Published'
                              : 'Draft'}
                          </span>

                        </div>

                      </div>
                    )}

                    {/* Content */}

                    <div className="p-5">

                      <h3 className="text-lg font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {item.content}
                      </p>

                      <div className="mt-4 border-t border-slate-100 pt-3">

                        <p className="text-xs text-slate-400">
                          {formatDate(
                            item.createdAt,
                          )}
                        </p>

                        {/* Actions */}

                        <div className="mt-3 grid grid-cols-3 gap-2">

                          {/* Edit */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                item,
                              )
                            }
                            className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            ✏️ Edit
                          </button>

                          {/* Publish */}

                          <button
                            type="button"
                            disabled={
                              actionId ===
                              item.id
                            }
                            onClick={() =>
                              handleTogglePublish(
                                item,
                              )
                            }
                            className={`rounded-lg border px-2 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              item.isPublished
                                ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {actionId ===
                            item.id
                              ? '...'
                              : item.isPublished
                                ? 'Hide'
                                : 'Publish'}
                          </button>

                          {/* Delete */}

                          <button
                            type="button"
                            disabled={
                              actionId ===
                              item.id
                            }
                            onClick={() =>
                              handleDelete(
                                item.id,
                              )
                            }
                            className="rounded-lg border border-red-200 bg-red-50 px-2 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            🗑️ Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>
                ),
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Announcements;