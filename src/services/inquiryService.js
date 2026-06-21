import api, { API_ENABLED, mockDelay } from './api';

/**
 * Inquiry data access layer.
 *   POST /api/inquiries   — submit a customer lead
 *   GET  /api/inquiries   — admin: list leads
 */

const MOCK_INQUIRIES = [
  {
    _id: 'inq-1',
    name: 'Faizan Malik',
    phone: '+92 321 9876543',
    email: 'faizan@example.com',
    message: 'Interested in the Land Cruiser ZX. Is it still available?',
    carId: 'cj-001',
    carName: 'Toyota Land Cruiser ZX',
    status: 'new',
    createdAt: '2026-06-15T09:24:00.000Z',
  },
  {
    _id: 'inq-2',
    name: 'Ayesha Noor',
    phone: '+92 333 1122334',
    email: 'ayesha@example.com',
    message: 'Can I schedule a test drive for the Civic Oriel this weekend?',
    carId: 'cj-003',
    carName: 'Honda Civic Oriel',
    status: 'contacted',
    createdAt: '2026-06-14T13:10:00.000Z',
  },
  {
    _id: 'inq-3',
    name: 'Hamza Iqbal',
    phone: '+92 300 5566778',
    email: 'hamza@example.com',
    message: 'What is the best price on the Sportage Alpha?',
    carId: 'cj-007',
    carName: 'Kia Sportage Alpha',
    status: 'new',
    createdAt: '2026-06-13T17:45:00.000Z',
  },
];

/** Backend Inquiry (id/car/UPPER status) → frontend shape (_id/carName/lower status). */
function mapInquiryFromApi(i) {
  if (!i) return i;
  return {
    _id: i.id,
    name: i.name || '',
    phone: i.phone || '',
    email: i.email || '',
    message: i.message || '',
    carId: i.carId || null,
    carName: i.car?.title || '',
    status: (i.status || 'NEW').toLowerCase(),
    createdAt: i.createdAt,
  };
}

export async function createInquiry(payload) {
  if (API_ENABLED) {
    const { data } = await api.post('/api/inquiries', {
      name: payload.name,
      phone: payload.phone,
      email: payload.email || '',
      message: payload.message || '',
      carId: payload.carId || null,
    });
    return mapInquiryFromApi(data?.data);
  }
  if (import.meta.env.DEV) {
    await mockDelay(900);
    return {
      _id: `inq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
      ...payload,
    };
  }
  throw new Error('Unable to submit inquiry right now. Please try again.');
}

export async function getInquiries() {
  if (API_ENABLED) {
    const { data } = await api.get('/api/admin/inquiries');
    return (data?.data || []).map(mapInquiryFromApi);
  }
  if (import.meta.env.DEV) {
    await mockDelay();
    return MOCK_INQUIRIES;
  }
  return [];
}

// Admin — persist a status change (NEW | CONTACTED | CLOSED).
export async function updateInquiryStatus(id, status) {
  if (API_ENABLED) {
    const { data } = await api.patch(`/api/inquiries/${id}/status`, {
      status: String(status).toUpperCase(),
    });
    return mapInquiryFromApi(data?.data);
  }
  if (import.meta.env.DEV) {
    await mockDelay(300);
    return { _id: id, status };
  }
  throw new Error('Unable to update inquiry right now. Please try again.');
}
