// File: src/features/aucations/components/MarkdownViewer.test.js
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/test-utils';
import MarkdownViewer from './MarkdownViewer.vue';
import { nextTick } from 'vue';

const mockViewerInstance = {
  setMarkdown: vi.fn(),
};

vi.mock('@toast-ui/editor/dist/toastui-editor-viewer', () => {
  return {
    default: vi.fn().mockImplementation(() => mockViewerInstance),
  };
});

describe('MarkdownViewer', () => {
  it('renders without crashing', async () => {
    const { container } = renderWithProviders(MarkdownViewer, {
      props: { content: '# Hello' }
    });
    await nextTick();
    expect(container).toBeDefined();
  });

  it('calls setMarkdown when content prop changes', async () => {
    mockViewerInstance.setMarkdown.mockClear();
    const { rerender } = renderWithProviders(MarkdownViewer, {
      props: { content: '# Hello' }
    });
    await nextTick();
    await rerender({ content: '# Updated' });
    await nextTick();
    expect(mockViewerInstance.setMarkdown).toHaveBeenCalledWith('# Updated');
  });
});
