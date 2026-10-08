// File: src/features/users/api/userApi.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userApi from './userApi';
import * as apiHelper from '@/helpers/apiHelper';

vi.mock('@/helpers/apiHelper', () => ({
  fetchWithToken: vi.fn(),
}));

describe('userApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getAllUsers calls fetchWithToken', async () => {
    await userApi.getAllUsers();
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/users', { method: 'GET' });
  });

  it('getMe calls fetchWithToken', async () => {
    await userApi.getMe();
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/users/me', { method: 'GET' });
  });

  it('updateMe calls fetchWithToken with name body', async () => {
    await userApi.updateMe('Budi');
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith(
      '/users/me',
      expect.objectContaining({ method: 'PUT', body: JSON.stringify({ name: 'Budi' }) })
    );
  });

  it('updatePassword calls fetchWithToken', async () => {
    await userApi.updatePassword('old', 'new');
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith(
      '/users/me/password',
      expect.objectContaining({ method: 'PUT' })
    );
  });

  it('updatePhoto calls fetchWithToken with formData', async () => {
    const file = new File([''], 'test.png');
    await userApi.updatePhoto(file);
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith(
      '/users/me/photo',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );
  });
});
