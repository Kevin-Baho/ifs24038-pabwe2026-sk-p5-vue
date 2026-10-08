import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAucationsStore } from './aucationsStore';
import * as aucationApi from '../api/aucationApi';

vi.mock('../api/aucationApi', () => ({ getAucations: vi.fn() }));

describe('aucationsStore', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('fetchAucations sets state correctly', async () => {
    const store = useAucationsStore();
    aucationApi.getAucations.mockResolvedValue({ data: { aucations: [{ id: 1 }] } });
    await store.fetchAucations();
    expect(store.aucations.length).toBe(1);
    expect(store.loading).toBe(false);
  });
});

