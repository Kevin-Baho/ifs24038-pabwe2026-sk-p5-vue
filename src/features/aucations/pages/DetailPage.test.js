// File: src/features/aucations/pages/DetailPage.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/vue';
import { renderWithProviders } from '@/test-utils';
import { nextTick } from 'vue';
import DetailPage from './DetailPage.vue';
import * as aucationApi from '../api/aucationApi';
import * as toolsHelper from '@/helpers/toolsHelper';
import { useUsersStore } from '@/features/users/states/usersStore';

vi.mock('../api/aucationApi', () => ({
  getAucationById: vi.fn(),
  closeAucation: vi.fn(),
  deleteAucation: vi.fn(),
}));

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: () => ({ params: { aucationId: '1' } }),
    useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  };
});

vi.mock('@/helpers/toolsHelper', () => ({
  formatRupiah: vi.fn((val) => `Rp ${val}`),
  formatDate: vi.fn((val) => `Tanggal: ${val}`),
  showConfirmDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
  showSuccessDialog: vi.fn().mockResolvedValue(true),
  showErrorDialog: vi.fn(),
}));

const mockAucation = {
  id: 1,
  title: 'Barang Antik',
  start_price: 1000000,
  description: 'Barang langka',
  is_closed: 0,
  creator_id: 99,
  creator: { name: 'Penjual' },
};

const mockBids = [
  { id: 1, bid_amount: 1500000, bidder: { name: 'Budi' }, created_at: '2023-01-01' },
];

