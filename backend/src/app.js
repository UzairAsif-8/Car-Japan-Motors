/**
 * Express application setup: middleware, CORS, routes, error handling.
 * Exported separately from the HTTP server so it can be imported in tests.
 */
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import carRoutes from './routes/car.routes.js';
import reviewRoutes from './routes/review.routes.js';
import inquiryRoutes from './routes/inquiry.routes.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

/* ── CORS ─────────────────────────────────────────────────── */
// Allow configured frontend origins + any localhost during development.
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser tools (curl/Postman) which send no origin.
    if (!origin) return callback(null, true);
    const isLocalhost = /^https?:\/\/localhost(:\d+)?$/.test(origin);
    if (isLocalhost || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));

/* ── Body parsers ─────────────────────────────────────────── */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/* ── Health check ─────────────────────────────────────────── */
app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'ok', service: 'car-japan-backend' });
});

/* ── Routes ───────────────────────────────────────────────── */
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api', reviewRoutes); // /api/reviews, /api/admin/reviews, /api/reviews/:id/(approve|reject)
app.use('/api', inquiryRoutes); // /api/inquiries, /api/admin/inquiries, /api/inquiries/:id/status

/* ── Errors ───────────────────────────────────────────────── */
app.use(notFound);
app.use(errorHandler);

export default app;
