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
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@repo/ui/components/credenza';

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
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>
            Booking Kelas <span className="font-semibold">{class_name}</span>
          </CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="grid grid-cols-2 pt-8 md:pt-4">
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
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button onClick={onCreate}>Konfirmasi</Button>
            {/* <button>Close</button> */}
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
    // <AlertDialog open={open} onOpenChange={onOpenChange}>
    //   <AlertDialogContent>
    //     <AlertDialogHeader>
    //       <AlertDialogTitle>
    //         Booking kelas <span className="font-semibold">{class_name}</span>
    //       </AlertDialogTitle>
    //     </AlertDialogHeader>

    //     <AlertDialogFooter>
    //       <AlertDialogCancel>Batal</AlertDialogCancel>
    //       <AlertDialogAction asChild>
    //       </AlertDialogAction>
    //     </AlertDialogFooter>
    //   </AlertDialogContent>
    // </AlertDialog>
  );
}
