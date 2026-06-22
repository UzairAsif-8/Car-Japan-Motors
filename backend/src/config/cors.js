/**
 * CORS allow-list for the Car Japan Motors API.
 *
 * Production origins are always permitted. `CLIENT_URL` (comma-separated) adds
 * extra origins — useful for Vercel previews or staging domains.
 * Localhost is allowed automatically when NODE_ENV !== 'production'.
 */
import cors from 'cors';

const DEFAULT_PRODUCTION_ORIGINS = [
  'https://www.carjapanmotors.com',
  'https://carjapanmotors.com',
];

const DEV_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

function parseOrigins(value) {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function buildAllowedOrigins() {
  const fromEnv = parseOrigins(process.env.CLIENT_URL);
  const origins = new Set([...DEFAULT_PRODUCTION_ORIGINS, ...fromEnv]);

  if (process.env.NODE_ENV !== 'production') {
    DEV_ORIGINS.forEach((origin) => origins.add(origin));
  }

  return origins;
}

const allowedOrigins = buildAllowedOrigins();

function isVercelPreview(origin) {
  try {
    return new URL(origin).hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  return allowedOrigins.has(origin) || isVercelPreview(origin);
}

export const corsOptions = {
  origin(origin, callback) {
    // Server-to-server tools, curl, Postman — no Origin header.
    if (!origin) return callback(null, true);

    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[CORS] Blocked origin: ${origin}`);
    }

    // Reject without throwing — avoids 500s on preflight.
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

/** Express middleware — mount before routes and body parsers. */
export default cors(corsOptions);
