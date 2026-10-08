import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login, register } from '../api/authApi';
import { putAccessToken, removeAccessToken } from '@/helpers/apiHelper';

export const useAuthStore = defineStore('auth', () => {
  const isAuth = ref(false);
  const loading = ref(false);

  const loginUser = async (email, password) => {
    loading.value = true;
    try {
      const res = await login(email, password);
      putAccessToken(res.data.token);
      isAuth.value = true;
      return res;
    } finally {
      loading.value = false;
    }
  };

  const registerUser = async (name, email, password) => {
    loading.value = true;
    try {
      return await register(name, email, password);
    } finally {
      loading.value = false;
    }
  };

  const logoutUser = () => {
    removeAccessToken();
    isAuth.value = false;
  };

  return { isAuth, loading, loginUser, registerUser, logoutUser };
});

