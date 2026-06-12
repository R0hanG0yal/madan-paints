import axios from 'axios';

// In production, API is served from the same origin (set VITE_API_URL=/api)
// In development, defaults to localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'https://madan-paints-f415.onrender.com';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true // Send httpOnly cookies with every request
});

API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Don't redirect on /auth/me — AuthContext handles it gracefully
      if (!url.includes('/auth/me')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
