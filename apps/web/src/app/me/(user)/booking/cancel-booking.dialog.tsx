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
import { SelectAllAgendaByUser } from '@repo/shared/repository';
import { format } from 'date-fns';

interface DeleteAgendaProps {
  data: SelectAllAgendaByUser['data'][0];
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
  const onDelete = () => {
    deleteAgenda.mutate(
      {
        id: data.agenda_booking_id ?? 0,
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
            Apakah kamu yakin cancel agenda kelas {data.class_name} pada{' '}
            <span className="font-semibold">
              {format(new Date(data?.time ?? new Date()), 'MMMM dd - HH:mm')}
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant={'destructive'} onClick={onDelete}>
              Ya, cancel
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
