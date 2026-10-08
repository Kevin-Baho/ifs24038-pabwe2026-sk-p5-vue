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
  it('renders register form with labels', () => {
    const { getByText, getByLabelText } = renderWithProviders(RegisterPage);
    expect(getByText('Buat Akun Baru')).toBeInTheDocument();
    expect(getByLabelText('Nama Lengkap')).toBeInTheDocument();
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
  });

  it('should successfully register and call showSuccessDialog', async () => {
    const { getByLabelText, getByRole } = renderWithProviders(RegisterPage);
    const store = useAuthStore();
    store.registerUser = vi.fn().mockResolvedValue(true);

    await fireEvent.update(getByLabelText('Nama Lengkap'), 'Udin');
    await fireEvent.update(getByLabelText('Email'), 'udin@mail.com');
    await fireEvent.update(getByLabelText('Password'), 'password123');
    // fire change events to cover handle*Change functions
    await fireEvent.change(getByLabelText('Nama Lengkap'));
    await fireEvent.change(getByLabelText('Email'));
    await fireEvent.change(getByLabelText('Password'));
    await fireEvent.submit(getByRole('button', { name: /Buat Akun/i }));

    await waitFor(() => {
      expect(store.registerUser).toHaveBeenCalledWith('Udin', 'udin@mail.com', 'password123');
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });
  });

  it('should show error dialog on register failure', async () => {
    const { getByLabelText, getByRole } = renderWithProviders(RegisterPage);
    const store = useAuthStore();
    store.registerUser = vi.fn().mockRejectedValue(new Error('Email sudah digunakan'));

    await fireEvent.update(getByLabelText('Nama Lengkap'), 'Udin');
    await fireEvent.update(getByLabelText('Email'), 'x@b.com');
    await fireEvent.update(getByLabelText('Password'), 'wrong');
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
