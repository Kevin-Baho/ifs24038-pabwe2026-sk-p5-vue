import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUsersStore } from './usersStore';
import * as userApi from '../api/userApi';

vi.mock('../api/userApi', () => ({
  getAllUsers: vi.fn(),
  getMe: vi.fn(),
}));

describe('usersStore', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('fetchUsers loads data', async () => {
    const store = useUsersStore();
    userApi.getAllUsers.mockResolvedValue({ data: { users: [{ id: 1 }] } });
    await store.fetchUsers();
    expect(store.users.length).toBe(1);
  });

  it('fetchMe loads currentUser', async () => {
    const store = useUsersStore();
    userApi.getMe.mockResolvedValue({ data: { user: { name: 'Admin' } } });
    await store.fetchMe();
    expect(store.currentUser.name).toBe('Admin');
  });

  it('fetchMe handles error', async () => {
    const store = useUsersStore();
    userApi.getMe.mockRejectedValue(new Error('Failed'));
    await store.fetchMe();
    expect(store.currentUser).toBeNull();
  });
});

