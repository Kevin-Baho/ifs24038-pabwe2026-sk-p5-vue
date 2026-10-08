import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/test-utils';
import AucationLayout from './AucationLayout.vue';

describe('AucationLayout', () => {
  it('renders layout elements', () => {
    const { getByText } = renderWithProviders(AucationLayout);
    expect(getByText('Delcom Auction')).toBeInTheDocument(); // Dari Navbar
  });
});

