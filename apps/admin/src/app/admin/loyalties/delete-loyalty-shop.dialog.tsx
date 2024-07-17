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
import { useDeleteMutation } from './_functions/delete-loyalty-reward';
import { api } from '@/trpc/react';
import { SelectLoyaltyShop } from '@repo/shared/repository';

interface DeleteLoyaltyShopProps {
  data: SelectLoyaltyShop;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteLoyaltyShopDialog({
  data,
  open,
  onOpenChange,
}: DeleteLoyaltyShopProps) {
  const trpcUtils = api.useUtils();
  const deleteLoyaltyShop = useDeleteMutation();
  const onDelete = () => {
    deleteLoyaltyShop.mutate(
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
            Apakah kamu yakin menghapus item{' '}
            <span className="font-semibold">{data.name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus item dari
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
