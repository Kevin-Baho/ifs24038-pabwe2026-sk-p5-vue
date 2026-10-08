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
  it('renders login form with labels and inputs', () => {
    const { getByText, getByLabelText } = renderWithProviders(LoginPage);
    expect(getByText('Selamat Datang!')).toBeInTheDocument();
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
  });

  it('should successfully login and call showSuccessDialog', async () => {
    const { getByLabelText, getByRole } = renderWithProviders(LoginPage);
    const store = useAuthStore();
    store.loginUser = vi.fn().mockResolvedValue(true);

    await fireEvent.update(getByLabelText('Email'), 'a@b.com');
    await fireEvent.update(getByLabelText('Password'), 'password123');
    // fire change to cover handleEmailChange and handlePasswordChange
    await fireEvent.change(getByLabelText('Email'));
    await fireEvent.change(getByLabelText('Password'));
    await fireEvent.submit(getByRole('button', { name: /Masuk Sekarang/i }));

    await waitFor(() => {
      expect(store.loginUser).toHaveBeenCalledWith('a@b.com', 'password123');
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });
  });

  it('should show error dialog on login failure', async () => {
    const { getByLabelText, getByRole } = renderWithProviders(LoginPage);
    const store = useAuthStore();
    store.loginUser = vi.fn().mockRejectedValue(new Error('Login Gagal'));

    await fireEvent.update(getByLabelText('Email'), 'x@b.com');
    await fireEvent.update(getByLabelText('Password'), 'wrong');
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