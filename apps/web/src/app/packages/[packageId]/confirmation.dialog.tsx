'use client';
import {
  SelectAllDepositAccount,
  SelectPackageTransaction,
} from '@repo/shared/repository';
import { moneyFormatter } from '@repo/shared/util';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui/components/ui/alert-dialog';
import { Button } from '@repo/ui/components/ui/button';

// import { useCreateMutation } from './_actions/create-transactions';

interface CreateTransactionProps {
  data: SelectAllDepositAccount['data'][0];
  price: SelectPackageTransaction['amount_paid'];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: () => void;
}

export default function CreateTransactionDialog({
  data,
  price,
  open,
  onOpenChange,
  onCreate,
}: CreateTransactionProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Lakukan pembayaran sebesar{' '}
            <div className="font-semibold">
              {moneyFormatter.format(price ?? 0)}
            </div>
          </AlertDialogTitle>
        </AlertDialogHeader>
        Silahkan Kirim Pembayaran Ke Rekening :
        <div className="grid grid-cols-2">
          <p>Nama Bank:</p>
          <p className="font-semibold">{data.bank_name}</p>
          <p>No Rekening:</p>
          <p className="font-semibold">{data.account_number}</p>
          <p>Atas Nama:</p>
          <p className="font-semibold">{data.name}</p>
        </div>
        Setelah melakukan pembayaran, namun belum mendapatkan konfirmasi,
        silahkan hubungi admin
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
