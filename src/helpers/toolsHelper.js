import Swal from 'sweetalert2';

export const showSuccessDialog = (message) => {
  return Swal.fire({ icon: 'success', title: 'Berhasil', text: message });
};

export const showErrorDialog = (message) => {
  return Swal.fire({ icon: 'error', title: 'Gagal', text: message });
};

export const showConfirmDialog = (message) => {
  return Swal.fire({
    icon: 'warning',
    title: 'Konfirmasi',
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  });
};

export const formatRupiah = (number) => {
  if (isNaN(number)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

