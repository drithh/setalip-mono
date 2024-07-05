'use client';

import {
  SelectAllDepositAccount,
  SelectPackageTransaction,
} from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { cn } from '@repo/ui/lib/utils';
import { useEffect, useRef, useState } from 'react';
import CreateTransactionDialog from './confirmation.dialog';
import { useFormState } from 'react-dom';
import { api } from '@/trpc/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';
import { createTransaction } from './_actions/create-transaction';
import {
  CreateTransactionSchema,
  createTransactionSchema,
} from './form-schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';

interface CreateTransactionProps {
  id: SelectPackageTransaction['id'];
  packageId: SelectPackageTransaction['package_id'];
  depositAccounts: SelectAllDepositAccount['data'];
  price: SelectPackageTransaction['amount_paid'];
  uniqueCode: SelectPackageTransaction['unique_code'];
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal membuat transaksi',
    description: 'Silahkan coba lagi',
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
  id,
  packageId,
  depositAccounts,
  price,
  uniqueCode,
}: CreateTransactionProps) {
  const router = useRouter();
  type FormSchema = CreateTransactionSchema;

  const [formState, formAction] = useFormState(createTransaction, {
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
      router.push('/me/package');
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
        <section className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            Select Payment Method
          </h1>

          {id && id > 0 && (
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="grid w-full gap-2">
                  <FormControl>
                    <Input type="hidden" {...field} value={id} />
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

          <FormField
            control={form.control}
            name="unique_code"
            render={({ field }) => (
              <FormItem className="grid w-full gap-2">
                <FormControl>
                  <Input type="hidden" {...field} value={uniqueCode} />
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
