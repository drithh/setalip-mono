'use client';

import { api } from '@/trpc/react';
import { toast } from 'sonner';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal menghapus item',
  },
  loading: {
    title: 'Menghapus item...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Item berhasil dihapus',
    description: 'Item berhasil dihapus',
  },
};

export const useDeleteMutation = () =>
  api.loyalty.deleteShop.useMutation({
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