describe('DetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: mockAucation, bids: [] } });
    const { getByText } = renderWithProviders(DetailPage);
    expect(getByText('Memuat detail lelang...')).toBeInTheDocument();
  });

  it('loads and renders auction detail', async () => {
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: mockAucation, bids: mockBids } });
    const { getByText } = renderWithProviders(DetailPage);

    await waitFor(() => {
      expect(getByText('Barang Antik')).toBeInTheDocument();
      expect(getByText('Penjual')).toBeInTheDocument();
      expect(getByText('Budi')).toBeInTheDocument();
      expect(getByText('Riwayat Penawaran (1)')).toBeInTheDocument();
    });
  });

  it('shows "Anonim" when creator name is missing', async () => {
    const aucationNoCreator = { ...mockAucation, creator: null };
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: aucationNoCreator, bids: [] } });
    const { getByText } = renderWithProviders(DetailPage);
    await waitFor(() => {
      expect(getByText('Anonim')).toBeInTheDocument();
    });
  });

  it('shows "Anonim" when bidder name is missing', async () => {
    const bidsNoName = [{ id: 2, bid_amount: 500000, bidder: null, created_at: '2023-01-01' }];
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: mockAucation, bids: bidsNoName } });
    const { getAllByText } = renderWithProviders(DetailPage);
    await waitFor(() => {
      expect(getAllByText('Anonim').length).toBeGreaterThan(0);
    });
  });

  it('shows closed badge when auction is closed', async () => {
    const closedAucation = { ...mockAucation, is_closed: 1 };
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: closedAucation, bids: [] } });
    const { getByText } = renderWithProviders(DetailPage);
    await waitFor(() => {
      expect(getByText('Lelang Selesai')).toBeInTheDocument();
    });
  });

  it('shows empty bids message when no bids', async () => {
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: mockAucation, bids: [] } });
    const { getByText } = renderWithProviders(DetailPage);
    await waitFor(() => {
      expect(getByText('Belum ada penawaran untuk lelang ini.')).toBeInTheDocument();
    });
  });

  it('shows error when fetchData fails', async () => {
    aucationApi.getAucationById.mockRejectedValue(new Error('Fetch error'));
    renderWithProviders(DetailPage);
    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Gagal memuat detail lelang');
    });
  });

  it('shows bid and edit buttons when auction is active and user is owner', async () => {
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: mockAucation, bids: [] } });
    const { getByText } = renderWithProviders(DetailPage);
    const store = useUsersStore();
    store.currentUser = { id: 99, name: 'Penjual' };

    await waitFor(() => {
      expect(getByText('💰 Berikan Penawaran')).toBeInTheDocument();
      expect(getByText('✏️ Edit')).toBeInTheDocument();
      expect(getByText('🔒 Tutup Lelang')).toBeInTheDocument();
      expect(getByText('🗑️ Hapus')).toBeInTheDocument();
    });
  });

  it('isMyAucation returns false when currentUser is null', async () => {
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: mockAucation, bids: [] } });
    const { queryByText } = renderWithProviders(DetailPage);
    const store = useUsersStore();
    store.currentUser = null;

    await waitFor(() => {
      // Owner buttons should not show
      expect(queryByText('✏️ Edit')).not.toBeInTheDocument();
    });
  });

  it('handles close auction', async () => {
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: mockAucation, bids: [] } });
    aucationApi.closeAucation.mockResolvedValue({});
    const { getByText } = renderWithProviders(DetailPage);
    const store = useUsersStore();
    store.currentUser = { id: 99, name: 'Penjual' };

    await waitFor(() => getByText('🔒 Tutup Lelang'));
    await fireEvent.click(getByText('🔒 Tutup Lelang'));

    await waitFor(() => {
      expect(aucationApi.closeAucation).toHaveBeenCalledWith('1');
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });
  });

  it('handles delete auction', async () => {
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: mockAucation, bids: [] } });
    aucationApi.deleteAucation.mockResolvedValue({});
    const { getByText } = renderWithProviders(DetailPage);
    const store = useUsersStore();
    store.currentUser = { id: 99, name: 'Penjual' };

    await waitFor(() => getByText('🗑️ Hapus'));
    await fireEvent.click(getByText('🗑️ Hapus'));

    await waitFor(() => {
      expect(aucationApi.deleteAucation).toHaveBeenCalledWith('1');
    });
  });

  it('does not close when confirm is cancelled', async () => {
    toolsHelper.showConfirmDialog.mockResolvedValue({ isConfirmed: false });
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: mockAucation, bids: [] } });
    const { getByText } = renderWithProviders(DetailPage);
    const store = useUsersStore();
    store.currentUser = { id: 99, name: 'Penjual' };

    await waitFor(() => getByText('🔒 Tutup Lelang'));
    await fireEvent.click(getByText('🔒 Tutup Lelang'));
    await nextTick();

    expect(aucationApi.closeAucation).not.toHaveBeenCalled();
  });

  it('handles close auction error', async () => {
    toolsHelper.showConfirmDialog.mockResolvedValue({ isConfirmed: true });
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: mockAucation, bids: [] } });
    aucationApi.closeAucation.mockRejectedValue(new Error('Gagal tutup'));
    const { getByText } = renderWithProviders(DetailPage);
    const store = useUsersStore();
    store.currentUser = { id: 99, name: 'Penjual' };

    await waitFor(() => getByText('🔒 Tutup Lelang'));
    await fireEvent.click(getByText('🔒 Tutup Lelang'));

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Gagal tutup');
    });
  });

  it('handles delete auction error', async () => {
    toolsHelper.showConfirmDialog.mockResolvedValue({ isConfirmed: true });
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: mockAucation, bids: [] } });
    aucationApi.deleteAucation.mockRejectedValue(new Error('Gagal hapus'));
    const { getByText } = renderWithProviders(DetailPage);
    const store = useUsersStore();
    store.currentUser = { id: 99, name: 'Penjual' };

    await waitFor(() => getByText('🗑️ Hapus'));
    await fireEvent.click(getByText('🗑️ Hapus'));

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Gagal hapus');
    });
  });

  it('shows active bid button for non-owner user', async () => {
    aucationApi.getAucationById.mockResolvedValue({ data: { aucation: mockAucation, bids: [] } });
    const { getByText, queryByText } = renderWithProviders(DetailPage);
    const store = useUsersStore();
    store.currentUser = { id: 77, name: 'Pembeli' }; // different from creator_id 99

    await waitFor(() => {
      expect(getByText('💰 Berikan Penawaran')).toBeInTheDocument();
      expect(queryByText('✏️ Edit')).not.toBeInTheDocument();
    });
  });
});
