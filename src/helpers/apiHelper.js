// File: src/helpers/apiHelper.js

const TOKEN_KEY = 'accessToken';

export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY) || '';
};

export const putAccessToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const removeAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Fungsi utama API Fetch yang mendukung token dan error handling detail
export const apiFetch = async (url, options = {}) => {
  const baseUrl = import.meta.env?.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1';

  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Jangan set Content-Type secara manual jika payload berupa FormData (untuk upload file/gambar)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const endpoint = url.startsWith('/') ? url : `/${url}`;
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  let responseJson;
  try {
    responseJson = await response.json();
  } catch (_) {
    responseJson = { message: 'Gagal memproses data server' };
  }

  // JIKA RESPONSE GAGAL DARI BACKEND (HTTP 4xx / 5xx)
  if (!response.ok) {
    let errorDetails = [];

    // Tangkap error validasi spesifik field (format umum Laravel/Delcom API)
    if (responseJson.errors && typeof responseJson.errors === 'object') {
      Object.entries(responseJson.errors).forEach(([field, msgs]) => {
        const msgText = Array.isArray(msgs) ? msgs.join(', ') : msgs;
        errorDetails.push(`${field}: ${msgText}`);
      });
    }

    let finalMessage = responseJson.message || 'Terjadi kesalahan pada server';
    if (errorDetails.length > 0) {
      finalMessage += `\n• ${errorDetails.join('\n• ')}`;
    }

    throw new Error(finalMessage);
  }

  return responseJson;
};

// ALIAS: Menghindari error "is not a function" jika ada file lain yang memanggil fetchWithToken
export const fetchWithToken = apiFetch;