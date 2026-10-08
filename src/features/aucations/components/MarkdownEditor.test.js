// File: src/features/aucations/components/MarkdownEditor.test.js
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/test-utils';
import MarkdownEditor from './MarkdownEditor.vue';
import { nextTick } from 'vue';

let mockChangeHandler;
const mockEditorInstance = {
  getMarkdown: vi.fn().mockReturnValue('mock data'),
  setMarkdown: vi.fn(),
  destroy: vi.fn(),
};

vi.mock('@toast-ui/editor', () => {
  return {
    default: vi.fn().mockImplementation((config) => {
      // Store the change handler so we can trigger it in tests
      mockChangeHandler = config.events?.change;
      return mockEditorInstance;
    }),
  };
});

describe('MarkdownEditor', () => {
  it('renders without crashing', async () => {
    const { container } = renderWithProviders(MarkdownEditor, {
      props: { modelValue: 'Hello' }
    });
    await nextTick();
    expect(container).toBeDefined();
  });

  it('calls destroy on unmount', async () => {
    const { unmount } = renderWithProviders(MarkdownEditor, {
      props: { modelValue: 'Hello' }
    });
    await nextTick();
    unmount();
    expect(mockEditorInstance.destroy).toHaveBeenCalled();
  });

  it('emits update:modelValue when editor content changes', async () => {
    const { emitted } = renderWithProviders(MarkdownEditor, {
      props: { modelValue: '' }
    });
    await nextTick();
    // Trigger the change event that was registered in onMounted
    if (mockChangeHandler) mockChangeHandler();
    expect(emitted()['update:modelValue']).toBeTruthy();
  });

  it('calls setMarkdown when modelValue prop changes to different value', async () => {
    mockEditorInstance.getMarkdown.mockReturnValue('old content');
    const { rerender } = renderWithProviders(MarkdownEditor, {
      props: { modelValue: 'old content' }
    });
    await nextTick();
    // Change prop to a new value different from current editor content
    await rerender({ modelValue: 'new content' });
    await nextTick();
    expect(mockEditorInstance.setMarkdown).toHaveBeenCalledWith('new content');
  });

  it('does not call setMarkdown when modelValue prop matches editor content', async () => {
    mockEditorInstance.getMarkdown.mockReturnValue('same content');
    mockEditorInstance.setMarkdown.mockClear();
    const { rerender } = renderWithProviders(MarkdownEditor, {
      props: { modelValue: 'same content' }
    });
    await nextTick();
    // Set the same value — should NOT call setMarkdown
    await rerender({ modelValue: 'same content' });
    await nextTick();
    expect(mockEditorInstance.setMarkdown).not.toHaveBeenCalled();
  });
});
