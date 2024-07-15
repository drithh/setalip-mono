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
import { api } from '@/trpc/react';
import { SelectParticipant } from '@repo/shared/repository';
import { Trash2 } from 'lucide-react';

interface DeleteParticipantProps {
  participant: SelectParticipant;
  onDelete: () => void;
}

export default function DeleteParticipantDialog({
  participant,
  onDelete,
}: DeleteParticipantProps) {
  const trpcUtils = api.useUtils();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={'outline'}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin menghapus peserta{' '}
            <span className="font-semibold">{participant.name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini hanya akan menghapus peserta dari agenda ketika disimpan,
            jika ini refund, jangan lupa untuk mengembalikan kredit peserta.
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
