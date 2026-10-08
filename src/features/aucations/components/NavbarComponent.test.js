import { describe, it, expect, vi } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/vue';
import { renderWithProviders } from '@/test-utils';
import { nextTick } from 'vue';
import NavbarComponent from './NavbarComponent.vue';
import { useAuthStore } from '@/features/auth/states/authStore';
import { useUsersStore } from '@/features/users/states/usersStore';

describe('NavbarComponent', () => {
  it('renders brand name', () => {
    const { getByText } = renderWithProviders(NavbarComponent);
    expect(getByText('Delcom Auction')).toBeInTheDocument();
  });

  it('renders user name when currentUser is set', async () => {
    const { getByText } = renderWithProviders(NavbarComponent);
    const usersStore = useUsersStore();
    usersStore.currentUser = { name: 'Test User' };
    await nextTick();
    expect(getByText('Test User')).toBeInTheDocument();
  });

  it('logs out when Logout button is clicked', async () => {
    const { getByRole } = renderWithProviders(NavbarComponent);
    const authStore = useAuthStore();
    authStore.logoutUser = vi.fn();

    await fireEvent.click(getByRole('button', { name: /Logout/i }));

    await waitFor(() => {
      expect(authStore.logoutUser).toHaveBeenCalled();
    });
  });
});
