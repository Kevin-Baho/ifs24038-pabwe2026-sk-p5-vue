// File: src/test-utils.js
import { render } from '@testing-library/vue';
import { createTestingPinia } from '@pinia/testing';
import { createRouter, createWebHistory } from 'vue-router';
import { vi } from 'vitest';

export function renderWithProviders(ui, options = {}) {
  const router = createRouter({
    history: createWebHistory(),
    routes: options.routes || [{ path: '/', component: { template: '<div>Home</div>' } }],
  });

  // Navigate to initial route if provided
  if (options.initialRoute) {
    router.push(options.initialRoute);
  }

  const pinia = createTestingPinia({
    initialState: options.initialState || {},
    stubActions: false,
    createSpy: vi.fn,
  });

  return {
    ...render(ui, {
      global: {
        plugins: [pinia, router],
        ...options.global,
      },
      ...options,
    }),
    router,
    pinia,
  };
}

