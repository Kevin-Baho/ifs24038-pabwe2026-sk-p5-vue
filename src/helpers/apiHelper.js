export const getAccessToken = () => localStorage.getItem('accessToken');
export const putAccessToken = (token) => localStorage.setItem('accessToken', token);
export const removeAccessToken = () => localStorage.removeItem('accessToken');

export const fetchWithToken = async (url, options = {}) => {
  const baseUrl = import.meta.env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1';
  const token = getAccessToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Handle FormData where Content-Type shouldn't be set manually
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers,
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Terjadi kesalahan pada server');
  }

  return responseJson;
};

