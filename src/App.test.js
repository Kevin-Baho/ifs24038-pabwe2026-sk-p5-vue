import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/test-utils';
import App from './App.vue';

describe('App', () => {
  it('renders router-view', () => {
    const { container } = renderWithProviders(App);
    expect(container).toBeDefined();
  });
});

