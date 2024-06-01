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
import { useDeleteMutation } from './_functions/delete-location';
import { SelectLocation } from '@repo/shared/repository';

interface DeleteLocationProps {
  location: SelectLocation;
}

export default function DeleteLocation({ location }: DeleteLocationProps) {
  const router = useRouter();
  const deleteLocation = useDeleteMutation();
  const onDelete = () => {
    deleteLocation.mutate(
      {
        locationId: location.id,
      },
      {
        onSuccess: () => {
          router.push('/locations');
        },
      },
    );
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'} type="button">
          Hapus Lokasi
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin menghapus lokasi{' '}
            <span className="font-semibold">{location.name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus lokasi beserta
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
