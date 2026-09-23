import api from './api';

export interface UploadResponse {
  url: string;
  fileName: string;
}

export const uploadAPI = {
  image: async (file: File) => {
    const formData = new FormData();

    formData.append('file', file);

    const response = await api.post<UploadResponse>(
      '/uploads/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },
};