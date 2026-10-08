import { fetchWithToken } from '@/helpers/apiHelper';

export const getAllUsers = async () => fetchWithToken('/users', { method: 'GET' });
export const getMe = async () => fetchWithToken('/users/me', { method: 'GET' });
export const updateMe = async (name) => fetchWithToken('/users/me', { method: 'PUT', body: JSON.stringify({ name }) });

export const updatePhoto = async (photoFile) => {
  const formData = new FormData();
  formData.append('photo', photoFile);
  return fetchWithToken('/users/me/photo', { method: 'POST', body: formData });
};

export const updatePassword = async (old_password, new_password) => {
  return fetchWithToken('/users/me/password', {
    method: 'PUT',
    body: JSON.stringify({ old_password, new_password }),
  });
};
