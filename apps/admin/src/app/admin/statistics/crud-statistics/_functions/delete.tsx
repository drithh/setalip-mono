'use client';

import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { CONSTANT } from '../constant';

const TOAST_MESSAGES = {
  error: {
    title: `Gagal menghapus ${CONSTANT.Item}`,
  },
  loading: {
    title: `Menghapus ${CONSTANT.Item}...`,
    description: 'Mohon tunggu',
  },
  success: {
    title: `${CONSTANT.Item} berhasil dihapus`,
  },
};

export const useDeleteMutation = () =>
  api.package.delete.useMutation({
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
      toast.success(TOAST_MESSAGES.success.title);
    },
  });
