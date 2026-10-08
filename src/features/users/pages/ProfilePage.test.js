import { describe, it, expect, vi } from 'vitest';
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
  it('renders profile page', () => {
    const { getByText } = renderWithProviders(ProfilePage);
    expect(getByText('Profil Saya')).toBeInTheDocument();
  });

  it('renders and updates profile successfully', async () => {
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
});
