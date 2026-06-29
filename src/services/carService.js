import api, { API_ENABLED, mockDelay } from './api';
import { CAR_STATUS } from '../constants';

// Mock data is loaded ONLY in local-dev mock mode via a dynamic import, so the
// bundled dummy vehicles are statically removed from production builds.
async function loadMockCars() {
  const { default: CARS } = await import('../data/cars');
  return CARS;
}

/**
 * Vehicle data access layer.
 *
 * Components only ever call these functions. Today they resolve mock data;
 * the moment VITE_API_BASE_URL is set they call the matching Express routes:
 *   GET    /api/cars
 *   GET    /api/cars/:id
 *   POST   /api/cars        (multipart: fields + image files)
 *   PUT    /api/cars/:id
 *   PATCH  /api/cars/:id/status
 *   DELETE /api/cars/:id
 * The function signatures and return shapes (the frontend car shape) never change —
 * the mappers below are the single seam translating to/from the backend shape.
 */

/* ── mapping seam (backend ↔ frontend shape) ─────────────── */

function normalizeStatus(c) {
  if (c?.status && Object.values(CAR_STATUS).includes(c.status)) return c.status;
  if (c?.isSold) return CAR_STATUS.SOLD;
  return CAR_STATUS.AVAILABLE;
}

/** Backend Car (id/title/fuelType…) → frontend car (_id/name/fuel…). */
function mapCarFromApi(c) {
  if (!c) return c;
  const title = c.title || '';
  const status = normalizeStatus(c);
  return {
    _id: c.id,
    name: title,
    // Backend has no separate make/variant; derive a make for badges/filters.
    make: c.make || title.split(' ')[0] || '',
    model: c.model || '',
    variant: c.variant || '',
    year: c.year ?? '',
    price: c.price ?? 0,
    mileage: c.mileage ?? 0,
    transmission: c.transmission || '',
    fuel: c.fuelType || '',
    bodyType: c.bodyType || '',
    engine: c.enginePower || '',
    color: c.color || '',
    registration: c.registrationCity || '',
    drivetrain: c.drivetrain || '',
    seats: c.seats ?? '',
    featured: Boolean(c.isFeatured),
    status,
    isSold: status === CAR_STATUS.SOLD,
    condition: c.condition || '',
    images: Array.isArray(c.images) ? c.images : [],
    highlights: Array.isArray(c.features) ? c.features : [],
    description: c.description || '',
    location: c.location || '',
  };
}

/** Build query params for GET /api/cars from the frontend filter shape. */
function buildApiParams(params = {}) {
  const {
    status,
    sold,
    featured,
    sort,
    search,
    bodyType,
    fuel,
    transmission,
    minPrice,
    maxPrice,
    admin,
  } = params;

  const apiParams = {};

  if (!admin) {
    if (status) apiParams.status = status;
    else if (sold === true || sold === 'true') apiParams.status = CAR_STATUS.SOLD;
    else if (sold === false || sold === 'false') apiParams.status = CAR_STATUS.AVAILABLE;
  }

  if (featured) apiParams.featured = true;
  if (sort && sort !== 'featured' && sort !== 'year-desc' && sort !== 'mileage-asc') {
    apiParams.sort = sort;
  }
  if (search) apiParams.search = search;
  if (bodyType) apiParams.bodyType = bodyType;
  if (fuel) apiParams.fuelType = fuel;
  if (transmission) apiParams.transmission = transmission;
  if (minPrice != null) apiParams.minPrice = minPrice;
  if (maxPrice != null) apiParams.maxPrice = maxPrice;

  return apiParams;
}

/** Frontend car payload → multipart FormData for the backend. */
function buildCarFormData(payload = {}) {
  const fd = new FormData();
  const status = payload.status || CAR_STATUS.AVAILABLE;
  const fields = {
    title: payload.name || `${payload.make || ''} ${payload.model || ''}`.trim(),
    price: payload.price,
    location: payload.registration || payload.location || '',
    model: payload.model || '',
    bodyType: payload.bodyType || '',
    registrationCity: payload.registration || '',
    fuelType: payload.fuel || '',
    enginePower: payload.engine || '',
    transmission: payload.transmission || '',
    color: payload.color || '',
    mileage: payload.mileage,
    year: payload.year,
    seats: payload.seats,
    drivetrain: payload.drivetrain || '',
    condition: payload.condition || 'Used',
    description: payload.description || '',
    isFeatured: payload.featured ? 'true' : 'false',
    status,
  };
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v);
  });
  fd.append('features', JSON.stringify(payload.highlights || []));
  // URLs to keep (existing + pasted); uploaded files go under `images`.
  fd.append('existingImages', JSON.stringify(payload.imageUrls || []));
  (payload.imageFiles || []).forEach((file) => fd.append('images', file));
  return fd;
}

const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } };

/** Longer timeout for read requests — Render free tier cold starts can exceed 15s. */
const VEHICLE_READ_TIMEOUT = 45000;

function parseVehicleListResponse(data) {
  if (!data || data.success === false) {
    throw new Error(data?.message || 'Failed to load vehicles');
  }
  if (!Array.isArray(data.data)) {
    throw new Error('Invalid vehicle data received from server');
  }
  return data.data.map(mapCarFromApi);
}

function parseVehicleResponse(data) {
  if (!data || data.success === false) {
    throw new Error(data?.message || 'Failed to load vehicle');
  }
  if (!data.data) {
    throw new Error('Vehicle not found');
  }
  return mapCarFromApi(data.data);
}

