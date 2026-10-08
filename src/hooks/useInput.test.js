import { describe, it, expect } from 'vitest';
import useInput from './useInput';

describe('useInput', () => {
  it('should initialize and change value', () => {
    const [val, handleChange] = useInput('awal');
    expect(val.value).toBe('awal');
    
    handleChange({ target: { value: 'baru' } });
    expect(val.value).toBe('baru');
  });
});

