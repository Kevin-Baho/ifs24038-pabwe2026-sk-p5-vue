<template>
  <div ref="viewerRef"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

const props = defineProps({
  content: { type: String, default: '' },
});

const viewerRef = ref(null);
let viewerInstance = null;

onMounted(() => {
  viewerInstance = new Viewer({
    el: viewerRef.value,
    initialValue: props.content,
  });
});

watch(() => props.content, (newVal) => {
  if (viewerInstance) {
    viewerInstance.setMarkdown(newVal);
  }
});
</script>

