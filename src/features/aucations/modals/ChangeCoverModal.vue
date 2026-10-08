<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="emit('close')"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <span class="bg-yellow-100 p-2 rounded-lg">
              <ImageIcon class="w-5 h-5 text-yellow-600" />
            </span>
            <h2 class="text-xl font-bold text-gray-800">Ubah Cover Lelang</h2>
          </div>
          <button @click="emit('close')" class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="onSubmit" class="p-6 space-y-5">
          <!-- Preview -->
          <div v-if="previewUrl" class="overflow-hidden rounded-xl border border-gray-200">
            <img :src="previewUrl" alt="Preview Cover" class="w-full aspect-video object-cover" />
          </div>
          <div v-else class="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 bg-slate-50 flex flex-col items-center justify-center text-gray-400">
            <ImageIcon class="w-10 h-10 mb-2 opacity-40" />
            <p class="text-sm">Preview cover akan muncul di sini</p>
          </div>

          <!-- File Input -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Pilih Gambar Cover</label>
            <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              required
              class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
            />
          </div>

          <div class="flex justify-end gap-3 pt-1">
            <button type="button" @click="emit('close')" class="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-200">
              Batal
            </button>
            <button
              type="submit"
              :disabled="loading || !selectedFile"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-yellow-500 hover:bg-yellow-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <Upload v-else class="w-4 h-4" />
              {{ loading ? 'Mengupload...' : 'Upload Cover' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';
import { Image as ImageIcon, X, Upload, Loader2 } from 'lucide-vue-next';
import { updateCover } from '../api/aucationApi';
import { showSuccessDialog, showErrorDialog } from '@/helpers/toolsHelper';

const props = defineProps({
  isOpen: Boolean,
  aucationId: { type: [String, Number], required: true },
});
const emit = defineEmits(['close', 'refresh']);

const selectedFile = ref(null);
const previewUrl = ref('');
const loading = ref(false);

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const onSubmit = async () => {
  if (!selectedFile.value) return;
  loading.value = true;
  try {
    await updateCover(props.aucationId, selectedFile.value);
    await showSuccessDialog('Cover berhasil diperbarui!');
    emit('refresh');
    emit('close');
    selectedFile.value = null;
    previewUrl.value = '';
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
