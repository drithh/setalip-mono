'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { createLoyalty } from './_actions/create-loyalty';
import { useFormState } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { CreateLoyaltySchema, createLoyaltySchema } from './form-schema';
import { toast } from 'sonner';
import {
  SelectAllLoyaltyShop,
  SelectAllUserName,
} from '@repo/shared/repository';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { api } from '@/trpc/react';
import { AddonInput } from '@repo/ui/components/addon-input';

interface CreateLoyaltyProps {
  users: SelectAllUserName;
  loyalty_shops: SelectAllLoyaltyShop['data'];
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal menambahkan point loyalty',
  },
  loading: {
    title: 'Menambahkan point loyalty...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Point loyalty berhasil dibuat',
  },
};

export default function CreateLoyaltyForm({
  loyalty_shops,
  users,
}: CreateLoyaltyProps) {
  const [openSheet, setOpenSheet] = useState(false);

  const trpcUtils = api.useUtils();
  type FormSchema = CreateLoyaltySchema;

  const [formState, formAction] = useFormState(createLoyalty, {
    status: 'default',
    form: {
      user_id: 0,
      shop_id: 0,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(createLoyaltySchema),
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
      form.reset();
      trpcUtils.invalidate();
      setOpenSheet(false);
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

  const [price, setPrice] = useState(0);
  useEffect(() => {
    const currentPrice =
      loyalty_shops.find(
        (shop) => shop.id === parseInt(form.watch('shop_id').toString()),
      )?.price ?? 0;
    setPrice(currentPrice);
  }, [form.watch('shop_id')]);

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button variant={'outline'}>Buat Transaksi</Button>
      </SheetTrigger>
      <SheetContent className="p-0">
        <ScrollArea className="h-screen px-6 pt-6">
          <SheetHeader>
            <SheetTitle className="text-left">
              Buat Transaksi Loyalty
            </SheetTitle>
            <SheetDescription className="text-left">
              Buat transaksi menggunakan loyalty point pengguna
            </SheetDescription>
          </SheetHeader>
          <div className="l mb-6 grid gap-4 px-1 py-4">
            <Form {...form}>
              <form
                className="grid gap-4"
                ref={formRef}
                action={formAction}
                onSubmit={onFormSubmit}
              >
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>User</FormLabel>
                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />

                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih user" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={user.id.toString()}
                                >
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shop_id"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Item</FormLabel>
                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />

                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih item" />
                            </SelectTrigger>
                            <SelectContent>
                              {loyalty_shops.map((shop) => (
                                <SelectItem
                                  key={shop.id}
                                  value={shop.id.toString()}
                                >
                                  {shop.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem className="grid w-full gap-2">
                  <FormLabel>Price</FormLabel>
                  <AddonInput
                    type="number"
                    readOnly
                    value={price}
                    endAdornment="Point"
                  />
                </FormItem>

                {/* <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Loyalty Point</FormLabel>
                      <FormDescription>
                        Jumlah point yang diberikan kepada pengguna
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Note</FormLabel>
                      <FormDescription>
                        Catatan kenapa memberikan loyalty point
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <Button type="submit" className="w-full">
                  Simpan
                </Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
