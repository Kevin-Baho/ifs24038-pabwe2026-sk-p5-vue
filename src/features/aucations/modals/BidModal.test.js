import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/vue';
import { renderWithProviders } from '@/test-utils';
import BidModal from './BidModal.vue';
import * as aucationApi from '../api/aucationApi';
import * as toolsHelper from '@/helpers/toolsHelper';

vi.mock('../api/aucationApi', () => ({ addBid: vi.fn() }));
vi.mock('@/helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(true),
  showErrorDialog: vi.fn(),
}));

describe('BidModal', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not render when isOpen is false', () => {
    const { queryByText } = renderWithProviders(BidModal, {
      props: { isOpen: false, aucationId: 1 },
    });
    expect(queryByText('Berikan Penawaran')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    const { getByText } = renderWithProviders(BidModal, {
      props: { isOpen: true, aucationId: 1 },
    });
    expect(getByText('Berikan Penawaran')).toBeInTheDocument();
  });

  it('emits close when Batal clicked', async () => {
    const { getByText, emitted } = renderWithProviders(BidModal, {
      props: { isOpen: true, aucationId: 1 },
    });
    await fireEvent.click(getByText('Batal'));
    expect(emitted().close).toBeTruthy();
  });

  it('emits close when backdrop is clicked', async () => {
    const { container, emitted } = renderWithProviders(BidModal, {
      props: { isOpen: true, aucationId: 1 },
    });
    const backdrop = container.querySelector('.absolute.inset-0');
    await fireEvent.click(backdrop);
    expect(emitted().close).toBeTruthy();
  });

  it('submits bid as Number and emits refresh and close', async () => {
    aucationApi.addBid.mockResolvedValue({});
    const { getByPlaceholderText, getByRole, emitted } = renderWithProviders(BidModal, {
      props: { isOpen: true, aucationId: 5 },
    });

    await fireEvent.update(getByPlaceholderText('150000'), '200000');
    await fireEvent.submit(getByRole('button', { name: /Ajukan Bid/i }));

    await waitFor(() => {
      expect(aucationApi.addBid).toHaveBeenCalledWith(5, 200000);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
      expect(emitted().refresh).toBeTruthy();
      expect(emitted().close).toBeTruthy();
    });
  });

  it('shows error when bid fails', async () => {
    aucationApi.addBid.mockRejectedValue(new Error('Bid terlalu rendah'));
    const { getByPlaceholderText, getByRole } = renderWithProviders(BidModal, {
      props: { isOpen: true, aucationId: 5 },
    });

    await fireEvent.update(getByPlaceholderText('150000'), '100');
    await fireEvent.submit(getByRole('button', { name: /Ajukan Bid/i }));

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Bid terlalu rendah');
    });
  });
});
