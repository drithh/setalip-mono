'use client';

import { api } from '@/trpc/react';
import { toast } from 'sonner';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal mengubah status',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Mengubah status',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Status berhasil diubah',
  },
};

export const useUpdateMutation = () =>
  api.agenda.updateAgendaBooking.useMutation({
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
