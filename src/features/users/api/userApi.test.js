// File: src/features/users/api/userApi.test.js
import { describe, it, expect, vi } from 'vitest';
import * as userApi from './userApi';
import * as apiHelper from '@/helpers/apiHelper';

vi.mock('@/helpers/apiHelper', () => ({
  fetchWithToken: vi.fn(),
  getAccessToken: vi.fn(() => 'mock-token'),
}));

describe('userApi', () => {
  it('getAllUsers calls fetchWithToken', async () => {
    await userApi.getAllUsers();
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/users', { method: 'GET' });
  });

  it('getMe calls fetchWithToken', async () => {
    await userApi.getMe();
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/users/me', { method: 'GET' });
  });

  it('updateMe calls fetchWithToken', async () => {
    await userApi.updateMe('Budi');
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/users/me', expect.objectContaining({ method: 'PUT', body: JSON.stringify({ name: 'Budi' }) }));
  });

  it('updatePassword calls fetchWithToken', async () => {
    await userApi.updatePassword('old', 'new');
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/users/me/password', expect.objectContaining({ method: 'PUT' }));
  });

  it('updatePhoto calls fetch directly with FormData and Authorization header', async () => {
    apiHelper.getAccessToken.mockReturnValue('mock-token');
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ message: 'OK' }) });
    const file = new File([''], 'test.png');
    const result = await userApi.updatePhoto(file);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/me/photo'),
      expect.objectContaining({ method: 'POST', headers: { Authorization: 'Bearer mock-token' } })
    );
    expect(result.message).toBe('OK');
  });

  it('updatePhoto sends empty headers when no token', async () => {
    apiHelper.getAccessToken.mockReturnValue(null);
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ message: 'OK' }) });
    const file = new File([''], 'test.png');
    await userApi.updatePhoto(file);
    const callArgs = global.fetch.mock.calls[0][1];
    expect(callArgs.headers).toEqual({});
  });

  it('updatePhoto handles error response without message', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}), // no message
    });
    const file = new File([''], 'test.png');
    await expect(userApi.updatePhoto(file)).rejects.toThrow('Gagal mengubah foto');
  });

  it('updatePhoto handles error response with message', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({ message: 'Failed' }) });
    const file = new File([''], 'test.png');
    await expect(userApi.updatePhoto(file)).rejects.toThrow('Failed');
  });
});
