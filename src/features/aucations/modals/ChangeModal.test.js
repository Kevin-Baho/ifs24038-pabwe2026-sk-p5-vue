// File: src/features/aucations/modals/ChangeModal.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/vue';
import { renderWithProviders } from '@/test-utils';
import ChangeModal from './ChangeModal.vue';
import * as aucationApi from '../api/aucationApi';
import * as toolsHelper from '@/helpers/toolsHelper';

vi.mock('../api/aucationApi', () => ({ updateAucation: vi.fn() }));
vi.mock('@/helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(true),
  showErrorDialog: vi.fn(),
}));

const mockAucation = {
  id: 1,
  title: 'Laptop',
  start_bid: 5000000,
  description: 'Bagus',
  closed_at: '2025-12-31T23:59:00Z',
};

describe('ChangeModal', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not render when isOpen is false', () => {
    const { queryByText } = renderWithProviders(ChangeModal, {
      props: { isOpen: false, aucation: mockAucation },
    });
    expect(queryByText('Edit Lelang')).not.toBeInTheDocument();
  });

  it('renders and pre-fills form when open', async () => {
    const { getByLabelText } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: mockAucation },
    });
    await waitFor(() => {
      expect(getByLabelText('Judul Lelang')).toBeInTheDocument();
    });
  });

  it('shows Batas Waktu field', () => {
    const { getByText } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: mockAucation },
    });
    expect(getByText('Batas Waktu Lelang')).toBeInTheDocument();
  });

  it('emits close when Batal clicked', async () => {
    const { getByText, emitted } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: mockAucation },
    });
    await fireEvent.click(getByText('Batal'));
    expect(emitted().close).toBeTruthy();
  });

  it('emits close when backdrop clicked', async () => {
    const { container, emitted } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: mockAucation },
    });
    const backdrop = container.querySelector('.absolute.inset-0');
    await fireEvent.click(backdrop);
    expect(emitted().close).toBeTruthy();
  });

  it('emits close when X close button clicked', async () => {
    const { getByLabelText, emitted } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: mockAucation },
    });
    await fireEvent.click(getByLabelText('Tutup modal edit lelang'));
    expect(emitted().close).toBeTruthy();
  });

  it('triggers v-model update handlers on all form inputs', async () => {
    const { getByLabelText } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: mockAucation },
    });
    await fireEvent.update(getByLabelText('Judul Lelang'), 'New Title');
    await fireEvent.update(getByLabelText('Harga Awal (Rp)'), '999');
    await fireEvent.update(getByLabelText('Batas Waktu Lelang'), '2027-01-01T12:00');
    await fireEvent.update(getByLabelText('Deskripsi Barang'), 'New Desc');
    expect(getByLabelText('Judul Lelang').value).toBe('New Title');
    expect(getByLabelText('Harga Awal (Rp)').value).toBe('999');
    expect(getByLabelText('Batas Waktu Lelang').value).toBe('2027-01-01T12:00');
    expect(getByLabelText('Deskripsi Barang').value).toBe('New Desc');
  });

  it('submits update with correct payload', async () => {
    aucationApi.updateAucation.mockResolvedValue({});
    const { getByRole, emitted } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: mockAucation },
    });

    await fireEvent.submit(getByRole('button', { name: /Update Lelang/i }));

    await waitFor(() => {
      expect(aucationApi.updateAucation).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ title: 'Laptop', start_bid: 5000000 })
      );
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
      expect(emitted().refresh).toBeTruthy();
    });
  });

  it('shows error when update fails with plain message', async () => {
    aucationApi.updateAucation.mockRejectedValue(new Error('Gagal update'));
    const { getByRole } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: mockAucation },
    });
    await fireEvent.submit(getByRole('button', { name: /Update Lelang/i }));
    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Gagal update');
    });
  });

  it('parses JSON error with errors field and shows field messages', async () => {
    const jsonErr = JSON.stringify({ errors: { title: ['Judul tidak valid'] } });
    aucationApi.updateAucation.mockRejectedValue(new Error(jsonErr));
    const { getByRole } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: mockAucation },
    });
    await fireEvent.submit(getByRole('button', { name: /Update Lelang/i }));
    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Judul tidak valid');
    });
  });

  it('falls back to error.message when JSON parses but has no errors field', async () => {
    // This covers the branch: JSON.parse succeeds but data.errors is undefined
    const jsonNoErrors = JSON.stringify({ message: 'Server error' });
    aucationApi.updateAucation.mockRejectedValue(new Error(jsonNoErrors));
    const { getByRole } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: mockAucation },
    });
    await fireEvent.submit(getByRole('button', { name: /Update Lelang/i }));
    await waitFor(() => {
      // Falls back to the raw error.message since no data.errors
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(jsonNoErrors);
    });
  });

  it('handles aucation with start_price fallback and null closed_at', async () => {
    const { getByLabelText } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: { id: 2, title: 'HP', start_price: 999000, description: 'Oke', closed_at: null } },
    });
    await waitFor(() => {
      expect(getByLabelText('Judul Lelang')).toBeInTheDocument();
    });
  });

  it('submits with empty closed_at ISO string when localClosedAt is not set', async () => {
    aucationApi.updateAucation.mockResolvedValue({});
    const { getByRole } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: { id: 3, title: 'Item', start_bid: 1000, description: 'Desc', closed_at: null } },
    });
    await fireEvent.submit(getByRole('button', { name: /Update Lelang/i }));
    await waitFor(() => {
      expect(aucationApi.updateAucation).toHaveBeenCalledWith(
        3,
        expect.objectContaining({ closed_at: '' })
      );
    });
  });

  it('handles aucation with undefined start_bid and undefined start_price', async () => {
    const { getByLabelText } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: { id: 4, title: 'Item 4', description: 'Desc' } },
    });
    expect(getByLabelText('Harga Awal (Rp)').value).toBe('0');
  });

  it('handles aucation without title and description fallbacks', async () => {
    const { getByLabelText } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, aucation: { id: 5, start_bid: 500 } },
    });
    expect(getByLabelText('Judul Lelang').value).toBe('');
  });
});
