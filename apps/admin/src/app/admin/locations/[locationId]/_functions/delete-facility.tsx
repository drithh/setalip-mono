'use client';

import { api } from '@/trpc/react';
import { toast } from 'sonner';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal menghapus fasilitas',
  },
  loading: {
    title: 'Menghapus fasilitas...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Fasilitas berhasil dihapus',
    description: 'Fasilitas berhasil dihapus',
  },
};

export const useDeleteFacilityMutation = () =>
  api.location.deleteFacility.useMutation({
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
