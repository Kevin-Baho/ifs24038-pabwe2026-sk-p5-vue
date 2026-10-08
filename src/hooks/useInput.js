import { ref } from 'vue';

export default function useInput(defaultValue = '') {
  const value = ref(defaultValue);
  const handleValueChange = (e) => {
    value.value = e.target.value;
  };
  return [value, handleValueChange];
}

