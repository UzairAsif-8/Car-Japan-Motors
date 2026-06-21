import api, { API_ENABLED, mockDelay, tokenStore } from './api';

/**
 * Auth data access layer.
 *   POST /api/auth/login — returns { token, user }
 *
 * Mock credentials (frontend demo only):
 *   email: admin@carjapan.pk
 *   password: carjapan
 */
const DEMO_USER = {
  email: 'admin@carjapan.pk',
  password: 'carjapan',
  name: 'Car Japan Admin',
};

export async function login({ email, password }) {
  if (API_ENABLED) {
    const { data } = await api.post('/api/auth/login', { email, password });
    tokenStore.set(data.token);
    return data;
  }
  await mockDelay(700);
  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    throw new Error('Invalid email or password.');
  }
  const token = `mock.jwt.${btoa(email)}.${Date.now()}`;
  tokenStore.set(token);
  return { token, user: { email: DEMO_USER.email, name: DEMO_USER.name } };
}

export function logout() {
  tokenStore.clear();
}

export function getStoredToken() {
  return tokenStore.get();
}
