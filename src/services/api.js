import axios from 'axios';

/**
 * Central axios instance. The whole app talks to the backend through this.
 *
 * Mock-data behaviour:
 *   - Mock data is ONLY used during LOCAL DEVELOPMENT and ONLY when no API URL
 *     is configured. This keeps `npm run dev` working out of the box.
 *   - PRODUCTION builds ALWAYS use the real API. If the API URL is missing or
 *     the API fails, the app shows loading / error / empty states — it must
 *     NEVER silently fall back to bundled dummy data in production.
 *
 * `API_ENABLED === true` means "call the real backend". Services branch on it.
 */
// Production backend. Used as a hard fallback so the deployed bundle ALWAYS
// reaches the live API even if the Vercel build never received an env var.
// A configured VITE_API_BASE_URL (env file or Vercel dashboard) takes priority.
const PROD_FALLBACK_API = 'https://car-japan-motors.onrender.com';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? PROD_FALLBACK_API : '');

// Mock mode = dev build AND no API URL configured. Nothing else.
export const USE_MOCK_DATA = import.meta.env.DEV && !API_BASE_URL;

// Real API is used everywhere except local-dev-without-a-URL.
export const API_ENABLED = !USE_MOCK_DATA;

// One-line config marker so the deployed bundle's wiring is verifiable from
// the browser console (helps confirm the build received VITE_API_BASE_URL).
// eslint-disable-next-line no-console
console.info(
  `[CarJapan] mode=${import.meta.env.MODE} · api=${API_BASE_URL || '(none)'} · live=${API_ENABLED}`
);

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

// Verbose request/response/error tracing — DEV only (kept out of production).
if (import.meta.env.DEV) {
  api.interceptors.request.use((config) => {
    // eslint-disable-next-line no-console
    console.debug(
      '[api →]',
      (config.method || 'get').toUpperCase(),
      `${config.baseURL || ''}${config.url}`,
      config.params ?? ''
    );
    return config;
  });
  api.interceptors.response.use(
    (res) => {
      const count = Array.isArray(res.data?.data) ? `(${res.data.data.length} items)` : '';
      // eslint-disable-next-line no-console
      console.debug('[api ←]', res.status, res.config?.url, count);
      return res;
    },
    (err) => {
      // eslint-disable-next-line no-console
      console.error('[api ✕]', err?.config?.url, '·', err?.message);
      return Promise.reject(err);
    }
  );
}

/** Simulate realistic network latency in mock mode. */
export const mockDelay = (ms = 650) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default api;
