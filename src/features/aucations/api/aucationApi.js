import { fetchWithToken } from '@/helpers/apiHelper';

export const getAucations = async (isMe = 0, isClosed = 0) =>
  fetchWithToken(`/aucations?is_me=${isMe}&is_closed=${isClosed}`, { method: 'GET' });

export const getAucationById = async (id) =>
  fetchWithToken(`/aucations/${id}`, { method: 'GET' });

export const createAucation = async ({ title, description, start_bid, closed_at }) =>
  fetchWithToken('/aucations', {
    method: 'POST',
    body: JSON.stringify({ title, description, start_bid: Number(start_bid), closed_at }),
  });

export const updateAucation = async (id, { title, description, start_bid, closed_at }) =>
  fetchWithToken(`/aucations/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, description, start_bid: Number(start_bid), closed_at }),
  });

export const closeAucation = async (id) =>
  fetchWithToken(`/aucations/${id}`, { method: 'PUT', body: JSON.stringify({ is_closed: 1 }) });

export const updateCover = async (id, coverFile) => {
  const formData = new FormData();
  formData.append('cover', coverFile);
  return fetchWithToken(`/aucations/${id}/cover`, { method: 'POST', body: formData });
};

export const addBid = async (id, bid_amount) =>
  fetchWithToken(`/aucations/${id}/bids`, {
    method: 'POST',
    body: JSON.stringify({ bid_amount: Number(bid_amount) }),
  });

export const deleteAucation = async (id) =>
  fetchWithToken(`/aucations/${id}`, { method: 'DELETE' });

export const deleteBid = async (aucationId, bidId) =>
  fetchWithToken(`/aucations/${aucationId}/bids/${bidId}`, { method: 'DELETE' });
