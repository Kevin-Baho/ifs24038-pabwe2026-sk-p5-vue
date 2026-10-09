// File: src/features/aucations/modals/ChangeCoverModal.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/vue';
import { renderWithProviders } from '@/test-utils';
import ChangeCoverModal from './ChangeCoverModal.vue';
import * as aucationApi from '../api/aucationApi';
import * as toolsHelper from '@/helpers/toolsHelper';

vi.mock('../api/aucationApi', () => ({ updateCover: vi.fn() }));
vi.mock('@/helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(true),
  showErrorDialog: vi.fn(),
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

describe('ChangeCoverModal', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not render when isOpen is false', () => {
    const { queryByText } = renderWithProviders(ChangeCoverModal, {
      props: { isOpen: false, aucationId: 1 },
    });
    expect(queryByText('Ubah Cover Lelang')).not.toBeInTheDocument();
  });

  it('renders correctly when open', () => {
    const { getByText } = renderWithProviders(ChangeCoverModal, {
      props: { isOpen: true, aucationId: 1 },
    });
    expect(getByText('Ubah Cover Lelang')).toBeInTheDocument();
  });

  it('emits close when Batal clicked', async () => {
    const { getByText, emitted } = renderWithProviders(ChangeCoverModal, {
      props: { isOpen: true, aucationId: 1 },
    });
    await fireEvent.click(getByText('Batal'));
    expect(emitted().close).toBeTruthy();
  });

  it('emits close when backdrop is clicked', async () => {
    const { container, emitted } = renderWithProviders(ChangeCoverModal, {
      props: { isOpen: true, aucationId: 1 },
    });
    const backdrop = container.querySelector('.absolute.inset-0');
    await fireEvent.click(backdrop);
    expect(emitted().close).toBeTruthy();
  });

  it('emits close when X close button clicked', async () => {
    const { getByLabelText, emitted } = renderWithProviders(ChangeCoverModal, {
      props: { isOpen: true, aucationId: 1 },
    });
    await fireEvent.click(getByLabelText('Tutup modal ubah cover'));
    expect(emitted().close).toBeTruthy();
  });

  it('handles file change and shows preview', async () => {
    const { container } = renderWithProviders(ChangeCoverModal, {
      props: { isOpen: true, aucationId: 1 },
    });
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['img'], 'cover.jpg', { type: 'image/jpeg' });
    await fireEvent.change(fileInput, { target: { files: [file] } });

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
  });

  it('does not crash if file input has no files', async () => {
    const { container } = renderWithProviders(ChangeCoverModal, {
      props: { isOpen: true, aucationId: 1 },
    });
    const fileInput = container.querySelector('input[type="file"]');
    // Fire change with empty files array
    await fireEvent.change(fileInput, { target: { files: [] } });
    // URL.createObjectURL should NOT be called when no file selected
    expect(global.URL.createObjectURL).not.toHaveBeenCalled();
  });

  it('does not call updateCover when no file selected (submit with no file)', async () => {
    const { getByRole } = renderWithProviders(ChangeCoverModal, {
      props: { isOpen: true, aucationId: 1 },
    });
    // Submit without selecting a file — should early-return
    await fireEvent.submit(getByRole('button', { name: /Upload Cover/i }));
    expect(aucationApi.updateCover).not.toHaveBeenCalled();
  });

  it('uploads cover successfully', async () => {
    aucationApi.updateCover.mockResolvedValue({});
    const { container, getByRole, emitted } = renderWithProviders(ChangeCoverModal, {
      props: { isOpen: true, aucationId: 1 },
    });
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['img'], 'cover.jpg', { type: 'image/jpeg' });
    await fireEvent.change(fileInput, { target: { files: [file] } });
    await fireEvent.submit(getByRole('button', { name: /Upload Cover/i }));

    await waitFor(() => {
      expect(aucationApi.updateCover).toHaveBeenCalledWith(1, file);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
      expect(emitted().refresh).toBeTruthy();
      expect(emitted().close).toBeTruthy();
    });
  });

  it('shows error when upload fails', async () => {
    aucationApi.updateCover.mockRejectedValue(new Error('Gagal upload'));
    const { container, getByRole } = renderWithProviders(ChangeCoverModal, {
      props: { isOpen: true, aucationId: 1 },
    });
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['img'], 'cover.jpg', { type: 'image/jpeg' });
    await fireEvent.change(fileInput, { target: { files: [file] } });
    await fireEvent.submit(getByRole('button', { name: /Upload Cover/i }));

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Gagal upload');
    });
  });
});
