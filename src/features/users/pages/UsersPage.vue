<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-gray-800">Daftar Pengguna</h1>
    <div v-if="store.loading" class="text-gray-600" role="status" aria-live="polite">Memuat data...</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="user in store.users" :key="user.id" class="p-4 border rounded-lg bg-white shadow flex items-center gap-4">
        <img
          :src="user.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)"
          :alt="user.name ? `Foto profil ${user.name}` : 'Foto Profil Pengguna'"
          class="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p class="font-semibold text-gray-900">{{ user.name }}</p>
          <p class="text-sm text-gray-600">{{ user.email }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUsersStore } from '../states/usersStore';

const store = useUsersStore();

onMounted(() => {
  store.fetchUsers();
});
</script>
