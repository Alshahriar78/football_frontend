
import React, { useEffect, useState } from 'react';

import { galleryAPI } from '../../services/galleryService';

import type {
  GalleryItem,
  UpdateGalleryData,
} from '../../services/galleryService';

import { uploadAPI } from '../../services/uploadService';

const Gallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // =========================
  // Form State
  // =========================

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // =========================
  // Image State
  // =========================

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState('');

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

  const [loading, setLoading] =
    useState(false);

  const [loadingGallery, setLoadingGallery] =
    useState(true);

  const [actionId, setActionId] =
    useState<number | null>(null);

  // =========================
  // Error
  // =========================

  const [error, setError] = useState('');

  // =========================
  // Load Gallery
  // =========================

  const loadGallery = async () => {
    try {
      setLoadingGallery(true);
      setError('');

      const data = await galleryAPI.getAll();

      setGallery(data);
    } catch (error) {
      console.error(
        'Failed to load gallery:',
        error,
      );

      setError(
        'Failed to load gallery.',
      );
    } finally {
      setLoadingGallery(false);
    }
  };

  useEffect(() => {
    loadGallery();
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

    // File type validation
    if (!allowedTypes.includes(file.type)) {
      setError(
        'Only JPG, JPEG, PNG and WEBP images are allowed.',
      );

      return;
    }

    // 5MB validation
    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        'Image size must be less than 5MB.',
      );

      return;
    }

    // Clean previous preview URL
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
        'gallery-image',
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
    setCategory('');
    setDescription('');
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
    item: GalleryItem,
  ) => {
    setError('');

    setEditingId(item.id);

    setTitle(item.title);

    setCategory(
      item.category || '',
    );

    setDescription(
      item.description || '',
    );

    setIsPublished(
      item.isPublished,
    );

    setCurrentImageUrl(
      item.imageUrl,
    );

    // Remove newly selected image
    removeImage();

    // Scroll to form
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

    // Create mode requires image
    if (
      editingId === null &&
      !selectedFile
    ) {
      setError(
        'Please select an image.',
      );

      return;
    }

    try {
      setLoading(true);

      let imageUrl =
        currentImageUrl;

      // Upload image only when:
      // 1. Creating
      // 2. Editing and new image selected
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
        const updateData: UpdateGalleryData =
          {
            title: title.trim(),
            imageUrl,
            description:
              description.trim() ||
              undefined,
            category:
              category.trim() ||
              undefined,
            isPublished,
          };

        await galleryAPI.update(
          editingId,
          updateData,
        );

        alert(
          'Gallery image updated successfully!',
        );
      }

      // =========================
      // Create
      // =========================

      else {
        await galleryAPI.create({
          title: title.trim(),
          imageUrl,
          description:
            description.trim() ||
            undefined,
          category:
            category.trim() ||
            undefined,
          isPublished,
        });

        alert(
          'Gallery image added successfully!',
        );
      }

      resetForm();

      await loadGallery();
    } catch (error: any) {
      console.error(
        'Gallery operation failed:',
        error,
      );

      setError(
        error?.response?.data?.message ||
          'Gallery operation failed.',
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
        'Are you sure you want to delete this gallery image?',
      );

    if (!confirmed) return;

    try {
      setActionId(id);
      setError('');

      await galleryAPI.remove(id);

      setGallery(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== id,
          ),
      );

      // If deleted item was being edited
      if (editingId === id) {
        resetForm();
      }

      alert(
        'Gallery image deleted successfully!',
      );
    } catch (error: any) {
      console.error(
        'Failed to delete gallery item:',
        error,
      );

      setError(
        error?.response?.data?.message ||
          'Failed to delete gallery image.',
      );
    } finally {
      setActionId(null);
    }
  };

  // =========================
  // Publish / Unpublish
  // =========================

  const handleTogglePublish = async (
    item: GalleryItem,
  ) => {
    try {
      setActionId(item.id);
      setError('');

      const updated =
        await galleryAPI.togglePublish(
          item.id,
        );

      setGallery(
        (previous) =>
          previous.map(
            (galleryItem) =>
              galleryItem.id === item.id
                ? updated
                : galleryItem,
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

        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Gallery
          </h1>

          <p className="mt-1 text-sm text-slate-500 md:text-base">
            Upload and manage tournament photos
          </p>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ================= FORM ================= */}

        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">

          <div className="mb-6 flex items-start justify-between gap-4">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingId !== null
                  ? 'Edit Gallery Image'
                  : 'Add Gallery Image'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId !== null
                  ? 'Update gallery information or replace the image.'
                  : 'Upload a tournament photo and add some information.'}
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

              {/* ================= IMAGE ================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Image
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
                        htmlFor="gallery-image"
                        className="absolute bottom-3 left-3 cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-md transition hover:bg-slate-50"
                      >
                        Replace Image
                      </label>

                      <input
                        id="gallery-image"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                    </div>

                  ) : (

                    <label
                      htmlFor="gallery-image"
                      className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 text-center transition hover:border-blue-400 hover:bg-blue-50"
                    >

                      <div className="mb-3 text-4xl">
                        📷
                      </div>

                      <p className="font-semibold text-slate-700">
                        Click to upload image
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        JPG, PNG, WEBP • Maximum 5MB
                      </p>

                      <input
                        id="gallery-image"
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

              {/* ================= FORM FIELDS ================= */}

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
                    placeholder="Example: Opening Ceremony"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Category */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <input
                    type="text"
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value,
                      )
                    }
                    placeholder="Example: Opening, Match, Final"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Description */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value,
                      )
                    }
                    placeholder="Write a short description..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Published */}

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={
                      isPublished
                    }
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
                      ? 'Update Gallery Image'
                      : 'Add Gallery Image'}
                </button>

              </div>
            </div>
          </form>
        </div>

        {/* ================= GALLERY LIST ================= */}

        <div>

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Gallery Images
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {gallery.length} image
                {gallery.length !== 1
                  ? 's'
                  : ''}
              </p>
            </div>

            <button
              onClick={loadGallery}
              disabled={
                loadingGallery
              }
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {loadingGallery
                ? 'Loading...'
                : 'Refresh'}
            </button>

          </div>

          {/* Loading */}

          {loadingGallery ? (

            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">

              <div className="text-3xl">
                ⏳
              </div>

              <p className="mt-3 text-sm text-slate-500">
                Loading gallery...
              </p>

            </div>

          ) : gallery.length === 0 ? (

            /* Empty */

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">

              <div className="text-4xl">
                🖼️
              </div>

              <p className="mt-3 font-semibold text-slate-700">
                No gallery images yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Upload your first tournament image above.
              </p>

            </div>

          ) : (

            /* Gallery Cards */

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {gallery.map(
                (item) => (

                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >

                    {/* Image */}

                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">

                      <img
                        src={
                          item.imageUrl
                        }
                        alt={
                          item.title
                        }
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />

                      {/* Status */}

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

                    {/* Content */}

                    <div className="p-4">

                      <h3 className="line-clamp-1 font-bold text-slate-900">
                        {item.title}
                      </h3>

                      {item.category && (
                        <p className="mt-1 text-xs font-semibold text-blue-600">
                          #
                          {
                            item.category
                          }
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                          {
                            item.description
                          }
                        </p>
                      )}

                      <div className="mt-4 border-t border-slate-100 pt-3">

                        <p className="text-xs text-slate-400">
                          {
                            formatDate(
                              item.createdAt,
                            )
                          }
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

export default Gallery;

