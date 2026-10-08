import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAucations } from '../api/aucationApi';

export const useAucationsStore = defineStore('aucations', () => {
  const aucations = ref([]);
  const loading = ref(false);

  const fetchAucations = async (isMe = 0, isClosed = 0) => {
    loading.value = true;
    try {
      const res = await getAucations(isMe, isClosed);
      aucations.value = res.data.aucations;
    } finally {
      loading.value = false;
    }
  };

  return { aucations, loading, fetchAucations };
});

