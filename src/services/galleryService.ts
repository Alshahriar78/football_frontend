
import api from './api';

export interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string;
  description?: string;
  category?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface CreateGalleryData {
  title: string;
  imageUrl: string;
  description?: string;
  category?: string;
  isPublished?: boolean;
}

export interface UpdateGalleryData {
  title?: string;
  imageUrl?: string;
  description?: string;
  category?: string;
  isPublished?: boolean;
}

export const galleryAPI = {
  // Get all gallery items
  getAll: async (): Promise<GalleryItem[]> => {
    const response = await api.get<GalleryItem[]>('/gallery');

    return response.data;
  },

  // Get published gallery items
  getPublished: async (): Promise<GalleryItem[]> => {
    const response = await api.get<GalleryItem[]>(
      '/gallery/published',
    );

    return response.data;
  },

  // Get single gallery item
  getById: async (
    id: number,
  ): Promise<GalleryItem> => {
    const response = await api.get<GalleryItem>(
      `/gallery/${id}`,
    );

    return response.data;
  },

  // Create gallery item
  create: async (
    data: CreateGalleryData,
  ): Promise<GalleryItem> => {
    const response = await api.post<GalleryItem>(
      '/gallery',
      data,
    );

    return response.data;
  },

  // Update gallery item
  update: async (
    id: number,
    data: UpdateGalleryData,
  ): Promise<GalleryItem> => {
    const response = await api.patch<GalleryItem>(
      `/gallery/${id}`,
      data,
    );

    return response.data;
  },

  // Publish / Unpublish
  togglePublish: async (
    id: number,
  ): Promise<GalleryItem> => {
    const response = await api.patch<GalleryItem>(
      `/gallery/${id}/toggle-publish`,
    );

    return response.data;
  },

  // Delete gallery item
  remove: async (
    id: number,
  ): Promise<{ message: string }> => {
    const response = await api.delete<{
      message: string;
    }>(`/gallery/${id}`);

    return response.data;
  },
};

