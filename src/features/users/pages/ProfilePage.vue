<template>
  <div class="p-6 max-w-2xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold">Profil Saya</h1>
    
    <div v-if="store.currentUser" class="bg-white p-6 rounded-lg shadow space-y-4">
      <div class="flex items-center gap-6">
        <img :src="store.currentUser.photo || 'https://ui-avatars.com/api/?name=' + store.currentUser.name" class="w-24 h-24 rounded-full object-cover" />
        <div>
          <p class="text-xl font-bold">{{ store.currentUser.name }}</p>
          <p class="text-gray-500">{{ store.currentUser.email }}</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="onUpdateProfile" class="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 class="font-bold text-lg">Edit Profil</h2>
      <div>
        <label class="block text-sm">Nama Lengkap</label>
        <input v-model="name" type="text" class="w-full border p-2 rounded mt-1" />
      </div>
      <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">Simpan Profil</button>
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

