import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/vue';
import { renderWithProviders } from '@/test-utils';
import AddModal from './AddModal.vue';
import * as aucationApi from '../api/aucationApi';
import * as toolsHelper from '@/helpers/toolsHelper';

vi.mock('../api/aucationApi', () => ({ createAucation: vi.fn() }));
vi.mock('@/helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(true),
  showErrorDialog: vi.fn(),
}));

describe('AddModal', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not render when isOpen is false', () => {
    const { queryByText } = renderWithProviders(AddModal, { props: { isOpen: false } });
    expect(queryByText('Tambah Lelang Baru')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    const { getByText } = renderWithProviders(AddModal, { props: { isOpen: true } });
    expect(getByText('Tambah Lelang Baru')).toBeInTheDocument();
    expect(getByText('Batas Waktu Lelang')).toBeInTheDocument();
  });

  it('emits close when Batal clicked', async () => {
    const { getByText, emitted } = renderWithProviders(AddModal, { props: { isOpen: true } });
    await fireEvent.click(getByText('Batal'));
    expect(emitted().close).toBeTruthy();
  });

  it('emits close when backdrop clicked', async () => {
    const { container, emitted } = renderWithProviders(AddModal, { props: { isOpen: true } });
    const backdrop = container.querySelector('.absolute.inset-0');
    await fireEvent.click(backdrop);
    expect(emitted().close).toBeTruthy();
  });

  it('submits with correct payload including start_bid as Number and closed_at', async () => {
    aucationApi.createAucation.mockResolvedValue({});
    const { container, getByPlaceholderText, getByRole, emitted } = renderWithProviders(AddModal, { props: { isOpen: true } });

    await fireEvent.update(getByPlaceholderText('Masukkan judul lelang...'), 'Laptop Gaming');
    // Use container.querySelector to target number input by type
    const numberInput = container.querySelector('input[type="number"]');
    await fireEvent.update(numberInput, '5000000');
    await fireEvent.update(getByPlaceholderText('Jelaskan kondisi, spesifikasi, dan detail barang lelang...'), 'Kondisi 99%');
    const dtInput = container.querySelector('input[type="datetime-local"]');
    if (dtInput) await fireEvent.update(dtInput, '2025-12-31T23:59');

    await fireEvent.submit(getByRole('button', { name: /Simpan Lelang/i }));

    await waitFor(() => {
      expect(aucationApi.createAucation).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Laptop Gaming',
          description: 'Kondisi 99%',
          start_bid: 5000000,
        })
      );
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
      expect(emitted().refresh).toBeTruthy();
      expect(emitted().close).toBeTruthy();
    });
  });

  it('shows error dialog when submission fails with plain message', async () => {
    aucationApi.createAucation.mockRejectedValue(new Error('Gagal membuat lelang'));
    const { getByPlaceholderText, getByRole } = renderWithProviders(AddModal, { props: { isOpen: true } });

    await fireEvent.update(getByPlaceholderText('Masukkan judul lelang...'), 'Test');
    await fireEvent.submit(getByRole('button', { name: /Simpan Lelang/i }));

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Gagal membuat lelang');
    });
  });

  it('parses JSON error with errors field for specific messages', async () => {
    const jsonErr = JSON.stringify({ errors: { title: ['Judul wajib diisi'] } });
    aucationApi.createAucation.mockRejectedValue(new Error(jsonErr));
    const { getByPlaceholderText, getByRole } = renderWithProviders(AddModal, { props: { isOpen: true } });

    await fireEvent.update(getByPlaceholderText('Masukkan judul lelang...'), 'Test');
    await fireEvent.submit(getByRole('button', { name: /Simpan Lelang/i }));

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Judul wajib diisi');
    });
  });
});
