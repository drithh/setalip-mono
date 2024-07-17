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
import { SelectLoyaltyReward } from '@repo/shared/repository';

interface DeleteLoyaltyRewardProps {
  data: SelectLoyaltyReward;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteLoyaltyRewardDialog({
  data,
  open,
  onOpenChange,
}: DeleteLoyaltyRewardProps) {
  const trpcUtils = api.useUtils();
  const deleteLoyaltyReward = useDeleteMutation();
  const onDelete = () => {
    deleteLoyaltyReward.mutate(
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
            Apakah kamu yakin menghapus reward{' '}
            <span className="font-semibold">{data.name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus reward dari
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
