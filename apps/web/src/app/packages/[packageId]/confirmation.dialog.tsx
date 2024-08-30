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
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import { useState } from 'react';
import { toast } from 'sonner';
// import { useCreateMutation } from './_actions/create-transactions';
interface Price {
  price: number;
  discount: number;
  voucher: number;
  uniqueCode: number;
  total: number;
}

interface CreateTransactionProps {
  data: SelectAllDepositAccount['data'][0];
  packageName: string;
  price: Price;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: () => void;
}

export default function CreateTransactionDialog({
  data,
  price,
  packageName,
  open,
  onOpenChange,
  onCreate,
}: CreateTransactionProps) {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Order</AlertDialogTitle>
          </AlertDialogHeader>
        </AlertDialogTitle>
        <div className="flex flex-col gap-6">
          <div>
            Kamu akan melakukan pembayaran sebesar pada :
            <div className="grid grid-cols-2">
              <p>Paket:</p>
              <p className="font-semibold">{packageName}</p>
              <p>Harga:</p>
              <p className="font-semibold">
                {moneyFormatter.format(price.price)}
              </p>
              <p>Potongan Discount:</p>
              <p className="font-semibold">
                {moneyFormatter.format(price.discount)}
              </p>
              <p>Potongan Voucher:</p>
              <p className="font-semibold">
                {moneyFormatter.format(price.voucher)}
              </p>
              <p>Kode Unik:</p>
              <p className="font-semibold">
                {moneyFormatter.format(price.uniqueCode)}
              </p>
              <p>Total:</p>
              <p className="font-semibold text-red-600">
                {moneyFormatter.format(price.total)}
              </p>
            </div>
          </div>
          <div>
            Silahkan Kirim Pembayaran Ke Rekening :
            <div className="grid grid-cols-2">
              <p>Nama Bank:</p>
              <p className="font-semibold">{data.bank_name}</p>
              <p>No Rekening:</p>
              <p className="font-semibold">{data.account_number}</p>
              <p>Atas Nama:</p>
              <p className="font-semibold">{data.name}</p>
            </div>
          </div>
          Setelah melakukan pembayaran, namun belum mendapatkan konfirmasi,
          silahkan hubungi admin
          <div className="flex place-items-start gap-2">
            <Checkbox
              className="mt-1"
              checked={isChecked}
              onCheckedChange={(value) => setIsChecked(value === true)}
              value={isChecked ? 'true' : 'false'}
            />
            Dengan ini saya setuju dengan syarat dan ketentuan yang berlaku
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className={`${isChecked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              onClick={(e) => {
                if (!isChecked) {
                  toast.error('Anda harus menyetujui syarat dan ketentuan');
                  e.preventDefault();
                  return;
                } else {
                  onCreate();
                }
              }}
            >
              Konfirmasi
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
