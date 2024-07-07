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
// import { useCreateMutation } from './_actions/create-transactions';
import { api } from '@/trpc/react';
import {
  SelectAllDepositAccount,
  SelectClass,
  SelectFrequentlyAskedQuestion,
  SelectPackageTransaction,
} from '@repo/shared/repository';
import { moneyFormatter } from '@repo/shared/util';
import Link from 'next/link';

interface CreateTransactionProps {
  time: string;
  class_name: SelectClass['name'];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: () => void;
}

export default function CreateTransactionDialog({
  class_name,
  time,
  open,
  onOpenChange,
  onCreate,
}: CreateTransactionProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Booking kelas <span className="font-semibold">{class_name}</span>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid grid-cols-2">
          <p>Waktu:</p>
          <p className="font-semibold">{time}</p>

          <div className="col-span-2 mb-4 mt-8">
            <p className="text-justify text-sm">
              By booking this class, you agree to our{' '}
              <Link href="/legal" className="text-balance underline">
                Terms of Service
              </Link>{' '}
              and have read and acknowledge our{' '}
              <Link href="/legal" className="text-balance underline">
                Privacy Policy.
              </Link>
            </p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onCreate}>Konfirmasi</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
