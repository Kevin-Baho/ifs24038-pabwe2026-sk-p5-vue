import { fetchWithToken } from '@/helpers/apiHelper';

export const login = async (email, password) => {
  return await fetchWithToken('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (name, email, password) => {
  return await fetchWithToken('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
};

