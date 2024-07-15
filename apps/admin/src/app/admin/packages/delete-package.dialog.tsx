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
import { useDeleteMutation } from './_functions/delete-package';
import { api } from '@/trpc/react';
import { SelectPackage } from '@repo/shared/repository';

interface DeletePackageProps {
  singlePackage: SelectPackage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeletePackageDialog({
  singlePackage,
  open,
  onOpenChange,
}: DeletePackageProps) {
  const trpcUtils = api.useUtils();
  const deletePackage = useDeleteMutation();
  const onDelete = () => {
    deletePackage.mutate(
      {
        packageId: singlePackage.id,
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
            Apakah kamu yakin menghapus paket{' '}
            <span className="font-semibold">{singlePackage.name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus paket dari
            server.
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
