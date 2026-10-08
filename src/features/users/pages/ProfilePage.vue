<template>
  <div class="p-6 max-w-2xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Profil Saya</h1>

    <div v-if="store.currentUser" class="bg-white p-6 rounded-lg shadow space-y-4">
      <div class="flex items-center gap-6">
        <img
          :src="store.currentUser.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(store.currentUser.name)"
          :alt="store.currentUser.name ? `Foto profil ${store.currentUser.name}` : 'Foto Profil Pengguna'"
          class="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <p class="text-xl font-bold text-gray-900">{{ store.currentUser.name }}</p>
          <p class="text-gray-600">{{ store.currentUser.email }}</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="onUpdateProfile" class="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 class="font-bold text-lg text-gray-900">Edit Profil</h2>
      <div>
        <label for="profile-name" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
        <input
          id="profile-name"
          v-model="name"
          type="text"
          class="w-full border p-2 rounded mt-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autocomplete="name"
        />
      </div>
      <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition font-medium">
        Simpan Profil
      </button>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useUsersStore } from '../states/usersStore';
import { updateMe } from '../api/userApi';
import { showSuccessDialog, showErrorDialog } from '@/helpers/toolsHelper';

const store = useUsersStore();
const name = ref('');

onMounted(async () => {
  await store.fetchMe();
  if (store.currentUser) {
    name.value = store.currentUser.name;
  }
});

const onUpdateProfile = async () => {
  try {
    await updateMe(name.value);
    await store.fetchMe();
    showSuccessDialog('Profil berhasil diupdate');
  } catch (error) {
    showErrorDialog(error.message);
  }
};
</script>
