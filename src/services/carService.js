import api, { API_ENABLED, mockDelay } from './api';
import CARS from '../data/cars';

/**
 * Vehicle data access layer.
 *
 * Components only ever call these functions. Today they resolve mock data;
 * the moment VITE_API_BASE_URL is set they call the matching Express routes:
 *   GET    /api/cars
 *   GET    /api/cars/:id
 *   POST   /api/cars        (multipart: fields + image files)
 *   PUT    /api/cars/:id
 *   DELETE /api/cars/:id
 * The function signatures and return shapes (the frontend car shape) never change —
 * the mappers below are the single seam translating to/from the backend shape.
 */

/* ── mapping seam (backend ↔ frontend shape) ─────────────── */

/** Backend Car (id/title/fuelType…) → frontend car (_id/name/fuel…). */
function mapCarFromApi(c) {
  if (!c) return c;
  const title = c.title || '';
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
    condition: c.condition || '',
    images: Array.isArray(c.images) ? c.images : [],
    highlights: Array.isArray(c.features) ? c.features : [],
    description: c.description || '',
    location: c.location || '',
    isSold: Boolean(c.isSold),
  };
}

/** Frontend car payload → multipart FormData for the backend. */
function buildCarFormData(payload = {}) {
  const fd = new FormData();
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
    sort,
  } = params;

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
    const { data } = await api.get('/api/cars', { params: { sold: false } });
    const cars = (data?.data || []).map(mapCarFromApi);
    // Apply all filtering/sorting client-side for parity with mock mode.
    return applyQuery(cars, params);
  }
  await mockDelay();
  return applyQuery(CARS, params);
}

export async function getCarById(id) {
  if (API_ENABLED) {
    const { data } = await api.get(`/api/cars/${id}`);
    return mapCarFromApi(data?.data);
  }
  await mockDelay(500);
  const car = CARS.find((c) => c._id === id);
  if (!car) throw new Error('Vehicle not found');
  return car;
}

export async function getFeaturedCars(limit = 12) {
  const cars = await getCars({ featured: true });
  return cars.slice(0, limit);
}

export async function getSimilarCars(car, limit = 4) {
  if (!car) return [];
  const all = await getCars();
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

// Admin-only mutations. In live mode they send multipart/form-data so image
// files stream through to Cloudinary on the backend.
export async function createCar(payload) {
  if (API_ENABLED) {
    const { data } = await api.post('/api/cars', buildCarFormData(payload), MULTIPART);
    return mapCarFromApi(data?.data);
  }
  await mockDelay();
  return { ...payload, images: payload.images || [], _id: `cj-${Date.now()}` };
}

export async function updateCar(id, payload) {
  if (API_ENABLED) {
    const { data } = await api.put(`/api/cars/${id}`, buildCarFormData(payload), MULTIPART);
    return mapCarFromApi(data?.data);
  }
  await mockDelay();
  return { ...payload, images: payload.images || [], _id: id };
}

export async function deleteCar(id) {
  if (API_ENABLED) {
    const { data } = await api.delete(`/api/cars/${id}`);
    return data;
  }
  await mockDelay();
  return { success: true, _id: id };
}
