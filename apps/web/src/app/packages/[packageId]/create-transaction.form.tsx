'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  SelectAllDepositAccount,
  SelectPackageTransaction,
  SelectVoucher,
} from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { cn } from '@repo/ui/lib/utils';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createTransaction } from './_actions/create-transaction';
import CreateTransactionDialog from './confirmation.dialog';
import {
  CreateTransactionSchema,
  createTransactionSchema,
} from './form-schema';

interface Price {
  price: number;
  discount: number;
  voucher: number;
  uniqueCode: number;
  total: number;
}
interface CreateTransactionProps {
  packageTransaction: SelectPackageTransaction;
  packageId: SelectPackageTransaction['package_id'];
  depositAccounts: SelectAllDepositAccount['data'];
  price: Price;
  packageName: string;
  voucherCode: SelectVoucher['code'];
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal membuat transaksi',
  },
  loading: {
    title: 'Membuat transaksi',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Transaksi berhasil dibuat, silahkan melakukan pembayaran',
  },
};

export default function CreateTransaction({
  packageTransaction,
  packageId,
  depositAccounts,
  price,
  packageName,
  voucherCode,
}: CreateTransactionProps) {
  const router = useRouter();
  type FormSchema = CreateTransactionSchema;

  const [formState, formAction] = useActionState(createTransaction, {
    status: 'default',
    form: {
      deposit_account_id: depositAccounts[0]?.id ?? 0,
      unique_code: 0,
      voucher_code: '',
      package_id: 0,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: formState.form,
  });

  useEffect(() => {
    toast.dismiss();
    if (formState.status === 'field-errors') {
      for (const fieldName in formState.errors) {
        if (Object.prototype.hasOwnProperty.call(formState.errors, fieldName)) {
          const typedFieldName = fieldName as keyof FormSchema;
          const error = formState.errors[typedFieldName];
          if (error) {
            form.setError(typedFieldName, error);
          }
        }
      }
    } else if (formState.status === 'error') {
      toast.error(TOAST_MESSAGES.error.title, {
        description: formState.errors,
      });
      form.setError('root', { message: formState.errors });
    } else {
      form.clearErrors();
    }

    if (formState.status === 'success') {
      toast.success(TOAST_MESSAGES.success.title);
      router.push('/me/package?status=pending');
    }
  }, [formState]);

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.handleSubmit(() => {
      toast.loading(TOAST_MESSAGES.loading.title, {
        description: TOAST_MESSAGES.loading.description,
      });
      formAction(new FormData(formRef.current!));
    })(event);
  };

  const formRef = useRef<HTMLFormElement>(null);

  const defaultDepositAccount = depositAccounts[0];
  const [selectedDepositAccount, setSelectedDepositAccount] = useState(
    defaultDepositAccount?.id ?? 0,
  );
  const [open, setOpen] = useState(false);

  const isSelectedDepositAccount = (id: number) => {
    return selectedDepositAccount === id;
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={onFormSubmit}
        className="flex flex-col gap-4"
      >
        <section className="flex flex-col ">
          <h1 className="mb-6 text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            Select Payment Method
          </h1>

          {packageTransaction.id !== null && (
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="grid w-full gap-2">
                  <FormControl>
                    <Input
                      type="hidden"
                      {...field}
                      value={packageTransaction?.id ?? 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="package_id"
            render={({ field }) => (
              <FormItem className="grid w-full gap-2">
                <FormControl>
                  <Input type="hidden" {...field} value={packageId} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {voucherCode.length > 0 && (
            <FormField
              control={form.control}
              name="voucher_code"
              render={({ field }) => (
                <FormItem className="grid w-full gap-2">
                  <FormControl>
                    <Input type="hidden" {...field} value={voucherCode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="unique_code"
            render={({ field }) => (
              <FormItem className="grid w-full gap-2">
                <FormControl>
                  <Input
                    type="hidden"
                    {...field}
                    value={packageTransaction.unique_code}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deposit_account_id"
            render={({ field }) => (
              <FormItem className="grid w-full gap-2">
                <FormControl>
                  <Input
                    type="hidden"
                    {...field}
                    value={selectedDepositAccount}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {depositAccounts.length === 0 && (
              <Card className="pt-6">
                <CardContent className="grid grid-cols-2 gap-2">
                  <p>Belum ada rekening deposit</p>
                </CardContent>
              </Card>
            )}
            {selectedDepositAccount &&
              depositAccounts.map((depositAccount) => (
                <Card
                  key={depositAccount.id}
                  className={cn`cursor-pointer pt-6 opacity-70 ${isSelectedDepositAccount(depositAccount.id) && 'border-4 bg-primary opacity-100'}`}
                  onClick={() => setSelectedDepositAccount(depositAccount.id)}
                >
                  <CardContent className="grid grid-cols-2 gap-2">
                    <p>Nama Bank:</p>
                    <p className="font-semibold">{depositAccount.bank_name}</p>
                    <p>No Rekening:</p>
                    <p className="font-semibold">
                      {depositAccount.account_number}
                    </p>
                    <p>Atas Nama:</p>
                    <p className="font-semibold">{depositAccount.name}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
        <Button type="button" className="w-full" onClick={() => setOpen(true)}>
          Buy Now
        </Button>
        {defaultDepositAccount && (
          <CreateTransactionDialog
            open={open}
            onOpenChange={setOpen}
            data={
              depositAccounts.find((d) => d.id === selectedDepositAccount) ??
              defaultDepositAccount
            }
            packageName={packageName}
            price={price}
            onCreate={() =>
              form.handleSubmit(() => {
                toast.loading(TOAST_MESSAGES.loading.title, {
                  description: TOAST_MESSAGES.loading.description,
                });
                formAction(new FormData(formRef.current!));
              })()
            }
          />
        )}
      </form>
    </Form>
  );
}
