<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="emit('close')"
      ></div>

      <!-- Modal Box -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <span class="bg-indigo-100 p-2 rounded-lg">
              <PlusCircle class="w-5 h-5 text-indigo-600" />
            </span>
            <h2 class="text-xl font-bold text-gray-800">Tambah Lelang Baru</h2>
          </div>
          <button
            @click="emit('close')"
            class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="onSubmit" class="p-6 space-y-5">
          <!-- Judul -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Judul Lelang</label>
            <input
              v-model="title"
              type="text"
              required
              placeholder="Masukkan judul lelang..."
              class="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
            />
          </div>

          <!-- Harga & Waktu -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Harga Awal (Rp)</label>
              <input
                v-model="startBid"
                type="number"
                required
                min="0"
                placeholder="0"
                class="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Batas Waktu Lelang</label>
              <input
                v-model="closedAt"
                type="datetime-local"
                required
                class="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi Barang</label>
            <textarea
              v-model="description"
              rows="5"
              placeholder="Jelaskan kondisi, spesifikasi, dan detail barang lelang..."
              class="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 resize-none"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex justify-end items-center gap-3 pt-2">
            <button
              type="button"
              @click="emit('close')"
              class="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              {{ loading ? 'Menyimpan...' : 'Simpan Lelang' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';
import { PlusCircle, X, Save, Loader2 } from 'lucide-vue-next';
import { createAucation } from '../api/aucationApi';
import { showSuccessDialog, showErrorDialog } from '@/helpers/toolsHelper';

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close', 'refresh']);

const title = ref('');
const startBid = ref('');
const closedAt = ref('');
const description = ref('');
const loading = ref(false);

const resetForm = () => {
  title.value = '';
  startBid.value = '';
  closedAt.value = '';
  description.value = '';
};

const parseErrorMessage = (error) => {
  try {
    const data = JSON.parse(error.message);
    if (data.errors) {
      return Object.values(data.errors).flat().join('\n');
    }
  } catch (_) {}
  return error.message;
};

const onSubmit = async () => {
  loading.value = true;
  try {
    // Convert datetime-local value to ISO string
    const closedAtISO = closedAt.value ? new Date(closedAt.value).toISOString() : '';
    await createAucation({
      title: title.value,
      description: description.value,
      start_bid: Number(startBid.value),
      closed_at: closedAtISO,
    });
    await showSuccessDialog('Lelang berhasil dibuat!');
    emit('refresh');
    emit('close');
    resetForm();
  } catch (error) {
    showErrorDialog(parseErrorMessage(error));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
