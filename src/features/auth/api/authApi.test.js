import { describe, it, expect, vi } from 'vitest';
import { login, register } from './authApi';
import * as apiHelper from '@/helpers/apiHelper';

vi.mock('@/helpers/apiHelper', () => ({
  fetchWithToken: vi.fn(),
}));

describe('authApi', () => {
  it('should call fetchWithToken on login', async () => {
    apiHelper.fetchWithToken.mockResolvedValue({ message: 'OK' });
    await login('test@mail.com', 'pass');
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/auth/login', expect.objectContaining({ method: 'POST' }));
  });

  it('should call fetchWithToken on register', async () => {
    apiHelper.fetchWithToken.mockResolvedValue({ message: 'OK' });
    await register('John', 'test@mail.com', 'pass');
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/auth/register', expect.objectContaining({ method: 'POST' }));
  });
});

