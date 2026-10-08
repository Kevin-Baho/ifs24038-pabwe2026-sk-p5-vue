<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-labelledby="bid-modal-title">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="emit('close')" aria-hidden="true"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <span class="bg-green-100 p-2 rounded-lg" aria-hidden="true">
              <Gavel class="w-5 h-5 text-green-600" aria-hidden="true" />
            </span>
            <div>
              <h2 id="bid-modal-title" class="text-xl font-bold text-gray-800">Berikan Penawaran</h2>
            </div>
          </div>
          <button
            @click="emit('close')"
            class="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Tutup modal penawaran"
          >
            <X class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form @submit.prevent="onSubmit" class="p-6 space-y-5">
          <p class="text-sm text-gray-600">Masukkan jumlah penawaran Anda. Pastikan lebih tinggi dari penawaran terakhir.</p>

          <div>
            <label for="bid-amount" class="block text-sm font-semibold text-gray-700 mb-1.5">Jumlah Bid (Rp)</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold text-sm" aria-hidden="true">Rp</span>
              <input
                id="bid-amount"
                v-model="bidAmount"
                type="number"
                required
                min="1"
                placeholder="150000"
                class="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200"
                aria-label="Jumlah bid dalam Rupiah"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-1">
            <button type="button" @click="emit('close')" class="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200">
              Batal
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-700 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" aria-hidden="true" />
              <Gavel v-else class="w-4 h-4" aria-hidden="true" />
              {{ loading ? 'Mengirim...' : 'Ajukan Bid' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';
import { X, Loader2 } from 'lucide-vue-next';
import { Gavel } from 'lucide-vue-next';
import { addBid } from '../api/aucationApi';
import { showSuccessDialog, showErrorDialog } from '@/helpers/toolsHelper';

const props = defineProps({
  isOpen: Boolean,
  aucationId: { type: [String, Number], required: true },
});
const emit = defineEmits(['close', 'refresh']);

const bidAmount = ref('');
const loading = ref(false);

const onSubmit = async () => {
  loading.value = true;
  try {
    await addBid(props.aucationId, Number(bidAmount.value));
    await showSuccessDialog('Penawaran berhasil diajukan!');
    emit('refresh');
    emit('close');
    bidAmount.value = '';
  } catch (error) {
    showErrorDialog(error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
