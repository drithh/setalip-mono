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
import { useDeleteMutation } from './_functions/delete-review';
import { api } from '@/trpc/react';
import { SelectReview, SelectReviewWithUser } from '@repo/shared/repository';

interface DeleteReviewProps {
  data: SelectReviewWithUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteReviewDialog({
  data,
  open,
  onOpenChange,
}: DeleteReviewProps) {
  const trpcUtils = api.useUtils();
  const deleteReview = useDeleteMutation();
  const onDelete = () => {
    deleteReview.mutate(
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
            Apakah kamu yakin menghapus review{' '}
            <span className="font-semibold">{data.name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus review dari
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
