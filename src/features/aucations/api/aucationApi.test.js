import { describe, it, expect, vi } from 'vitest';
import * as aucationApi from './aucationApi';
import * as apiHelper from '@/helpers/apiHelper';

vi.mock('@/helpers/apiHelper', () => ({ fetchWithToken: vi.fn() }));

describe('aucationApi', () => {
  it('getAucations calls correctly', async () => {
    await aucationApi.getAucations(1, 0);
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/aucations?is_me=1&is_closed=0', expect.any(Object));
  });
  it('getAucationById calls correctly', async () => {
    await aucationApi.getAucationById(1);
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/aucations/1', expect.any(Object));
  });
  it('createAucation sends correct payload with start_bid as Number', async () => {
    await aucationApi.createAucation({ title: 'HP', description: 'Bagus', start_bid: '5000', closed_at: '2025-01-01T00:00:00Z' });
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith(
      '/aucations',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ title: 'HP', description: 'Bagus', start_bid: 5000, closed_at: '2025-01-01T00:00:00Z' }),
      })
    );
  });
  it('updateAucation sends correct payload with start_bid as Number', async () => {
    await aucationApi.updateAucation(1, { title: 'HP', description: 'Bagus', start_bid: '5000', closed_at: '2025-01-01T00:00:00Z' });
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith(
      '/aucations/1',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ title: 'HP', description: 'Bagus', start_bid: 5000, closed_at: '2025-01-01T00:00:00Z' }),
      })
    );
  });
  it('closeAucation calls correctly', async () => {
    await aucationApi.closeAucation(1);
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/aucations/1', expect.objectContaining({ method: 'PUT', body: JSON.stringify({ is_closed: 1 }) }));
  });
  it('updateCover calls correctly', async () => {
    const file = new File([''], 'cover.jpg');
    await aucationApi.updateCover(1, file);
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/aucations/1/cover', expect.objectContaining({ method: 'POST' }));
  });
  it('addBid sends bid_amount as Number', async () => {
    await aucationApi.addBid(1, '100');
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith(
      '/aucations/1/bids',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ bid_amount: 100 }) })
    );
  });
  it('deleteAucation calls correctly', async () => {
    await aucationApi.deleteAucation(1);
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/aucations/1', expect.objectContaining({ method: 'DELETE' }));
  });
  it('deleteBid calls correctly', async () => {
    await aucationApi.deleteBid(1, 2);
    expect(apiHelper.fetchWithToken).toHaveBeenCalledWith('/aucations/1/bids/2', expect.objectContaining({ method: 'DELETE' }));
  });
});
