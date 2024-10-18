'use client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@repo/ui/components/ui/alert-dialog';
import { Button } from '@repo/ui/components/ui/button';
import { useDeleteMutation } from './_functions/cancel-booking';
import { api } from '@/trpc/react';
import { format } from 'date-fns';
import {
  CancelAgendaBookingByAdminOption,
  SelectAgenda__Coach__Class__Location__AgendaBooking,
} from '@repo/shared/service';

interface DeleteAgendaProps {
  data: SelectAgenda__Coach__Class__Location__AgendaBooking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteAgendaDialog({
  data,
  open,
  onOpenChange,
}: DeleteAgendaProps) {
  const trpcUtils = api.useUtils();
  const deleteAgendaBooking = useDeleteMutation();
  const onDelete = (data: CancelAgendaBookingByAdminOption) => {
    deleteAgendaBooking.mutate(
      {
        id: data.id,
        type: data.type,
      },
      {
        onSuccess: () => {
          trpcUtils.invalidate();
        },
      },
    );
  };
  // const onDelete = () => {
  //   deleteAgenda.mutate(
  //     {
  //       id: data.agenda_booking_id ?? 0,
  //     },
  //     {
  //       onSuccess: () => {
  //         trpcUtils.invalidate();
  //       },
  //     },
  //   );
  // };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin menghapus peserta?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini hanya akan menghapus peserta dari agenda ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={'destructive'}
              onClick={() =>
                onDelete({
                  id: data.id,
                  type: 'refund',
                })
              }
            >
              Hapus dan Refund
            </Button>
          </AlertDialogAction>
          <AlertDialogAction asChild>
            <Button
              variant={'destructive'}
              onClick={() =>
                onDelete({
                  id: data.id,
                  type: 'no_refund',
                })
              }
            >
              Hapus
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
