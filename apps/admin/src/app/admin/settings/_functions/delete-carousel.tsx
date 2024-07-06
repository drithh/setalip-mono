'use client';

import { api } from '@/trpc/react';
import { toast } from 'sonner';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal menghapus carousel',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Menghapus carousel',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Carousel berhasil dihapus',
  },
};

export const useDeleteMutation = () =>
  api.webSetting.deleteCarousel.useMutation({
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
      toast.success(TOAST_MESSAGES.success.title, {});
    },
  });