const applyQuery = (cars, params = {}) => {
  let result = [...cars];
  const {
    search,
    make,
    model,
    year,
    transmission,
    fuel,
    bodyType,
    minPrice,
    maxPrice,
    featured,
    status,
    sort,
  } = params;

  if (status) {
    result = result.filter((c) => (c.status || CAR_STATUS.AVAILABLE) === status);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter((c) =>
      [c.name, c.make, c.model, c.variant]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }
  if (make) result = result.filter((c) => c.make === make);
  if (model) result = result.filter((c) => c.model === model);
  if (year) result = result.filter((c) => c.year === Number(year));
  if (transmission) result = result.filter((c) => c.transmission === transmission);
  if (fuel) result = result.filter((c) => c.fuel === fuel);
  if (bodyType) result = result.filter((c) => c.bodyType === bodyType);
  if (minPrice != null) result = result.filter((c) => c.price >= Number(minPrice));
  if (maxPrice != null) result = result.filter((c) => c.price <= Number(maxPrice));
  if (featured) result = result.filter((c) => c.featured);

  switch (sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'year-desc':
      result.sort((a, b) => b.year - a.year);
      break;
    case 'mileage-asc':
      result.sort((a, b) => a.mileage - b.mileage);
      break;
    default:
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return result;
};

export async function getCars(params = {}) {
  if (API_ENABLED) {
    const { data } = await api.get('/api/cars', {
      params: buildApiParams(params),
      timeout: VEHICLE_READ_TIMEOUT,
    });
    const cars = parseVehicleListResponse(data);
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[getCars] source=API count=', cars.length);
    }
    return applyQuery(cars, params);
  }
  if (import.meta.env.DEV) {
    const CARS = await loadMockCars();
    await mockDelay();
    // eslint-disable-next-line no-console
    console.debug('[getCars] source=MOCK count=', CARS.length);
    return applyQuery(CARS, params);
  }
  throw new Error('Vehicle API is not configured');
}

export const getAvailableCars = (params = {}) => getCars({ ...params, status: CAR_STATUS.AVAILABLE });
export const getSoldCars = (params = {}) => getCars({ ...params, status: CAR_STATUS.SOLD });
export const getUpcomingCars = (params = {}) => getCars({ ...params, status: CAR_STATUS.UPCOMING });
export const getAdminCars = () => getCars({ admin: true });

export async function getCarById(id) {
  if (API_ENABLED) {
    const { data } = await api.get(`/api/cars/${id}`, { timeout: VEHICLE_READ_TIMEOUT });
    return parseVehicleResponse(data);
  }
  if (import.meta.env.DEV) {
    const CARS = await loadMockCars();
    await mockDelay(500);
    const car = CARS.find((c) => c._id === id);
    if (!car) throw new Error('Vehicle not found');
    return car;
  }
  throw new Error('Vehicle not found');
}

export async function getFeaturedCars(limit = 12) {
  const cars = await getCars({ status: CAR_STATUS.AVAILABLE, featured: true });
  return cars.slice(0, limit);
}

export async function getSimilarCars(car, limit = 4) {
  if (!car) return [];
  const all = await getAvailableCars();
  return all
    .filter((c) => c._id !== car._id)
    .map((c) => ({
      car: c,
      score:
        (c.make === car.make ? 2 : 0) +
        (c.bodyType === car.bodyType ? 2 : 0) +
        (Math.abs(c.price - car.price) < 3000000 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.car);
}

export async function getDashboardStats() {
  if (API_ENABLED) {
    const { data } = await api.get('/api/admin/stats/dashboard');
    return data?.data;
  }
  if (import.meta.env.DEV) {
    const CARS = await loadMockCars();
    await mockDelay(300);
    const available = CARS.filter((c) => (c.status || CAR_STATUS.AVAILABLE) === CAR_STATUS.AVAILABLE).length;
    const sold = CARS.filter((c) => c.status === CAR_STATUS.SOLD).length;
    const upcoming = CARS.filter((c) => c.status === CAR_STATUS.UPCOMING).length;
    return {
      totalCars: CARS.length,
      available,
      sold,
      upcoming,
      totalInquiries: 0,
      totalReviews: 0,
    };
  }
  return null;
}

// Admin-only mutations. In live mode they send multipart/form-data so image
// files stream through to Cloudinary on the backend.
export async function createCar(payload) {
  if (API_ENABLED) {
    const { data } = await api.post('/api/cars', buildCarFormData(payload), MULTIPART);
    return mapCarFromApi(data?.data);
  }
  await mockDelay();
  return { ...payload, status: payload.status || CAR_STATUS.AVAILABLE, images: payload.images || [], _id: `cj-${Date.now()}` };
}

export async function updateCar(id, payload) {
  if (API_ENABLED) {
    const { data } = await api.put(`/api/cars/${id}`, buildCarFormData(payload), MULTIPART);
    return mapCarFromApi(data?.data);
  }
  await mockDelay();
  return { ...payload, images: payload.images || [], _id: id };
}

export async function updateCarStatus(id, status) {
  if (API_ENABLED) {
    const { data } = await api.patch(`/api/cars/${id}/status`, { status });
    return mapCarFromApi(data?.data);
  }
  await mockDelay(200);
  return { _id: id, status };
}

export async function deleteCar(id) {
  if (API_ENABLED) {
    const { data } = await api.delete(`/api/cars/${id}`);
    return data;
  }
  await mockDelay();
  return { success: true, _id: id };
}
