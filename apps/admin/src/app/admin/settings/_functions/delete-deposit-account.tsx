'use client';

import { api } from '@/trpc/react';
import { toast } from 'sonner';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal menghapus akun deposit',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Menghapus akun deposit',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Akun deposit berhasil dihapus',
  },
};

export const useDeleteMutation = () =>
  api.webSetting.deleteDepositAccount.useMutation({
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
