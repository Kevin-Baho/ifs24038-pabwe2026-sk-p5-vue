<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Daftar Lelang</h1>
        <p class="text-sm text-gray-500 mt-0.5">Temukan dan ikuti lelang terbaik</p>
      </div>
      <button
        @click="isAddModalOpen = true"
        class="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200"
      >
        <PlusCircle class="w-4 h-4" />
        Buat Lelang
      </button>
    </div>

    <!-- Filter Tabs & Search -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <div class="flex gap-2 w-full md:w-auto">
        <button
          @click="setTab('all')"
          :class="activeTab === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          class="px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200"
        >Semua</button>
        <button
          @click="setTab('me')"
          :class="activeTab === 'me' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          class="px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200"
        >Lelang Saya</button>
        <button
          @click="setTab('closed')"
          :class="activeTab === 'closed' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          class="px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200"
        >Ditutup</button>
      </div>
      <div class="relative w-full md:w-72">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari judul lelang..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all duration-200"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="text-center py-20 text-gray-400">
      <div class="inline-flex flex-col items-center gap-3">
        <Loader2 class="w-10 h-10 animate-spin text-indigo-400" />
        <p class="font-medium">Memuat data lelang...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredAucations.length === 0" class="text-center py-20 text-gray-400">
      <div class="inline-flex flex-col items-center gap-3">
        <div class="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Package class="w-10 h-10 text-gray-300" />
        </div>
        <p class="font-semibold text-gray-500">Tidak ada lelang ditemukan</p>
        <p class="text-sm">Coba ubah filter atau kata kunci pencarian</p>
      </div>
    </div>

    <!-- Grid Lelang -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in filteredAucations"
        :key="item.id"
        class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <!-- Cover Image -->
        <div class="relative overflow-hidden bg-gray-100">
          <img
            :src="item.cover || 'https://placehold.co/800x450?text=No+Cover'"
            :alt="item.title"
            class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <!-- Status Badge -->
          <div class="absolute top-3 right-3">
            <span
              :class="item.is_closed
                ? 'bg-red-500/90 text-white'
                : 'bg-emerald-500/90 text-white'"
              class="px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm shadow"
            >
              {{ item.is_closed ? '🔒 Selesai' : '🟢 Aktif' }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-5 space-y-3">
          <h3 class="font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{{ item.title }}</h3>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-400">Harga Awal</p>
              <p class="text-indigo-600 font-bold text-sm">{{ formatRupiah(item.start_bid ?? item.start_price ?? 0) }}</p>
            </div>
          </div>
          <router-link
            :to="`/aucations/${item.id}`"
            class="flex items-center justify-center gap-2 w-full mt-1 py-2.5 bg-gray-50 hover:bg-indigo-600 hover:text-white text-gray-600 text-sm font-semibold rounded-xl transition-all duration-200 group/btn"
          >
            Lihat Detail
            <ArrowRight class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </router-link>
        </div>
      </div>
    </div>

    <AddModal :isOpen="isAddModalOpen" @close="isAddModalOpen = false" @refresh="loadData" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { PlusCircle, Search, Loader2, Package, ArrowRight } from 'lucide-vue-next';
import { useAucationsStore } from '../states/aucationsStore';
import AddModal from '../modals/AddModal.vue';
import { formatRupiah } from '@/helpers/toolsHelper';

const store = useAucationsStore();
const isAddModalOpen = ref(false);
const activeTab = ref('all');
const searchQuery = ref('');

const setTab = (tab) => { activeTab.value = tab; };

const loadData = () => {
  const isMe = activeTab.value === 'me' ? 1 : 0;
  const isClosed = activeTab.value === 'closed' ? 1 : 0;
  store.fetchAucations(isMe, isClosed);
};

onMounted(loadData);
watch(activeTab, loadData);

const filteredAucations = computed(() => {
  if (!searchQuery.value.trim()) return store.aucations;
  return store.aucations.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>
