import axios from 'axios';

const API_BASE_URL = 'https://football-backend-hqio.onrender.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const teamAPI = {
  getAll: () => api.get('/teams'),
  getById: (id: number) => api.get(`/teams/${id}`),
  create: (data: any) => api.post('/teams', data),
  update: (id: number, data: any) => api.put(`/teams/${id}`, data),
  delete: (id: number) => api.delete(`/teams/${id}`),
};

export const playerAPI = {
  getAll: () => api.get('/players'),
  getById: (id: number) => api.get(`/players/${id}`),
  create: (data: any) => api.post('/players', data),
  update: (id: number, data: any) => api.put(`/players/${id}`, data),
  delete: (id: number) => api.delete(`/players/${id}`),
};

export const matchAPI = {
  getAll: () => api.get('/matches'),
  getById: (id: number) => api.get(`/matches/${id}`),
  create: (data: any) => api.post('/matches', data),
  update: (id: number, data: any) => api.put(`/matches/${id}`, data),
  delete: (id: number) => api.delete(`/matches/${id}`),
};