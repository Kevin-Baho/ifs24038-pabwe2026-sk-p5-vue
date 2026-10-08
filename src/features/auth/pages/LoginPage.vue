<template>
  <form @submit.prevent="onLogin" class="space-y-5" aria-label="Formulir Login">
    <div class="text-center mb-2">
      <h2 class="text-2xl font-bold text-gray-800">Selamat Datang!</h2>
      <p class="text-gray-600 text-sm mt-1">Masuk ke akun Anda untuk melanjutkan</p>
    </div>

    <div>
      <label for="login-email" class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
      <div class="relative">
        <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
        <input
          id="login-email"
          v-model="email"
          @change="handleEmailChange"
          type="email"
          placeholder="nama@email.com"
          required
          autocomplete="email"
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
        />
      </div>
    </div>

    <div>
      <label for="login-password" class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
      <div class="relative">
        <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
        <input
          id="login-password"
          v-model="password"
          @change="handlePasswordChange"
          type="password"
          placeholder="••••••••"
          required
          autocomplete="current-password"
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
        />
      </div>
    </div>

    <button
      type="submit"
      :disabled="authStore.loading"
      class="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <Loader2 v-if="authStore.loading" class="w-4 h-4 animate-spin" aria-hidden="true" />
      <LogIn v-else class="w-4 h-4" aria-hidden="true" />
      {{ authStore.loading ? 'Memproses...' : 'Masuk Sekarang' }}
    </button>

    <p class="text-center text-sm text-gray-600">
      Belum punya akun?
      <router-link to="/auth/register" class="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
        Daftar di sini
      </router-link>
    </p>
  </form>
</template>

<script setup>
import { Mail, Lock, LogIn, Loader2 } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../states/authStore';
import useInput from '@/hooks/useInput';
import { showSuccessDialog, showErrorDialog } from '@/helpers/toolsHelper';

const authStore = useAuthStore();
const router = useRouter();
const [email, handleEmailChange] = useInput('');
const [password, handlePasswordChange] = useInput('');

const onLogin = async () => {
  try {
    await authStore.loginUser(email.value, password.value);
    await showSuccessDialog('Login berhasil!');
    router.push('/');
  } catch (error) {
    showErrorDialog(error.message);
  }
};
</script>