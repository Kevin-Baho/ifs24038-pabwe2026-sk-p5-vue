<template>
  <div v-if="aucation" class="max-w-4xl mx-auto space-y-6">
    <!-- Back button -->
    <button @click="$router.back()"
      class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition"
      aria-label="Kembali ke halaman sebelumnya">
      ← Kembali
    </button>

    <!-- Aucation Detail Card -->
    <article class="bg-white rounded-xl shadow border overflow-hidden">
      <img :src="aucation.cover || 'https://placehold.co/800x300?text=No+Cover'"
        :alt="aucation.title ? `Cover lelang: ${aucation.title}` : 'Cover Barang Lelang'"
        class="w-full h-64 object-cover" />
      <div class="p-6 space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900">{{ aucation.title }}</h1>
            <p class="text-gray-600 mt-1 text-sm">
              Oleh: <span class="font-semibold">{{ aucation.creator?.name || 'Anonim' }}</span>
            </p>
          </div>
          <span :class="aucation.is_closed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
            class="px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
            {{ aucation.is_closed ? 'Lelang Selesai' : 'Lelang Aktif' }}
          </span>
        </div>

        <div class="border-t pt-4">
          <p class="text-3xl font-bold text-indigo-600">{{ formatRupiah(aucation.start_price) }}</p>
          <p class="text-xs text-gray-600 mt-1 font-medium">Harga Awal</p>
        </div>

        <div class="border-t pt-4">
          <h2 class="font-bold text-lg mb-2">Deskripsi Barang</h2>
          <div class="prose max-w-none text-gray-700 whitespace-pre-wrap">{{ aucation.description }}</div>
        </div>

        <!-- Action Buttons -->
        <div v-if="!aucation.is_closed" class="border-t pt-4 flex flex-wrap gap-3">
          <button @click="isBidModalOpen = true"
            class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium">
            💰 Berikan Penawaran
          </button>
          <template v-if="isMyAucation">
            <button @click="isChangeModalOpen = true"
              class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
              ✏️ Edit
            </button>
            <button @click="isChangeCoverModalOpen = true"
              class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-medium">
              🖼️ Cover
            </button>
            <button @click="handleCloseAucation"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium">
              🔒 Tutup Lelang
            </button>
            <button @click="handleDeleteAucation"
              class="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition font-medium">
              🗑️ Hapus
            </button>
          </template>
        </div>
      </div>
    </article>

    <!-- Riwayat Bids -->
    <section class="bg-white rounded-xl shadow border p-6" aria-label="Riwayat Penawaran">
      <h2 class="text-xl font-bold mb-4 text-gray-800">Riwayat Penawaran ({{ bids.length }})</h2>
      <div v-if="bids.length === 0" class="text-center py-8 text-gray-600">
        <p>Belum ada penawaran untuk lelang ini.</p>
      </div>
      <ul v-else class="divide-y" aria-label="Daftar penawaran">
        <li v-for="bid in bids" :key="bid.id" class="flex justify-between items-center py-3">
          <div>
            <p class="font-semibold text-gray-800">{{ bid.bidder?.name || 'Anonim' }}</p>
            <p class="text-xs text-gray-600">{{ formatDate(bid.created_at) }}</p>
          </div>
          <span class="font-bold text-indigo-600">{{ formatRupiah(bid.bid_amount) }}</span>
        </li>
      </ul>
    </section>

    <!-- Modals -->
    <BidModal
      :isOpen="isBidModalOpen"
      :aucationId="aucation.id"
      @close="isBidModalOpen = false"
      @refresh="fetchData" />
    <ChangeModal
      :isOpen="isChangeModalOpen"
      :aucation="aucation"
      @close="isChangeModalOpen = false"
      @refresh="fetchData" />
    <ChangeCoverModal
      :isOpen="isChangeCoverModalOpen"
      :aucationId="aucation.id"
      @close="isChangeCoverModalOpen = false"
      @refresh="fetchData" />
  </div>

  <!-- Loading state -->
  <div v-else class="text-center py-20 text-gray-600" role="status" aria-live="polite">
    <div class="text-5xl mb-3" aria-hidden="true">⏳</div>
    <p>Memuat detail lelang...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAucationById, closeAucation, deleteAucation } from '../api/aucationApi';
import { useUsersStore } from '@/features/users/states/usersStore';
import { formatRupiah, formatDate, showConfirmDialog, showSuccessDialog, showErrorDialog } from '@/helpers/toolsHelper';
import BidModal from '../modals/BidModal.vue';
import ChangeModal from '../modals/ChangeModal.vue';
import ChangeCoverModal from '../modals/ChangeCoverModal.vue';

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();

const aucation = ref(null);
const bids = ref([]);
const isBidModalOpen = ref(false);
const isChangeModalOpen = ref(false);
const isChangeCoverModalOpen = ref(false);

const isMyAucation = computed(() => {
  if (!usersStore.currentUser || !aucation.value) return false;
  return usersStore.currentUser.id === aucation.value.creator_id;
});

const fetchData = async () => {
  try {
    const res = await getAucationById(route.params.aucationId);
    aucation.value = res.data.aucation;
    bids.value = res.data.bids || [];
  } catch (err) {
    showErrorDialog('Gagal memuat detail lelang');
  }
};

const handleCloseAucation = async () => {
  const result = await showConfirmDialog('Tutup lelang ini? Tindakan tidak dapat dibatalkan.');
  if (result.isConfirmed) {
    try {
      await closeAucation(route.params.aucationId);
      await showSuccessDialog('Lelang berhasil ditutup');
      fetchData();
    } catch (e) {
      showErrorDialog(e.message);
    }
  }
};

const handleDeleteAucation = async () => {
  const result = await showConfirmDialog('Hapus lelang ini secara permanen?');
  if (result.isConfirmed) {
    try {
      await deleteAucation(route.params.aucationId);
      await showSuccessDialog('Lelang berhasil dihapus');
      router.push('/');
    } catch (e) {
      showErrorDialog(e.message);
    }
  }
};

onMounted(() => {
  usersStore.fetchMe();
  fetchData();
});
</script>
