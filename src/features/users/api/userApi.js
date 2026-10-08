import { fetchWithToken, getAccessToken } from '@/helpers/apiHelper';

export const getAllUsers = async () => fetchWithToken('/users', { method: 'GET' });
export const getMe = async () => fetchWithToken('/users/me', { method: 'GET' });
export const updateMe = async (name) => fetchWithToken('/users/me', { method: 'PUT', body: JSON.stringify({ name }) });

export const updatePhoto = async (photoFile) => {
  const formData = new FormData();
  formData.append('photo', photoFile);
  const baseUrl = import.meta.env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1';
  const token = getAccessToken();
  const response = await fetch(`${baseUrl}/users/me/photo`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Gagal mengubah foto');
  }
  return response.json();
};

export const updatePassword = async (old_password, new_password) => {
  return fetchWithToken('/users/me/password', {
    method: 'PUT',
    body: JSON.stringify({ old_password, new_password }),
  });
};

