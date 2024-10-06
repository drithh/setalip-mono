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
import { api } from '@/trpc/react';
import { SelectAgenda } from '@repo/shared/repository';
import { format } from 'date-fns';
import { useDeleteMutation } from './_functions/delete-agenda';

interface DeleteAgendaProps {
  data: SelectAgenda;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteAgendaDialog({
  data,
  open,
  onOpenChange,
}: DeleteAgendaProps) {
  const trpcUtils = api.useUtils();
  const deleteAgenda = useDeleteMutation();
  const onDelete = (is_refund: boolean) => {
    deleteAgenda.mutate(
      {
        id: data.id,
        time: data.time,
        coach_id: data.coach_id,
        location_facility_id: data.location_facility_id,
        class_id: data.class_id,
        agenda_recurrence_id: data.agenda_recurrence_id,
        is_refund,
      },
      {
        onSuccess: () => {
          trpcUtils.invalidate();
        },
      },
    );
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin menghapus agenda tanggal{' '}
            <span className="font-semibold">
              {format(data.time, 'dd/MM/yyyy HH:mm')}
            </span>
            {' ?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus kelas beserta
            agenda dari sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant={'destructive'} onClick={() => onDelete(true)}>
              Hapus dan Refund
            </Button>
          </AlertDialogAction>
          <AlertDialogAction asChild>
            <Button variant={'destructive'} onClick={() => onDelete(false)}>
              Hapus
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
