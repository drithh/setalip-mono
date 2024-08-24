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
import { useDeleteMutation } from './_functions/delete-class';
import { SelectClass } from '@repo/shared/repository';

interface DeleteClassProps {
  singleClass: SelectClass;
}

export default function DeleteClass({ singleClass }: DeleteClassProps) {
  const router = useRouter();
  const deleteClass = useDeleteMutation();
  const onDelete = () => {
    deleteClass.mutate(
      {
        id: singleClass.id,
      },
      {
        onSuccess: () => {
          router.push('/admin/classes');
          router.refresh();
        },
      },
    );
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'} type="button">
          Hapus Kelas
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin menghapus kelas{' '}
            <span className="font-semibold">{singleClass.name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus kelas beserta
            foto dari server.
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
