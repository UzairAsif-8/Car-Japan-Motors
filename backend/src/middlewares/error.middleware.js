/**
 * Centralized error handling.
 *
 *  - `notFound`     : 404 for unmatched routes.
 *  - `errorHandler` : normalizes ApiError, Prisma, Multer and JWT errors into a
 *                     consistent JSON shape: { success:false, message, details? }.
 */
import { Prisma } from '@prisma/client';
import multer from 'multer';
import ApiError from '../utils/ApiError.js';

export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details;

  // Known Prisma request errors → friendly messages.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        statusCode = 409;
        message = `A record with this ${err.meta?.target?.join(', ') || 'value'} already exists`;
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      default:
        statusCode = 400;
        message = 'Database request error';
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'Image exceeds the size limit' : err.message;
  }

  if (statusCode >= 500) {
    console.error('💥', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}
