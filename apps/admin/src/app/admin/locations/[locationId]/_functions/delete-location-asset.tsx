'use client';

import { api } from '@/trpc/react';
import { toast } from 'sonner';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal menghapus gambar',
  },
  loading: {
    title: 'Menghapus gambar...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Gambar berhasil dihapus',
    description: 'Gambar lokasi berhasil dihapus',
  },
};

export const useDeleteAssetMutation = () =>
  api.location.deleteAsset.useMutation({
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
