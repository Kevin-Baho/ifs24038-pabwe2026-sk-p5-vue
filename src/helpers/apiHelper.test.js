// File: src/helpers/apiHelper.test.js
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getAccessToken, putAccessToken, removeAccessToken, apiFetch, fetchWithToken } from './apiHelper';

describe('apiHelper', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should store token with putAccessToken when token is truthy', () => {
    expect(getAccessToken()).toBe('');
    putAccessToken('my-secret-token');
    expect(getAccessToken()).toBe('my-secret-token');
  });

  it('should remove token with putAccessToken when token is falsy (null/empty)', () => {
    // First store a token
    putAccessToken('existing-token');
    expect(getAccessToken()).toBe('existing-token');
    // Now clear it by passing null/falsy
    putAccessToken(null);
    expect(getAccessToken()).toBe('');
    // Also test empty string
    putAccessToken('another-token');
    putAccessToken('');
    expect(getAccessToken()).toBe('');
  });

  it('should remove token with removeAccessToken', () => {
    putAccessToken('token-to-remove');
    removeAccessToken();
    expect(getAccessToken()).toBe('');
  });

  it('should fetch with token and handle URL without leading slash using apiFetch', async () => {
    putAccessToken('token-123');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    const data = await apiFetch('test-endpoint', { method: 'GET' });

    expect(data.message).toBe('Success');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test-endpoint'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-123',
        }),
      })
    );
  });

  it('should support fetchWithToken alias correctly', async () => {
    putAccessToken('token-alias');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Alias Success' }),
    });

    const data = await fetchWithToken('/alias-test', { method: 'GET' });
    expect(data.message).toBe('Alias Success');
  });

  it('should fetch without token when not authenticated', async () => {
    localStorage.clear();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Public OK' }),
    });

    const data = await apiFetch('/public', { method: 'GET' });
    expect(data.message).toBe('Public OK');

    const callHeaders = global.fetch.mock.calls[0][1].headers;
    expect(callHeaders['Authorization']).toBeUndefined();
  });

  it('should delete Content-Type when sending FormData', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'Uploaded' }),
    });

    const formData = new FormData();
    await apiFetch('/upload', { method: 'POST', body: formData });

    const callHeaders = global.fetch.mock.calls[0][1].headers;
    expect(callHeaders['Content-Type']).toBeUndefined();
  });

  it('should throw simple error message if response is not ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Gagal mengambil data' }),
    });

    await expect(apiFetch('/error')).rejects.toThrow('Gagal mengambil data');
  });

  it('should format detailed field errors when validation fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Data tidak valid',
        errors: {
          title: ['Judul minimal 5 karakter'],
          closed_at: 'Format tanggal salah',
        },
      }),
    });

    await expect(apiFetch('/validation-error')).rejects.toThrow(
      /Data tidak valid\n• title: Judul minimal 5 karakter\n• closed_at: Format tanggal salah/
    );
  });

  it('should fallback to default error message if json parse fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => { throw new Error('Not JSON'); },
    });

    await expect(apiFetch('/crash')).rejects.toThrow('Gagal memproses data server');
  });

  it('should throw default message if responseJson has no message attribute', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(apiFetch('/empty-err')).rejects.toThrow('Terjadi kesalahan pada server');
  });

  it('should use default baseUrl if VITE_DELCOM_BASEURL is empty or undefined', async () => {
    const originalEnv = import.meta.env.VITE_DELCOM_BASEURL;
    delete import.meta.env.VITE_DELCOM_BASEURL;

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'default url' }),
    });

    await apiFetch('/fallback-url');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://open-api.delcom.org/api/v1/fallback-url',
      expect.anything()
    );

    import.meta.env.VITE_DELCOM_BASEURL = originalEnv;
  });
});