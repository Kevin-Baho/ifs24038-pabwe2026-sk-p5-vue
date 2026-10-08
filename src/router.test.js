// File: src/router.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apiHelper from '@/helpers/apiHelper';

// Mock apiHelper BEFORE importing router so the guard uses the mock
vi.mock('@/helpers/apiHelper', () => ({
  getAccessToken: vi.fn(),
  putAccessToken: vi.fn(),
  removeAccessToken: vi.fn(),
}));

describe('router', () => {
  let router;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    // Import the actual router.js so it counts in coverage
    const mod = await import('./router.js');
    router = mod.default;
  });

  it('redirects unauthenticated user from protected route to /auth/login', async () => {
    apiHelper.getAccessToken.mockReturnValue(null);
    await router.push('/');
    await router.isReady();
    expect(router.currentRoute.value.path).toBe('/auth/login');
  });

  it('redirects authenticated user away from /auth/login to /', async () => {
    apiHelper.getAccessToken.mockReturnValue('valid-token');
    await router.push('/auth/login');
    await router.isReady();
    expect(router.currentRoute.value.path).toBe('/');
  });

  it('allows unauthenticated user to access /auth/register', async () => {
    apiHelper.getAccessToken.mockReturnValue(null);
    await router.push('/auth/register');
    await router.isReady();
    expect(router.currentRoute.value.path).toBe('/auth/register');
  });

  it('allows authenticated user to access protected routes', async () => {
    apiHelper.getAccessToken.mockReturnValue('valid-token');
    await router.push('/users');
    await router.isReady();
    expect(router.currentRoute.value.path).toBe('/users');
  });

  it('allows authenticated user to access /profile', async () => {
    apiHelper.getAccessToken.mockReturnValue('valid-token');
    await router.push('/profile');
    await router.isReady();
    expect(router.currentRoute.value.path).toBe('/profile');
  });
});
