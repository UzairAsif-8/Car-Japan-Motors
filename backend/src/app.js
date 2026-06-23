/**
 * Express application setup: middleware, CORS, routes, error handling.
 */

import express from 'express';

import corsMiddleware from './config/cors.js';
import authRoutes from './routes/auth.routes.js';
import carRoutes from './routes/car.routes.js';
import reviewRoutes from './routes/review.routes.js';
import inquiryRoutes from './routes/inquiry.routes.js';
import statsRoutes from './routes/stats.routes.js';
import videoRoutes from './routes/video.routes.js';

import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

/* ───────────────────────────────
   CORS — must run before routes
────────────────────────────── */
app.use(corsMiddleware);

/* ───────────────────────────────
   BODY PARSERS
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
app.use('/api/admin/stats', statsRoutes);
app.use('/api/videos', videoRoutes);

/* ───────────────────────────────
   ERROR HANDLING
────────────────────────────── */
app.use(notFound);
app.use(errorHandler);

export default app;
