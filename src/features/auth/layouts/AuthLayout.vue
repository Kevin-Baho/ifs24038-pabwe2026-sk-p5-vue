<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
    <main role="main" class="w-full max-w-md">
      <!-- Logo Card -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-xl mb-4">
          <Gavel class="w-8 h-8 text-white" aria-hidden="true" />
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Delcom Auction
        </h1>
        <p class="text-gray-600 mt-1 text-sm">Platform Lelang Online Terpercaya</p>
      </div>

      <!-- Auth Card -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { Gavel } from 'lucide-vue-next';
</script>
