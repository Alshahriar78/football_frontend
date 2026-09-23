import axios from 'axios';
import { authStorage } from '../utils/auth';

const api = axios.create({
  baseURL: 'https://backend-production-ced4f.up.railway.app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;