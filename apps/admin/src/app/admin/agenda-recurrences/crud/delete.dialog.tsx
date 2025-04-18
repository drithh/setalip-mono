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
import { useDeleteMutation } from './_functions/delete';
import { api } from '@/trpc/react';
import { CONSTANT, DAYS } from './constant';
import { SelectAgendaRecurrence__Coach__Class__Location } from '@repo/shared/service';

interface DeleteProps {
  data: SelectAgendaRecurrence__Coach__Class__Location;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteDialog({
  data,
  open,
  onOpenChange,
}: DeleteProps) {
  const trpcUtils = api.useUtils();
  const deleteMutation = useDeleteMutation();
  const onDelete = () => {
    deleteMutation
      .mutateAsync({
        id: data.id,
      })
      .then(() => {
        trpcUtils.invalidate();
      });
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin menghapus {CONSTANT.Item}{' '}
            <span className="font-semibold">{data.class_name}</span> pada hari{' '}
            <span className="font-semibold">{`${DAYS[data.day_of_week]} ${data.time}`}</span>
            ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus {CONSTANT.Item}{' '}
            dari server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant={'destructive'} onClick={onDelete}>
              Ya, Hapus
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
