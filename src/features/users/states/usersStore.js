import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAllUsers, getMe } from '../api/userApi';

export const useUsersStore = defineStore('users', () => {
  const users = ref([]);
  const currentUser = ref(null);
  const loading = ref(false);

  const fetchUsers = async () => {
    loading.value = true;
    try {
      const res = await getAllUsers();
      users.value = res.data.users;
    } finally {
      loading.value = false;
    }
  };

  const fetchMe = async () => {
    try {
      const res = await getMe();
      currentUser.value = res.data.user;
    } catch (e) {
      currentUser.value = null;
    }
  };

  return { users, currentUser, loading, fetchUsers, fetchMe };
});

