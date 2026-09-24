import api from './api';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  imageUrl?: string;
  isPublished?: boolean;
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  imageUrl?: string;
  isPublished?: boolean;
}

export const announcementAPI = {
  // Get all announcements
  getAll: async (): Promise<Announcement[]> => {
    const response = await api.get<Announcement[]>(
      '/announcements',
    );

    return response.data;
  },

  // Get published announcements
  getPublished: async (): Promise<Announcement[]> => {
    const response = await api.get<Announcement[]>(
      '/announcements/published',
    );

    return response.data;
  },

  // Get single announcement
  getById: async (
    id: number,
  ): Promise<Announcement> => {
    const response = await api.get<Announcement>(
      `/announcements/${id}`,
    );

    return response.data;
  },

  // Create announcement
  create: async (
    data: CreateAnnouncementData,
  ): Promise<Announcement> => {
    const response = await api.post<Announcement>(
      '/announcements',
      data,
    );

    return response.data;
  },

  // Update announcement
  update: async (
    id: number,
    data: UpdateAnnouncementData,
  ): Promise<Announcement> => {
    const response = await api.patch<Announcement>(
      `/announcements/${id}`,
      data,
    );

    return response.data;
  },

  // Publish / Unpublish
  togglePublish: async (
    id: number,
  ): Promise<Announcement> => {
    const response = await api.patch<Announcement>(
      `/announcements/${id}/toggle-publish`,
    );

    return response.data;
  },

  // Delete announcement
  remove: async (
    id: number,
  ): Promise<{ message: string }> => {
    const response = await api.delete<{
      message: string;
    }>(`/announcements/${id}`);

    return response.data;
  },
};