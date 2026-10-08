import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/test-utils';
import AuthLayout from './AuthLayout.vue';

describe('AuthLayout', () => {
  it('should render Delcom Auction branding', () => {
    const { getByText } = renderWithProviders(AuthLayout);
    expect(getByText('Delcom Auction')).toBeInTheDocument();
    expect(getByText('Platform Lelang Online Terpercaya')).toBeInTheDocument();
  });
});
