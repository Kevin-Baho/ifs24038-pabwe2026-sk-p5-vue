<template>
  <form @submit.prevent="onRegister" class="space-y-5">
    <div class="text-center mb-2">
      <h2 class="text-2xl font-bold text-gray-800">Buat Akun Baru</h2>
      <p class="text-gray-500 text-sm mt-1">Isi data diri Anda untuk mendaftar</p>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
      <div class="relative">
        <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="name"
          @change="handleNameChange"
          type="text"
          placeholder="John Doe"
          required
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
      <div class="relative">
        <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="email"
          @change="handleEmailChange"
          type="email"
          placeholder="nama@email.com"
          required
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
      <div class="relative">
        <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="password"
          @change="handlePasswordChange"
          type="password"
          placeholder="••••••••"
          required
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
        />
      </div>
    </div>

    <button
      type="submit"
      :disabled="authStore.loading"
      class="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <Loader2 v-if="authStore.loading" class="w-4 h-4 animate-spin" />
      <UserPlus v-else class="w-4 h-4" />
      {{ authStore.loading ? 'Memproses...' : 'Buat Akun' }}
    </button>

    <p class="text-center text-sm text-gray-500">
      Sudah punya akun?
      <router-link to="/auth/login" class="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
        Masuk di sini
      </router-link>
    </p>
  </form>
</template>

<script setup>
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../states/authStore';
import useInput from '@/hooks/useInput';
import { showSuccessDialog, showErrorDialog } from '@/helpers/toolsHelper';

const authStore = useAuthStore();
const router = useRouter();
const [name, handleNameChange] = useInput('');
const [email, handleEmailChange] = useInput('');
const [password, handlePasswordChange] = useInput('');

const onRegister = async () => {
  try {
    await authStore.registerUser(name.value, email.value, password.value);
    await showSuccessDialog('Registrasi berhasil! Silakan login.');
    router.push('/auth/login');
  } catch (error) {
    showErrorDialog(error.message);
  }
};
</script>
