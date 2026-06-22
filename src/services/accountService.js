import api, { API_ENABLED, mockDelay, tokenStore } from './api';

/**
 * Admin account data access layer.
 *   GET  /api/auth/me             — current admin profile
 *   PUT  /api/auth/change-email   — update email (requires current password)
 *   PUT  /api/auth/change-password — update password
 */

const MOCK_PROFILE = {
  id: 'mock-admin-id',
  email: 'admin@carjapan.pk',
};

const MOCK_PASSWORD = 'carjapan';

function mapAccountError(err) {
  if (err.status === 404) {
    return new Error(
      'Account settings are not available on the server yet. Deploy the latest backend to enable email and password changes.'
    );
  }
  return err;
}

export async function getProfile() {
  if (API_ENABLED) {
    try {
      const { data } = await api.get('/api/auth/me');
      return data.data;
    } catch (err) {
      throw mapAccountError(err);
    }
  }
  await mockDelay();
  return { ...MOCK_PROFILE };
}

export async function changeEmail({ newEmail, currentPassword }) {
  if (API_ENABLED) {
    try {
      const { data } = await api.put('/api/auth/change-email', { newEmail, currentPassword });
      if (data.token) tokenStore.set(data.token);
      return data;
    } catch (err) {
      throw mapAccountError(err);
    }
  }
  await mockDelay();
  if (currentPassword !== MOCK_PASSWORD) {
    throw new Error('Current password is incorrect');
  }
  if (!newEmail?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    throw new Error('Enter a valid email address');
  }
  if (newEmail.toLowerCase().trim() === MOCK_PROFILE.email) {
    throw new Error('New email must be different from your current email');
  }
  MOCK_PROFILE.email = newEmail.toLowerCase().trim();
  return {
    success: true,
    message: 'Email updated successfully',
    data: { email: MOCK_PROFILE.email },
  };
}

export async function changePassword({ currentPassword, newPassword }) {
  if (API_ENABLED) {
    try {
      const { data } = await api.put('/api/auth/change-password', { currentPassword, newPassword });
      if (data.token) tokenStore.set(data.token);
      return data;
    } catch (err) {
      throw mapAccountError(err);
    }
  }
  await mockDelay();
  if (currentPassword !== MOCK_PASSWORD) {
    throw new Error('Current password is incorrect');
  }
  if (newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  if (newPassword === currentPassword) {
    throw new Error('New password must be different from your current password');
  }
  return { success: true, message: 'Password updated successfully' };
}
