import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/vue';
import { renderWithProviders } from '@/test-utils';
import { nextTick } from 'vue';
import HomePage from './HomePage.vue';
import { useAucationsStore } from '../states/aucationsStore';

vi.mock('@/helpers/toolsHelper', () => ({
  formatRupiah: vi.fn((val) => `Rp ${val}`),
}));

describe('HomePage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders header and tab buttons', () => {
    const { getByText } = renderWithProviders(HomePage);
    expect(getByText('Daftar Lelang')).toBeInTheDocument();
    expect(getByText('Semua')).toBeInTheDocument();
    expect(getByText('Lelang Saya')).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    const { getByText } = renderWithProviders(HomePage);
    const store = useAucationsStore();
    store.loading = true;
    await nextTick();
    expect(getByText('Memuat data lelang...')).toBeInTheDocument();
  });

  it('shows empty state when no auctions', async () => {
    const { getByText } = renderWithProviders(HomePage);
    const store = useAucationsStore();
    store.loading = false;
    store.aucations = [];
    await nextTick();
    expect(getByText('Tidak ada lelang ditemukan')).toBeInTheDocument();
  });

  it('renders auctions list with status badges', async () => {
    const { getByText, getAllByText } = renderWithProviders(HomePage);
    const store = useAucationsStore();
    store.loading = false;
    store.aucations = [
      { id: 1, title: 'Laptop Gaming', start_bid: 5000000, is_closed: 0 },
      { id: 2, title: 'HP Bekas', start_bid: 1000000, is_closed: 1 },
    ];
    await nextTick();
    expect(getByText('Laptop Gaming')).toBeInTheDocument();
    expect(getByText('HP Bekas')).toBeInTheDocument();
    expect(getByText('🟢 Aktif')).toBeInTheDocument();
    expect(getAllByText(/Selesai|Ditutup/).length).toBeGreaterThanOrEqual(1);
  });

  it('filters auctions by search query', async () => {
    const { getByPlaceholderText, queryByText, getByText } = renderWithProviders(HomePage);
    const store = useAucationsStore();
    store.loading = false;
    store.aucations = [
      { id: 1, title: 'Laptop Gaming', start_bid: 5000000, is_closed: 0 },
      { id: 2, title: 'HP Bekas', start_bid: 1000000, is_closed: 1 },
    ];
    await nextTick();
    await fireEvent.update(getByPlaceholderText('Cari judul lelang...'), 'Laptop');
    await nextTick();
    expect(getByText('Laptop Gaming')).toBeInTheDocument();
    expect(queryByText('HP Bekas')).not.toBeInTheDocument();
  });

  it('calls fetchAucations with isMe=1 when Lelang Saya tab clicked', async () => {
    const { getByText } = renderWithProviders(HomePage);
    const store = useAucationsStore();
    await fireEvent.click(getByText('Lelang Saya'));
    await waitFor(() => expect(store.fetchAucations).toHaveBeenCalledWith(1, 0));
  });

  it('calls fetchAucations with isClosed=1 when Ditutup tab clicked', async () => {
    const { getByText } = renderWithProviders(HomePage);
    const store = useAucationsStore();
    await fireEvent.click(getByText('Ditutup'));
    await waitFor(() => expect(store.fetchAucations).toHaveBeenCalledWith(0, 1));
  });

  it('opens AddModal when Buat Lelang is clicked', async () => {
    const { getByText, queryByText } = renderWithProviders(HomePage);
    expect(queryByText('Tambah Lelang Baru')).not.toBeInTheDocument();
    await fireEvent.click(getByText('Buat Lelang'));
    await nextTick();
    expect(getByText('Tambah Lelang Baru')).toBeInTheDocument();
  });

  it('renders start_price as fallback for start_bid', async () => {
    const { getByText } = renderWithProviders(HomePage);
    const store = useAucationsStore();
    store.loading = false;
    store.aucations = [{ id: 3, title: 'Motor Tua', start_price: 2000000, is_closed: 0 }];
    await nextTick();
    expect(getByText('Motor Tua')).toBeInTheDocument();
  });
});
