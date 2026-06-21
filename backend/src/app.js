/**
 * Express application setup: middleware, CORS, routes, error handling.
 */

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import carRoutes from './routes/car.routes.js';
import reviewRoutes from './routes/review.routes.js';
import inquiryRoutes from './routes/inquiry.routes.js';

import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

/* ───────────────────────────────
   CORS CONFIG (PRODUCTION SAFE)
────────────────────────────── */

const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server or Postman requests
    if (!origin) return callback(null, true);

    const isLocalhost =
      origin.includes('localhost') ||
      origin.includes('127.0.0.1');

    const isAllowed = allowedOrigins.includes(origin);

    if (isLocalhost || isAllowed) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));

/* ───────────────────────────────
   MIDDLEWARES
────────────────────────────── */

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/* ───────────────────────────────
   HEALTH CHECK
────────────────────────────── */

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'car-japan-backend',
  });
});

/* ───────────────────────────────
   ROUTES
────────────────────────────── */

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api', reviewRoutes);
app.use('/api', inquiryRoutes);

/* ───────────────────────────────
   ERROR HANDLING
────────────────────────────── */

app.use(notFound);
app.use(errorHandler);

export default app;