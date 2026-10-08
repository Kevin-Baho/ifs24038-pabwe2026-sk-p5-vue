import { describe, it, expect, vi } from 'vitest';
import Swal from 'sweetalert2';
import { showSuccessDialog, showErrorDialog, showConfirmDialog, formatRupiah, formatDate } from './toolsHelper';

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue(true) },
}));

describe('toolsHelper', () => {
  it('should call showSuccessDialog correctly', async () => {
    await showSuccessDialog('Berhasil cuy');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success', text: 'Berhasil cuy' }));
  });

  it('should call showErrorDialog correctly', async () => {
    await showErrorDialog('Gagal cuy');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error', text: 'Gagal cuy' }));
  });

  it('should call showConfirmDialog correctly', async () => {
    await showConfirmDialog('Yakin?');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'warning', text: 'Yakin?' }));
  });

  it('should format rupiah correctly', () => {
    expect(formatRupiah(100000)).toMatch(/Rp\s?100\.000/);
    expect(formatRupiah('invalid')).toBe('Rp 0');
  });

  it('should format date correctly', () => {
    const formatted = formatDate('2023-10-10T00:00:00Z');
    expect(formatted).toContain('10 Oktober 2023');
    expect(formatDate(null)).toBe('');
  });
});

