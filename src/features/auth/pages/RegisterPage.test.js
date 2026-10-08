// File: src/features/auth/pages/RegisterPage.test.js
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/vue';
import { renderWithProviders } from '@/test-utils';
import RegisterPage from './RegisterPage.vue';
import { useAuthStore } from '../states/authStore';
import * as toolsHelper from '@/helpers/toolsHelper';

vi.mock('@/helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(true),
  showErrorDialog: vi.fn(),
}));

describe('RegisterPage', () => {
  it('renders register form', () => {
    const { getByText } = renderWithProviders(RegisterPage);
    expect(getByText('Buat Akun Baru')).toBeInTheDocument();
  });

  it('should successfully register and call showSuccessDialog', async () => {
    const { getByPlaceholderText, getByRole } = renderWithProviders(RegisterPage);
    const store = useAuthStore();
    store.registerUser = vi.fn().mockResolvedValue(true);

    await fireEvent.update(getByPlaceholderText('John Doe'), 'Udin');
    await fireEvent.update(getByPlaceholderText('nama@email.com'), 'udin@mail.com');
    await fireEvent.update(getByPlaceholderText('••••••••'), 'password123');
    // Fire change events to cover handleNameChange, handleEmailChange, handlePasswordChange
    await fireEvent.change(getByPlaceholderText('John Doe'));
    await fireEvent.change(getByPlaceholderText('nama@email.com'));
    await fireEvent.change(getByPlaceholderText('••••••••'));
    await fireEvent.submit(getByRole('button', { name: /Buat Akun/i }));

    await waitFor(() => {
      expect(store.registerUser).toHaveBeenCalledWith('Udin', 'udin@mail.com', 'password123');
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });
  });

  it('should show error dialog on register failure', async () => {
    const { getByPlaceholderText, getByRole } = renderWithProviders(RegisterPage);
    const store = useAuthStore();
    store.registerUser = vi.fn().mockRejectedValue(new Error('Email sudah digunakan'));

    await fireEvent.update(getByPlaceholderText('John Doe'), 'Udin');
    await fireEvent.update(getByPlaceholderText('nama@email.com'), 'x@b.com');
    await fireEvent.update(getByPlaceholderText('••••••••'), 'wrong');
    await fireEvent.submit(getByRole('button', { name: /Buat Akun/i }));

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Email sudah digunakan');
    });
  });

  it('shows loading text when authStore.loading is true', async () => {
    const { getByRole } = renderWithProviders(RegisterPage);
    const store = useAuthStore();
    store.loading = true;
    const { nextTick } = await import('vue');
    await nextTick();
    expect(getByRole('button', { name: /Memproses/i })).toBeInTheDocument();
  });
});
