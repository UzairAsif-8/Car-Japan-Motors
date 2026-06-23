/**
 * Car controller.
 *  - Public:  list (with filters) + detail.
 *  - Admin:   create / update / delete, with Cloudinary image handling.
 */
import prisma from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { uploadImages, destroyByUrl } from '../services/cloudinary.service.js';
import { mapCarToApi, mapCarFromApi, parseStringArray, toBool, CAR_STATUSES } from '../utils/carMapper.js';

/* ── helpers ─────────────────────────────────────────────── */

// Essentials the admin form always provides.
const REQUIRED_TEXT = ['title', 'model', 'bodyType', 'fuelType', 'transmission'];
// Stored, but optional — defaulted to '' on create so NOT NULL columns are satisfied.
const OPTIONAL_TEXT = ['location', 'registrationCity', 'enginePower', 'color', 'description'];

// Numeric fields that, when supplied, must be valid non-negative integers.
// `price` / `mileage` are also required on create; the rest are optional and
// fall back to schema defaults — preserving backward compatibility.
const REQUIRED_INT = ['price', 'mileage'];
const OPTIONAL_INT = ['year', 'seats'];

/**
 * Coerce the multipart/JSON body into Prisma-ready data and validate it.
 * Normalization is delegated to `mapCarFromApi`; this layer only enforces
 * required fields and value ranges. `partial` relaxes required checks (updates).
 */
function buildCarData(body, { partial = false } = {}) {
  const data = mapCarFromApi(body);
  const errors = {};

  for (const field of REQUIRED_TEXT) {
    if (data[field] !== undefined) {
      if (!data[field]) errors[field] = `${field} is required`;
    } else if (!partial) {
      errors[field] = `${field} is required`;
    }
  }

  for (const field of REQUIRED_INT) {
    if (data[field] !== undefined) {
      if (!Number.isFinite(data[field]) || data[field] < 0) {
        errors[field] = `${field} must be a positive number`;
      }
    } else if (!partial) {
      errors[field] = `${field} is required`;
    }
  }

  for (const field of OPTIONAL_INT) {
    if (data[field] !== undefined && (!Number.isFinite(data[field]) || data[field] < 0)) {
      errors[field] = `${field} must be a valid number`;
    }
  }

  // Default optional text + features on create so NOT NULL columns are satisfied.
  if (!partial) {
    for (const field of OPTIONAL_TEXT) {
      if (data[field] === undefined) data[field] = '';
    }
    if (data.features === undefined) data.features = [];
  }

  if (Object.keys(errors).length) throw ApiError.badRequest('Validation failed', errors);
  return data;
}

/* ── public ──────────────────────────────────────────────── */

// GET /api/cars  — supports filters: ?search&bodyType&fuelType&transmission&minPrice&maxPrice&featured&status&sold&sort
export const getCars = asyncHandler(async (req, res) => {
  const { search, bodyType, fuelType, transmission, minPrice, maxPrice, featured, status, sold, sort } = req.query;

  const where = {};
  if (bodyType) where.bodyType = bodyType;
  if (fuelType) where.fuelType = fuelType;
  if (transmission) where.transmission = transmission;
  if (featured !== undefined) where.isFeatured = toBool(featured);

  // Status filter — `status` takes precedence; `sold` is a legacy alias.
  if (status) {
    const normalized = String(status).toUpperCase();
    if (CAR_STATUSES.includes(normalized)) where.status = normalized;
  } else if (sold !== undefined) {
    where.status = toBool(sold) ? 'SOLD' : 'AVAILABLE';
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { model: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
      { color: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy = (() => {
    switch (sort) {
      case 'price-asc': return { price: 'asc' };
      case 'price-desc': return { price: 'desc' };
      case 'oldest': return { createdAt: 'asc' };
      default: return { createdAt: 'desc' };
    }
  })();

  const cars = await prisma.car.findMany({ where, orderBy });
  res.json({ success: true, count: cars.length, data: cars.map(mapCarToApi) });
});

// GET /api/cars/:id
export const getCarById = asyncHandler(async (req, res) => {
  const car = await prisma.car.findUnique({ where: { id: req.params.id } });
  if (!car) throw ApiError.notFound('Car not found');
  res.json({ success: true, data: mapCarToApi(car) });
});

/* ── admin ───────────────────────────────────────────────── */

// POST /api/cars  (admin, multipart: fields + `images` files)
export const createCar = asyncHandler(async (req, res) => {
  const data = buildCarData(req.body, { partial: false });

  // Images: kept/pasted URLs (existingImages or images) first, then uploaded files.
  const uploaded = await uploadImages(req.files || []);
  const bodyUrls =
    parseStringArray(req.body.existingImages) || parseStringArray(req.body.images) || [];
  data.images = [...bodyUrls, ...uploaded];

  const car = await prisma.car.create({ data });
  res.status(201).json({ success: true, data: mapCarToApi(car) });
});

// PUT /api/cars/:id  (admin)
export const updateCar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.car.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Car not found');

  const data = buildCarData(req.body, { partial: true });

  // Image strategy:
  //  - `existingImages` (JSON/CSV) = URLs to KEEP.
  //  - any uploaded files are appended.
  //  - if neither is supplied, images are left untouched.
  const keep = parseStringArray(req.body.existingImages);
  const uploaded = await uploadImages(req.files || []);

  if (keep !== undefined || uploaded.length) {
    const nextImages = [...(keep ?? existing.images), ...uploaded];
    data.images = nextImages;

    // Clean up images that were removed from Cloudinary (best-effort).
    if (keep !== undefined) {
      const removed = existing.images.filter((url) => !nextImages.includes(url));
      await Promise.all(removed.map(destroyByUrl));
    }
  }

  const car = await prisma.car.update({ where: { id }, data });
  res.json({ success: true, data: mapCarToApi(car) });
});

// DELETE /api/cars/:id  (admin)
export const deleteCar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.car.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Car not found');

  await prisma.car.delete({ where: { id } });
  // Remove associated Cloudinary assets (best-effort, non-blocking failures).
  await Promise.all((existing.images || []).map(destroyByUrl));

  res.json({ success: true, message: 'Car deleted' });
});

// PATCH /api/cars/:id/status  (admin) — quick status change from the dashboard table.
export const updateCarStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const status = String(req.body?.status || '').toUpperCase();

  if (!CAR_STATUSES.includes(status)) {
    throw ApiError.badRequest('Invalid status', {
      status: `Must be one of: ${CAR_STATUSES.join(', ')}`,
    });
  }

  const existing = await prisma.car.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Car not found');

  const car = await prisma.car.update({ where: { id }, data: { status } });
  res.json({ success: true, data: mapCarToApi(car) });
});
