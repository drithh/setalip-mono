'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { editPackage } from './_actions/edit-package';
import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
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
import { EditPackageSchema, editPackageSchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Switch } from '@repo/ui/components/ui/switch';
import { MoneyInput } from '@repo/ui/components/money-input';
import { AddonInput } from '@repo/ui/components/addon-input';
import { SelectClassType, SelectPackage } from '@repo/shared/repository';
import {
  Sheet,
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

interface EditPackageProps {
  singlePackage: SelectPackage;
  classTypes: SelectClassType[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal memperbarui paket',
  },
  loading: {
    title: 'Memperbarui paket...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Paket berhasil diperbarui',
  },
};

export default function EditPackageForm({
  classTypes,
  singlePackage,
  open,
  onOpenChange,
}: EditPackageProps) {
  const trpcUtils = api.useUtils();
  const router = useRouter();
  type FormSchema = EditPackageSchema;

  const [formState, formAction] = useFormState(editPackage, {
    status: 'default',
    form: {
      id: singlePackage.id,
      name: singlePackage.name,
      class_type_id: singlePackage.class_type_id,
      price: singlePackage.price,
      credit: singlePackage.credit,
      loyalty_points: singlePackage.loyalty_points,
      one_time_only: singlePackage.one_time_only,
      valid_for: singlePackage.valid_for,
      is_active: singlePackage.is_active,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(editPackageSchema),
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
      router.refresh();
      trpcUtils.invalidate();
      onOpenChange(false);
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
    <Sheet
      open={open}
      onOpenChange={(ev) => {
        form.reset();
        onOpenChange(ev);
      }}
    >
      <SheetContent className="p-0">
        <ScrollArea className="h-screen px-6 pt-6">
          <SheetHeader>
            <SheetTitle className="text-left">Edit Paket</SheetTitle>
            <SheetDescription className="text-left">
              Edit paket. Pastikan klik simpan ketika selesai.
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
                  name="id"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
