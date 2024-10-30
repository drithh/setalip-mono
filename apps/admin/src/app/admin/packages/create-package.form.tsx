'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { createPackage } from './_actions/create-package';
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
import { CreatePackageSchema, createPackageSchema } from './form-schema';
import { toast } from 'sonner';
import { Switch } from '@repo/ui/components/ui/switch';
import { MoneyInput } from '@repo/ui/components/money-input';
import { AddonInput } from '@repo/ui/components/addon-input';
import { SelectClassType } from '@repo/shared/repository';
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
import { DatetimePicker } from '@repo/ui/components/datetime-picker';

interface CreatePackageProps {
  classTypes: SelectClassType[];
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal membuat paket',
  },
  loading: {
    title: 'Membuat paket...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Paket berhasil dibuat',
  },
};

export default function CreatePackageForm({ classTypes }: CreatePackageProps) {
  const [openSheet, setOpenSheet] = useState(false);
  const [isDiscountPercentage, setIsDiscountPercentage] = useState(true);

  const trpcUtils = api.useUtils();
  type FormSchema = CreatePackageSchema;

  const [formState, formAction] = useFormState(createPackage, {
    status: 'default',
    form: {
      name: '',
      price: 0,
      credit: 0,
      loyalty_points: 0,
      one_time_only: 0,
      valid_for: 0,
      class_type_id: 0,
      is_active: 1,
      position: 1000,

      is_discount: 0,
      discount_end_date: undefined,
      discount_percentage: undefined,
      discount_credit: undefined,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(createPackageSchema),
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
            <SheetTitle className="text-left">Buat Paket</SheetTitle>
            <SheetDescription className="text-left">
              Buat paket baru. Pastikan klik simpan ketika selesai.
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
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Input id="name" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Aktifkan Paket</FormLabel>
                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />
                          <Switch
                            checked={field.value === 1}
                            onCheckedChange={(e) => {
                              field.onChange(e ? 1 : 0);
                            }}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Urutan Tampilan</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="class_type_id"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Tipe Kelas</FormLabel>
                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tipe kelas" />
                            </SelectTrigger>
                            <SelectContent>
                              {classTypes.map((classType) => (
                                <SelectItem
                                  key={classType.id}
                                  value={classType.id.toString()}
                                >
                                  {classType.type}
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
                  name="price"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Harga</FormLabel>
                      <FormControl>
                        <MoneyInput {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="credit"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Kredit</FormLabel>
                      <FormDescription>
                        Jumlah kredit yang diberikan kepada pengguna ketika
                        membeli paket ini
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
                  name="loyalty_points"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Loyalty Points</FormLabel>
                      <FormDescription>
                        Jumlah loyalty points yang diberikan kepada pengguna
                        ketika membeli paket ini
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
                  name="one_time_only"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>One Time Only</FormLabel>
                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />
                          <Switch
                            checked={field.value === 1}
                            onCheckedChange={(e) => {
                              field.onChange(e ? 1 : 0);
                            }}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valid_for"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Valid For</FormLabel>
                      <FormDescription>
                        Jumlah hari sebelum paket kadaluarsa
                      </FormDescription>
                      <FormControl>
                        <AddonInput
                          type="number"
                          {...field}
                          endAdornment="Hari"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_discount"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />
                          <Switch
                            checked={field.value === 1}
                            onCheckedChange={(e) => {
                              field.onChange(e ? 1 : 0);
                            }}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('is_discount') === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="discount_end_date"
                      render={({ field }) => (
                        <FormItem className="grid w-full gap-2">
                          <FormLabel>Discount End Date</FormLabel>
                          <FormDescription>
                            Waktu kadaluarsa diskon
                          </FormDescription>
                          <FormControl>
                            <>
                              <Input
                                type="hidden"
                                {...field}
                                value={(field.value ?? new Date()).toString()}
                              />
                              <DatetimePicker
                                value={field.value ?? new Date()}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                disabled={(date) =>
                                  date <
                                  new Date(
                                    new Date().setDate(
                                      new Date().getDate() - 1,
                                    ),
                                  )
                                }
                              />
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Discount Percentage?</FormLabel>
                      <FormControl>
                        <Switch
                          checked={isDiscountPercentage}
                          onCheckedChange={(e) => {
                            setIsDiscountPercentage(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    {isDiscountPercentage ? (
                      <FormField
                        control={form.control}
                        name="discount_percentage"
                        render={({ field }) => (
                          <FormItem className="grid w-full gap-2">
                            <FormLabel>Discount Percentage</FormLabel>
                            <FormControl>
                              <AddonInput
                                type="number"
                                min={0}
                                max={100}
                                {...field}
                                value={field.value ?? 0}
                                endAdornment="%"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <FormField
                        control={form.control}
                        name="discount_credit"
                        render={({ field }) => (
                          <FormItem className="grid w-full gap-2">
                            <FormLabel>Discount Credit</FormLabel>
                            <FormControl>
                              <AddonInput
                                type="number"
                                min={0}
                                {...field}
                                value={field.value ?? 0}
                                endAdornment="Session(s)"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}

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
