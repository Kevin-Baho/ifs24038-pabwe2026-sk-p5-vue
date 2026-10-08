import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './authStore';
import * as authApi from '../api/authApi';
import * as apiHelper from '@/helpers/apiHelper';

vi.mock('../api/authApi', () => ({
  login: vi.fn(),
  register: vi.fn(),
}));
vi.mock('@/helpers/apiHelper', () => ({
  putAccessToken: vi.fn(),
  removeAccessToken: vi.fn(),
}));

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should login successfully', async () => {
    const store = useAuthStore();
    authApi.login.mockResolvedValue({ data: { token: 'token123' } });
    await store.loginUser('a@b.c', 'pass');
    
    expect(store.isAuth).toBe(true);
    expect(apiHelper.putAccessToken).toHaveBeenCalledWith('token123');
  });

  it('should handle register', async () => {
    const store = useAuthStore();
    authApi.register.mockResolvedValue({ message: 'Register OK' });
    const res = await store.registerUser('Udin', 'u@b.c', 'pass');
    
    expect(res.message).toBe('Register OK');
  });

  it('should logout correctly', () => {
    const store = useAuthStore();
    store.isAuth = true;
    store.logoutUser();
    
    expect(store.isAuth).toBe(false);
    expect(apiHelper.removeAccessToken).toHaveBeenCalled();
  });
});

