'use client';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@repo/ui/components/ui/alert-dialog';
import { Button } from '@repo/ui/components/ui/button';
import { useRouter } from 'next/navigation';
import { useDeleteMutation } from './_functions/delete-deposit-account';
import { api } from '@/trpc/react';
import { SelectDepositAccount } from '@repo/shared/repository';

interface DeleteDepositAccountProps {
  data: SelectDepositAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteDepositAccountDialog({
  data,
  open,
  onOpenChange,
}: DeleteDepositAccountProps) {
  const trpcUtils = api.useUtils();
  const deleteDepositAccount = useDeleteMutation();
  const onDelete = () => {
    deleteDepositAccount.mutate(
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
            Apakah kamu yakin menghapus akun deposit{' '}
            <span className="font-semibold">{data.name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus akun deposit
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
