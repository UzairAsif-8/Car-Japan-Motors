import axios from 'axios';

/**
 * Central axios instance. The whole app talks to the backend through this.
 *
 * `API_ENABLED` is the single switch that flips the app between mock mode and
 * live mode. Set VITE_API_BASE_URL in your .env to point at Express and every
 * service automatically begins making real HTTP calls.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const API_ENABLED = Boolean(API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

const TOKEN_KEY = 'cj_admin_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// Attach JWT to every request once authenticated.
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

/** Simulate realistic network latency in mock mode. */
export const mockDelay = (ms = 650) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default api;
