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
import { Trash2 } from 'lucide-react';
import { AgendaWithParticipant } from '@repo/shared/service';

interface DeleteParticipantProps {
  participant: AgendaWithParticipant;
  onDelete: (is_refund: boolean) => void;
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
            <span className="font-semibold">{participant.user_name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini hanya akan menghapus peserta dari agenda ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant={'destructive'} onClick={() => onDelete(true)}>
              Hapus dan Refund
            </Button>
          </AlertDialogAction>
          <AlertDialogAction asChild>
            <Button variant={'destructive'} onClick={() => onDelete(false)}>
              Hapus
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
