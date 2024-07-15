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
import { useDeleteMutation } from './_functions/delete-carousel';
import { api } from '@/trpc/react';
import { SelectCarousel } from '@repo/shared/repository';

interface DeleteCarouselProps {
  data: SelectCarousel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteCarouselDialog({
  data,
  open,
  onOpenChange,
}: DeleteCarouselProps) {
  const trpcUtils = api.useUtils();
  const deleteCarousel = useDeleteMutation();
  const onDelete = () => {
    deleteCarousel.mutate(
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
            Apakah kamu yakin menghapus carousel{' '}
            <span className="font-semibold">{data.title}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus carousel dari
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
