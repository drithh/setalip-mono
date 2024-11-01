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
import { SelectPackageTransaction__Package__UserPackage } from '@repo/shared/service';
import { useDeleteMutation } from './_functions/delete';
import { CONSTANT } from './constant';
import { format, parse } from 'date-fns';

interface DeleteProps {
  data: SelectPackageTransaction__Package__UserPackage;
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
        userPackageId: data.user_package_id ?? 0,
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
            Apakah kamu yakin mengcancle {CONSTANT.Item} {data.package_name}{' '}
            yang expired pada{' '}
            {format(data.user_package_expired_at, 'yyyy-MM-dd')}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan mengcancle {CONSTANT.Item}{' '}
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
