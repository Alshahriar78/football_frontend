import api from './api';

export interface LoginResponse {
  access_token: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export const authAPI = {
  login: async (data: LoginData) => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
};