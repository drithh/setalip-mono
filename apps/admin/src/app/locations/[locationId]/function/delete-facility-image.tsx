'use client';

import { api } from '@/trpc/react';
import { toast } from 'sonner';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal menghapus foto',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Menghapus foto...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Foto berhasil dihapus',
    description: 'Foto fasilitas berhasil dihapus',
  },
};

export const useDeleteFacilityImageMutation = () =>
  api.location.deleteFacilityImage.useMutation({
    onMutate: () => {
      toast.loading(TOAST_MESSAGES.loading.title, {
        description: TOAST_MESSAGES.loading.description,
      });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(TOAST_MESSAGES.error.title, {
        description: error.message,
      });
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(TOAST_MESSAGES.success.title, {
        description: TOAST_MESSAGES.success.description,
      });
    },
  });
