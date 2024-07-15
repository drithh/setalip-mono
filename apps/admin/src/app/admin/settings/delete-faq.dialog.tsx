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
import { useDeleteMutation } from './_functions/delete-faq';
import { api } from '@/trpc/react';
import { SelectFrequentlyAskedQuestion } from '@repo/shared/repository';

interface DeleteFrequentlyAskedQuestionProps {
  data: SelectFrequentlyAskedQuestion;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteFrequentlyAskedQuestionDialog({
  data,
  open,
  onOpenChange,
}: DeleteFrequentlyAskedQuestionProps) {
  const trpcUtils = api.useUtils();
  const deleteFrequentlyAskedQuestion = useDeleteMutation();
  const onDelete = () => {
    deleteFrequentlyAskedQuestion.mutate(
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
            Apakah kamu yakin menghapus faq{' '}
            <span className="font-semibold">{data.question}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus faq dari server.
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
