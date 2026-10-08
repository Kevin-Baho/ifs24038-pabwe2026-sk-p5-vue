import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/test-utils';
import NotFoundPage from './NotFoundPage.vue';

describe('NotFoundPage', () => {
  it('renders 404 message', () => {
    const { getByText } = renderWithProviders(NotFoundPage);
    expect(getByText('404 - Not Found')).toBeInTheDocument();
  });
});

