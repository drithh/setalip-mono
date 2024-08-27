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
import { SelectStatistic } from '@repo/shared/repository';
import { CONSTANT } from './constant';

interface DeleteProps {
  data: SelectStatistic;
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
    deleteMutation.mutate(
      {
        id: data.id,
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
            Apakah kamu yakin menghapus {CONSTANT.Item}{' '}
            <span className="font-semibold">{data.name}</span>?
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
