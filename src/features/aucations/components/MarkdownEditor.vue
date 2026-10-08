<template>
  <div ref="editorRef"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const props = defineProps({
  modelValue: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue']);

const editorRef = ref(null);
let editorInstance = null;

onMounted(() => {
  editorInstance = new Editor({
    el: editorRef.value,
    height: '300px',
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    initialValue: props.modelValue,
    events: {
      change: () => {
        emit('update:modelValue', editorInstance.getMarkdown());
      },
    },
  });
});

watch(() => props.modelValue, (newVal) => {
  if (editorInstance && editorInstance.getMarkdown() !== newVal) {
    editorInstance.setMarkdown(newVal);
  }
});

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.destroy();
  }
});
</script>

