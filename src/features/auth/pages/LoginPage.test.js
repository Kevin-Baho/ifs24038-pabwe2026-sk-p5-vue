// File: src/features/auth/pages/LoginPage.test.js
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/vue';
import { renderWithProviders } from '@/test-utils';
import LoginPage from './LoginPage.vue';
import { useAuthStore } from '../states/authStore';
import * as toolsHelper from '@/helpers/toolsHelper';

vi.mock('@/helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(true),
  showErrorDialog: vi.fn(),
}));

describe('LoginPage', () => {
  it('renders login form', () => {
    const { getByText } = renderWithProviders(LoginPage);
    expect(getByText('Selamat Datang!')).toBeInTheDocument();
  });

  it('should successfully login and call showSuccessDialog', async () => {
    const { getByPlaceholderText, getByRole } = renderWithProviders(LoginPage);
    const store = useAuthStore();
    store.loginUser = vi.fn().mockResolvedValue(true);

    await fireEvent.update(getByPlaceholderText('nama@email.com'), 'a@b.com');
    await fireEvent.update(getByPlaceholderText('••••••••'), 'password123');
    // Also fire change events to cover handleEmailChange and handlePasswordChange
    await fireEvent.change(getByPlaceholderText('nama@email.com'));
    await fireEvent.change(getByPlaceholderText('••••••••'));
    await fireEvent.submit(getByRole('button', { name: /Masuk Sekarang/i }));

    await waitFor(() => {
      expect(store.loginUser).toHaveBeenCalledWith('a@b.com', 'password123');
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });
  });

  it('should show error dialog on login failure', async () => {
    const { getByPlaceholderText, getByRole } = renderWithProviders(LoginPage);
    const store = useAuthStore();
    store.loginUser = vi.fn().mockRejectedValue(new Error('Login Gagal'));

    await fireEvent.update(getByPlaceholderText('nama@email.com'), 'x@b.com');
    await fireEvent.update(getByPlaceholderText('••••••••'), 'wrong');
    await fireEvent.submit(getByRole('button', { name: /Masuk Sekarang/i }));

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Login Gagal');
    });
  });

  it('shows loading text when authStore.loading is true', async () => {
    const { getByRole } = renderWithProviders(LoginPage);
    const store = useAuthStore();
    store.loading = true;
    const { nextTick } = await import('vue');
    await nextTick();
    expect(getByRole('button', { name: /Memproses/i })).toBeInTheDocument();
  });
});
