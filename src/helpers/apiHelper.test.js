// File: src/helpers/apiHelper.test.js
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getAccessToken, putAccessToken, removeAccessToken, fetchWithToken } from './apiHelper';

describe('apiHelper', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should manipulate accessToken in localStorage', () => {
    putAccessToken('test-token');
    expect(getAccessToken()).toBe('test-token');
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it('should fetch with token successfully', async () => {
    putAccessToken('my-token');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    const data = await fetchWithToken('/test', { method: 'GET' });
    expect(data.message).toBe('Success');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer my-token',
        },
      })
    );
  });

  it('should fetch without token (no Authorization header)', async () => {
    localStorage.clear(); // ensure no token
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'OK' }),
    });

    const data = await fetchWithToken('/no-auth', { method: 'GET' });
    expect(data.message).toBe('OK');
    // Authorization header should not be present
    const callArgs = global.fetch.mock.calls[0][1];
    expect(callArgs.headers['Authorization']).toBeUndefined();
  });

  it('should remove content-type for FormData', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });
    const formData = new FormData();
    await fetchWithToken('/upload', { method: 'POST', body: formData });
    
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/upload'),
      expect.not.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' })
      })
    );
  });

  it('should throw error with message from API response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'API Error' }),
    });

    await expect(fetchWithToken('/error')).rejects.toThrow('API Error');
  });

  it('should throw fallback error message when response has no message', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}), // no message field
    });

    await expect(fetchWithToken('/error')).rejects.toThrow('Terjadi kesalahan pada server');
  });
});
