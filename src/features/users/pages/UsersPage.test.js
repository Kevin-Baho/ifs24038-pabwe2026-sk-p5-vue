// File: src/features/users/pages/UsersPage.test.js
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/test-utils';
import UsersPage from './UsersPage.vue';
import { useUsersStore } from '../states/usersStore';
import { nextTick } from 'vue';
import * as userApi from '../api/userApi';

vi.mock('../api/userApi', () => ({
  getAllUsers: vi.fn().mockResolvedValue({ data: [] }),
}));

describe('UsersPage', () => {
  it('renders page heading on mount', async () => {
    const { getByText } = renderWithProviders(UsersPage);
    expect(getByText('Daftar Pengguna')).toBeInTheDocument();
  });

  it('shows loading state when store.loading is true', async () => {
    const { getByText } = renderWithProviders(UsersPage);
    const store = useUsersStore();
    store.loading = true;
    await nextTick();
    expect(getByText('Memuat data...')).toBeInTheDocument();
  });

  it('renders user cards with meaningful alt text when name exists', async () => {
    const { getByText, getByAltText } = renderWithProviders(UsersPage);
    const store = useUsersStore();
    store.users = [{ id: 1, name: 'Budi Test', email: 'budi@test.com', photo: null }];
    store.loading = false;
    await nextTick();
    expect(getByText('Budi Test')).toBeInTheDocument();
    expect(getByAltText('Foto profil Budi Test')).toBeInTheDocument();
  });

  it('renders user cards with fallback alt text when name is empty', async () => {
    const { getByAltText } = renderWithProviders(UsersPage);
    const store = useUsersStore();
    store.users = [{ id: 2, name: '', email: 'anon@test.com', photo: null }];
    store.loading = false;
    await nextTick();
    expect(getByAltText('Foto Profil Pengguna')).toBeInTheDocument();
  });

  it('renders user photo when photo url is provided', async () => {
    const { getByRole } = renderWithProviders(UsersPage);
    const store = useUsersStore();
    store.users = [{ id: 3, name: 'Siti', email: 'siti@test.com', photo: 'https://example.com/photo.jpg' }];
    store.loading = false;
    await nextTick();
    const img = getByRole('img', { name: 'Foto profil Siti' });
    expect(img.src).toBe('https://example.com/photo.jpg');
  });
});
