import axios from 'axios';

export const API_BASE_URL = 'http://127.0.0.1:8001';

/**
 * Axios instance with automatic JWT injection.
 * Every request automatically gets:  Authorization: Bearer <token>
 * If the server returns 401 (expired token), the user is logged out.
 */
const api = axios.create({ baseURL: API_BASE_URL });

// --- Request interceptor: attach token ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: handle expired tokens ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token expired or invalid → force logout
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.reload(); // will show LoginPage again
    }
    return Promise.reject(error);
  }
);

export default api;
