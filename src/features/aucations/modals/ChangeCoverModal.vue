<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-labelledby="cover-modal-title">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="emit('close')" aria-hidden="true"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <span class="bg-yellow-100 p-2 rounded-lg" aria-hidden="true">
              <ImageIcon class="w-5 h-5 text-yellow-600" aria-hidden="true" />
            </span>
            <h2 id="cover-modal-title" class="text-xl font-bold text-gray-800">Ubah Cover Lelang</h2>
          </div>
          <button
            @click="emit('close')"
            class="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Tutup modal ubah cover"
          >
            <X class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form @submit.prevent="onSubmit" class="p-6 space-y-5">
          <!-- Preview -->
          <div v-if="previewUrl" class="overflow-hidden rounded-xl border border-gray-200">
            <img :src="previewUrl" alt="Preview Cover Lelang" class="w-full aspect-video object-cover" />
          </div>
          <div v-else class="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 bg-slate-50 flex flex-col items-center justify-center text-gray-600" aria-label="Area preview cover">
            <ImageIcon class="w-10 h-10 mb-2 opacity-40" aria-hidden="true" />
            <p class="text-sm">Preview cover akan muncul di sini</p>
          </div>

          <!-- File Input -->
          <div>
            <label for="cover-file" class="block text-sm font-semibold text-gray-700 mb-1.5">Pilih Gambar Cover</label>
            <input
              id="cover-file"
              type="file"
              accept="image/*"
              @change="onFileChange"
              required
              class="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
            />
          </div>

          <div class="flex justify-end gap-3 pt-1">
            <button type="button" @click="emit('close')" class="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200">
              Batal
            </button>
            <button
              type="submit"
              :disabled="loading || !selectedFile"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-yellow-500 hover:bg-yellow-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" aria-hidden="true" />
              <Upload v-else class="w-4 h-4" aria-hidden="true" />
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
