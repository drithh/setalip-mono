'use client';

import { api } from '@/trpc/react';
import { toast } from 'sonner';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal menghapus review',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Menghapus review',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Review berhasil dihapus',
  },
};

export const useDeleteMutation = () =>
  api.webSetting.deleteReview.useMutation({
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
