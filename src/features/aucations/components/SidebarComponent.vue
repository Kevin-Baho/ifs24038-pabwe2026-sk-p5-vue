<template>
  <aside class="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col p-4 gap-1">
    <p class="text-xs font-bold text-gray-600 uppercase tracking-widest px-3 mb-2">Menu</p>
    <router-link
      to="/"
      class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
      :class="$route.path === '/' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
    >
      <LayoutDashboard class="w-4 h-4" />
      Dashboard
    </router-link>
    <router-link
      to="/users"
      class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
      :class="$route.path === '/users' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
    >
      <Users class="w-4 h-4" />
      Pengguna
    </router-link>
    <router-link
      to="/profile"
      class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
      :class="$route.path === '/profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
    >
      <UserCircle class="w-4 h-4" />
      Profil Saya
    </router-link>
  </aside>
</template>

<script setup>
import { LayoutDashboard, Users, UserCircle } from 'lucide-vue-next';
</script>
