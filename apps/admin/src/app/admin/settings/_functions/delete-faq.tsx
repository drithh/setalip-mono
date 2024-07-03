'use client';

import { api } from '@/trpc/react';
import { toast } from 'sonner';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal menghapus frequently asked question',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Menghapus frequently asked question',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Frequently asked question berhasil dihapus',
  },
};

export const useDeleteMutation = () =>
  api.webSetting.deleteFrequentlyAskedQuestion.useMutation({
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
