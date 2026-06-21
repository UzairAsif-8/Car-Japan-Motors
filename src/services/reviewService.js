import api, { API_ENABLED, mockDelay } from './api';

/**
 * Reviews / testimonials data access layer.
 *   GET    /api/reviews      — public: list approved reviews
 *   POST   /api/reviews      — admin: create a review
 *   DELETE /api/reviews/:id  — admin: remove a review
 *
 * In mock mode reviews persist to localStorage so anything added in the admin
 * panel immediately shows on the public homepage and survives a refresh.
 */
const STORAGE_KEY = 'cj_reviews';

/** Backend Review (comment/role/avatar) → frontend shape (quote/role/avatar). */
function mapReviewFromApi(r) {
  if (!r) return r;
  return {
    id: r.id,
    name: r.name || '',
    role: r.role || '',
    avatar: r.avatar || '',
    rating: r.rating ?? 5,
    quote: r.comment || '',
    status: r.status,
    createdAt: r.createdAt,
  };
}

// Dev-only seed loaded via dynamic import so testimonials are statically
// stripped from production builds.
async function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore malformed storage */
  }
  // First run — seed from the bundled testimonials.
  const { default: SEED_REVIEWS } = await import('../data/testimonials');
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REVIEWS));
  return [...SEED_REVIEWS];
}

function writeStore(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

// Public — approved reviews for the homepage testimonials carousel.
export async function getReviews() {
  if (API_ENABLED) {
    const { data } = await api.get('/api/reviews');
    return (data?.data || []).map(mapReviewFromApi);
  }
  if (import.meta.env.DEV) {
    await mockDelay(400);
    return readStore();
  }
  return [];
}

// Admin — every review regardless of status (for the admin Reviews table).
export async function getAllReviews() {
  if (API_ENABLED) {
    const { data } = await api.get('/api/admin/reviews');
    return (data?.data || []).map(mapReviewFromApi);
  }
  if (import.meta.env.DEV) {
    await mockDelay(400);
    return readStore();
  }
  return [];
}

// Admin — create a curated testimonial (published/APPROVED immediately).
export async function createReview(payload) {
  if (API_ENABLED) {
    const { data } = await api.post('/api/admin/reviews', {
      name: payload.name,
      role: payload.role || '',
      avatar: payload.avatar || '',
      rating: payload.rating,
      comment: payload.quote, // frontend `quote` → backend `comment`
    });
    return mapReviewFromApi(data?.data);
  }
  if (import.meta.env.DEV) {
    await mockDelay(600);
    const review = {
      id: `rev-${Date.now()}`,
      rating: 5,
      avatar: '',
      createdAt: new Date().toISOString(),
      ...payload,
    };
    const reviews = await readStore();
    const next = [review, ...reviews];
    writeStore(next);
    return review;
  }
  throw new Error('Reviews are read-only in this environment');
}

export async function deleteReview(id) {
  if (API_ENABLED) {
    const { data } = await api.delete(`/api/admin/reviews/${id}`);
    return data;
  }
  if (import.meta.env.DEV) {
    await mockDelay(400);
    const next = (await readStore()).filter((r) => r.id !== id);
    writeStore(next);
    return { success: true, id };
  }
  throw new Error('Reviews are read-only in this environment');
}
