/**
 * Car mapping layer — the single source of truth for translating between the
 * Prisma `Car` model and the API/frontend shape.
 *
 *   mapCarToApi(car)     Prisma record  → API response (every field guaranteed)
 *   mapCarFromApi(input) request body   → Prisma-ready data (safe coercion)
 *
 * Keeping this isolated means controllers never hand-roll coercion and the
 * frontend always receives a complete, predictable object.
 */

/* ── shared coercion helpers ─────────────────────────────── */

/** Accept an array, a JSON string, or a comma-separated string → string[]. */
export function parseStringArray(value) {
  if (value == null) return undefined;
  if (Array.isArray(value)) {
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed)
          ? parsed.map(String).map((s) => s.trim()).filter(Boolean)
          : [];
      } catch {
        /* fall through to CSV parsing */
      }
    }
    return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return undefined;
}

/** Coerce truthy form values ('true' / '1' / true) → boolean. */
export const toBool = (v) => v === true || v === 'true' || v === '1';

export const CAR_STATUSES = ['AVAILABLE', 'SOLD', 'UPCOMING'];

/** Normalize status from enum, legacy isSold, or default. */
export function normalizeStatus(car) {
  if (car?.status && CAR_STATUSES.includes(car.status)) return car.status;
  if (car?.isSold) return 'SOLD';
  return 'AVAILABLE';
}

/** Coerce to a rounded integer, or NaN when the value is not numeric. */
function toInt(value) {
  if (value === '' || value == null) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : NaN;
}

/* ── field catalogs (mirror schema.prisma `Car`) ─────────── */

const TEXT_FIELDS = [
  'title',
  'location',
  'model',
  'bodyType',
  'registrationCity',
  'fuelType',
  'enginePower',
  'transmission',
  'color',
  'description',
  'drivetrain',
  'condition',
];

const INT_FIELDS = ['price', 'mileage', 'year', 'seats'];

/* ── outbound: Prisma → API ──────────────────────────────── */

/**
 * Normalize a Prisma `Car` (or any car-like object) into the canonical API
 * shape. Every field the frontend expects is always present, so no consumer
 * breaks on a missing/null value.
 */
export function mapCarToApi(car) {
  if (!car) return null;

  return {
    id: car.id,
    title: car.title ?? '',
    price: car.price ?? 0,
    location: car.location ?? '',
    model: car.model ?? '',
    bodyType: car.bodyType ?? '',
    registrationCity: car.registrationCity ?? '',
    fuelType: car.fuelType ?? '',
    enginePower: car.enginePower ?? '',
    transmission: car.transmission ?? '',
    color: car.color ?? '',
    mileage: car.mileage ?? 0,
    year: car.year ?? 0,
    seats: car.seats ?? 0,
    drivetrain: car.drivetrain ?? '',
    condition: car.condition ?? '',
    features: Array.isArray(car.features) ? car.features : [],
    images: Array.isArray(car.images) ? car.images : [],
    isFeatured: Boolean(car.isFeatured),
    status: normalizeStatus(car),
    // Deprecated — kept for backward compatibility with older clients.
    isSold: normalizeStatus(car) === 'SOLD',
    createdAt: car.createdAt ?? null,
    updatedAt: car.updatedAt ?? null,
  };
}

/* ── inbound: API → Prisma ───────────────────────────────── */

/**
 * Convert an incoming request body into a Prisma-ready data object.
 *
 * - Only keys actually present in `input` are included, so the same function
 *   serves both create (full) and update (partial) flows.
 * - Strings are trimmed; integers are coerced (invalid → NaN so a validator
 *   can flag them); booleans and string-arrays are normalized.
 * - Missing/null values are skipped safely — never written as `null`.
 *
 * NOTE: `images` is intentionally NOT handled here — image persistence is the
 * controller's responsibility (Cloudinary uploads + `existingImages` merge).
 */
export function mapCarFromApi(input = {}) {
  const data = {};

  for (const field of TEXT_FIELDS) {
    const value = input[field];
    if (value !== undefined && value !== null) {
      data[field] = String(value).trim();
    }
  }

  for (const field of INT_FIELDS) {
    const coerced = toInt(input[field]);
    if (coerced !== undefined) data[field] = coerced;
  }

  if (input.isFeatured !== undefined) data.isFeatured = toBool(input.isFeatured);

  // Status: prefer explicit enum; fall back to legacy isSold boolean.
  if (input.status !== undefined && input.status !== null && input.status !== '') {
    const status = String(input.status).toUpperCase();
    if (CAR_STATUSES.includes(status)) data.status = status;
  } else if (input.isSold !== undefined) {
    data.status = toBool(input.isSold) ? 'SOLD' : 'AVAILABLE';
  }

  const features = parseStringArray(input.features);
  if (features !== undefined) data.features = features;

  return data;
}
