<template>
  <nav class="bg-gradient-to-r from-indigo-700 to-violet-700 text-white shadow-lg z-10 relative">
    <div class="px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <Gavel class="w-5 h-5 text-white" />
        </div>
        <span class="text-xl font-bold tracking-tight">Delcom Auction</span>
      </div>

      <!-- Right Side -->
      <div class="flex items-center gap-3">
        <div v-if="usersStore.currentUser" class="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl">
          <div class="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
            <User class="w-4 h-4 text-white" />
          </div>
          <span class="text-sm font-semibold hidden sm:block">{{ usersStore.currentUser.name }}</span>
        </div>
        <button
          @click="handleLogout"
          class="inline-flex items-center gap-1.5 bg-red-500/80 hover:bg-red-500 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <LogOut class="w-4 h-4" />
          <span class="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Gavel, User, LogOut } from 'lucide-vue-next';
import { useAuthStore } from '@/features/auth/states/authStore';
import { useUsersStore } from '@/features/users/states/usersStore';

const router = useRouter();
const authStore = useAuthStore();
const usersStore = useUsersStore();

onMounted(() => {
  if (!usersStore.currentUser) usersStore.fetchMe();
});

const handleLogout = () => {
  authStore.logoutUser();
  router.push('/auth/login');
};
</script>
