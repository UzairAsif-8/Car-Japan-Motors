/**
 * Lightweight, dependency-free request validators.
 * Each validator collects field errors and throws a single 400 ApiError with
 * a `details` map, keeping responses predictable for the frontend.
 */
import ApiError from '../utils/ApiError.js';

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return EMAIL_RE.test(email.trim());
}

function fail(errors) {
  if (Object.keys(errors).length) {
    throw ApiError.badRequest('Validation failed', errors);
  }
}

export function validateLogin(req, _res, next) {
  const { email, password } = req.body;
  const errors = {};
  if (!isNonEmptyString(email)) errors.email = 'Email is required';
  if (!isNonEmptyString(password)) errors.password = 'Password is required';
  fail(errors);
  next();
}

export function validateChangeEmail(req, _res, next) {
  const { currentEmail, newEmail, currentPassword } = req.body;
  const errors = {};
  if (!isNonEmptyString(currentPassword)) errors.currentPassword = 'Current password is required';
  if (!isNonEmptyString(currentEmail)) {
    errors.currentEmail = 'Current email is required';
  } else if (!isValidEmail(currentEmail)) {
    errors.currentEmail = 'Enter a valid email address';
  }
  if (!isNonEmptyString(newEmail)) {
    errors.newEmail = 'New email is required';
  } else if (!isValidEmail(newEmail)) {
    errors.newEmail = 'Enter a valid email address';
  }
  fail(errors);
  next();
}

export function validateChangePassword(req, _res, next) {
  const { currentPassword, newPassword } = req.body;
  const errors = {};
  if (!isNonEmptyString(currentPassword)) errors.currentPassword = 'Current password is required';
  if (!isNonEmptyString(newPassword)) {
    errors.newPassword = 'New password is required';
  } else if (newPassword.length < 8) {
    errors.newPassword = 'Password must be at least 8 characters';
  }
  fail(errors);
  next();
}

export function validateReview(req, _res, next) {
  const { name, rating, comment } = req.body;
  const errors = {};
  if (!isNonEmptyString(name)) errors.name = 'Name is required';
  if (!isNonEmptyString(comment)) errors.comment = 'Comment is required';
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) errors.rating = 'Rating must be an integer between 1 and 5';
  fail(errors);
  // Normalize for the controller.
  req.body.rating = r;
  next();
}

export function validateInquiry(req, _res, next) {
  const { name, phone, message } = req.body;
  const errors = {};
  if (!isNonEmptyString(name)) errors.name = 'Name is required';
  if (!isNonEmptyString(phone)) errors.phone = 'Phone is required';
  if (!isNonEmptyString(message)) errors.message = 'Message is required';
  fail(errors);
  next();
}

const INQUIRY_STATUSES = ['NEW', 'CONTACTED', 'CLOSED'];

export function validateInquiryStatus(req, _res, next) {
  const { status } = req.body;
  if (!INQUIRY_STATUSES.includes(status)) {
    throw ApiError.badRequest('Validation failed', {
      status: `Status must be one of: ${INQUIRY_STATUSES.join(', ')}`,
    });
  }
  next();
}
