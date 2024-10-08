'use client';

import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'sonner';

import { api } from '@/trpc/react';
import { SelectVoucher } from '@repo/shared/repository';

interface FindVoucherProps {
  setVoucher: (voucher: SelectVoucher | undefined) => void;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Voucher tidak ditemukan',
  },
  loading: {
    title: 'Mencari voucher',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Voucher berhasil ditemukan',
  },
};

const useVoucherMutation = () =>
  api.voucher.findByCode.useMutation({
    onMutate: () => {
      toast.loading(TOAST_MESSAGES.loading.title, {
        description: TOAST_MESSAGES.loading.description,
      });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(TOAST_MESSAGES.error.title, {
        description: error.message,
      });
    },
  });

export default function FindVoucher({ setVoucher }: FindVoucherProps) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const voucherMutation = useVoucherMutation();

  const onSubmit = () => {
    try {
      const data = ref.current?.value;
      if (!data) {
        toast.error('Please enter voucher code');
        return;
      }
      const result = voucherMutation.mutate(
        { code: data },
        {
          onSuccess: (data) => {
            toast.dismiss();
            if (data.error) {
              toast.error(TOAST_MESSAGES.error.title, {
                description: data.error.message,
              });
            } else {
              setVoucher(data.result);
              toast.success(TOAST_MESSAGES.success.title, {});
            }
          },
        },
      );
    } catch (error) {}
  };

  return (
    <Card className="row-span-2 mt-6 flex  flex-col gap-2 space-y-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
          Voucher Code
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex place-content-between gap-3">
          <Input
            ref={ref}
            type="text"
            placeholder="Enter Voucher Code"
            className="w-full rounded-lg border p-2"
          />
          <Button className="w-1/4" onClick={onSubmit}>
            Use
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
