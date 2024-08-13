'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { createVoucher } from './_actions/create-voucher';
import { useFormState } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { CreateVoucherSchema, createVoucherSchema } from './form-schema';
import { toast } from 'sonner';
import { Switch } from '@repo/ui/components/ui/switch';
import { SelectAllUserName, SelectVoucher } from '@repo/shared/repository';
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
import { isBefore, subDays } from 'date-fns';
import { DatetimePicker } from '@repo/ui/components/datetime-picker';
import { AddonInput } from '@repo/ui/components/addon-input';
import { MoneyInput } from '@repo/ui/components/money-input';

interface CreateVoucherProps {
  users: SelectAllUserName;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal membuat voucher',
  },
  loading: {
    title: 'Membuat voucher',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Voucher berhasil dibuat',
  },
};

export default function CreateVoucherForm({ users }: CreateVoucherProps) {
  const [openSheet, setOpenSheet] = useState(false);
  const [isAllUser, setIsAllUser] = useState(false);

  const trpcUtils = api.useUtils();
  type FormSchema = CreateVoucherSchema;

  const types = ['percentage', 'fixed'] satisfies SelectVoucher['type'][];

  const [formState, formAction] = useFormState(createVoucher, {
    status: 'default',
    form: {
      code: '',
      type: 'fixed',
      discount: 0,
      expired_at: new Date(),
      user_id: undefined,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(createVoucherSchema),
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

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button variant={'outline'}>Tambah</Button>
      </SheetTrigger>
      <SheetContent className="p-0">
        <ScrollArea className="h-screen px-6 pt-6">
          <SheetHeader>
            <SheetTitle className="text-left">Buat Voucher</SheetTitle>
            <SheetDescription className="text-left">
              Buat Voucher baru. Pastikan klik simpan ketika selesai.
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
                <FormItem className="grid w-full gap-2">
                  <FormLabel>Set voucher untuk semua user</FormLabel>
                  <FormControl>
                    <Switch
                      checked={isAllUser}
                      onCheckedChange={(e) => {
                        setIsAllUser(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                {!isAllUser && (
                  <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                      <FormItem className="grid w-full gap-2">
                        <FormLabel>User</FormLabel>
                        <FormControl>
                          <>
                            <Input type="hidden" {...field} />

                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value?.toString()}
                            >
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
                )}

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input id="code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Type</FormLabel>
                      <FormDescription>
                        Pilih jenis diskon yang akan diberikan. (diskon persen /
                        rupiah)
                      </FormDescription>
                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kelas" />
                            </SelectTrigger>
                            <SelectContent>
                              {types.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
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
                  name="discount"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        {form.watch('type') === 'fixed' ? (
                          <MoneyInput {...field} className="w-full" />
                        ) : (
                          <AddonInput
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            endAdornment="%"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expired_at"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Expired At</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            type="hidden"
                            {...field}
                            value={field.value.toString()}
                          />
                          <DatetimePicker
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            disabled={(date) =>
                              isBefore(date, subDays(new Date(), 1))
                            }
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
