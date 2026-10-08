// File: src/features/users/pages/ProfilePage.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/vue';
import { renderWithProviders } from '@/test-utils';
import ProfilePage from './ProfilePage.vue';
import { useUsersStore } from '../states/usersStore';
import * as userApi from '../api/userApi';
import * as toolsHelper from '@/helpers/toolsHelper';

vi.mock('../api/userApi', () => ({ updateMe: vi.fn() }));
vi.mock('@/helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(true),
  showErrorDialog: vi.fn(),
}));

describe('ProfilePage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders profile page with form label', () => {
    const { getByText, getByLabelText } = renderWithProviders(ProfilePage);
    expect(getByText('Profil Saya')).toBeInTheDocument();
    expect(getByLabelText('Nama Lengkap')).toBeInTheDocument();
  });

  it('shows user name and email when currentUser is set', async () => {
    const { getByText, getByAltText } = renderWithProviders(ProfilePage);
    const store = useUsersStore();
    store.currentUser = { name: 'Budi Santoso', email: 'budi@email.com', photo: null };
    store.fetchMe = vi.fn().mockResolvedValue(undefined);

    const { nextTick } = await import('vue');
    await nextTick();
    expect(getByText('Budi Santoso')).toBeInTheDocument();
    expect(getByText('budi@email.com')).toBeInTheDocument();
    // Alt text with user name
    expect(getByAltText('Foto profil Budi Santoso')).toBeInTheDocument();
  });

  it('shows fallback alt text when user name is empty', async () => {
    const { getByAltText } = renderWithProviders(ProfilePage);
    const store = useUsersStore();
    store.currentUser = { name: '', email: 'anon@email.com', photo: null };
    store.fetchMe = vi.fn().mockResolvedValue(undefined);

    const { nextTick } = await import('vue');
    await nextTick();
    expect(getByAltText('Foto Profil Pengguna')).toBeInTheDocument();
  });

  it('shows user photo when photo url exists', async () => {
    const { getByRole } = renderWithProviders(ProfilePage);
    const store = useUsersStore();
    store.currentUser = { name: 'Rina', email: 'rina@email.com', photo: 'https://example.com/pic.jpg' };
    store.fetchMe = vi.fn().mockResolvedValue(undefined);

    const { nextTick } = await import('vue');
    await nextTick();
    const img = getByRole('img', { name: 'Foto profil Rina' });
    expect(img.src).toBe('https://example.com/pic.jpg');
  });

  it('updates profile successfully and shows success dialog', async () => {
    userApi.updateMe.mockResolvedValue({});
    const { getByRole } = renderWithProviders(ProfilePage);
    const store = useUsersStore();
    store.currentUser = { name: 'Lama', email: 'a@b.c' };
    store.fetchMe = vi.fn().mockResolvedValue(undefined);

    await fireEvent.submit(getByRole('button', { name: /Simpan Profil/i }));

    await waitFor(() => {
      expect(userApi.updateMe).toHaveBeenCalled();
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });
  });

  it('shows error when update fails', async () => {
    userApi.updateMe.mockRejectedValue(new Error('Gagal update'));
    const { getByRole } = renderWithProviders(ProfilePage);
    const store = useUsersStore();
    store.fetchMe = vi.fn().mockResolvedValue(undefined);

    await fireEvent.submit(getByRole('button', { name: /Simpan Profil/i }));

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Gagal update');
    });
  });

  it('prefills name input from currentUser on mount when fetchMe resolves', async () => {
    const { getByLabelText } = renderWithProviders(ProfilePage);
    const store = useUsersStore();
    store.fetchMe = vi.fn().mockImplementation(async () => {
      store.currentUser = { name: 'Rina Sari', email: 'rina@email.com' };
    });

    const { nextTick } = await import('vue');
    await nextTick();
    await nextTick();
    const input = getByLabelText('Nama Lengkap');
    expect(input).toBeInTheDocument();
  });
});
