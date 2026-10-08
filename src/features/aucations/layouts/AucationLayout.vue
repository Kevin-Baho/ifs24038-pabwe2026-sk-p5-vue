<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <NavbarComponent />
    <div class="flex flex-1 overflow-hidden">
      <SidebarComponent />
      <main class="flex-1 overflow-y-auto p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import NavbarComponent from '../components/NavbarComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
</script>

