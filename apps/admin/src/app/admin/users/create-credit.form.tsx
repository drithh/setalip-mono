'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { createCredit } from './_actions/create-credit';
import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
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
import { CreateCreditSchema, createCreditSchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { FormDatePicker } from '@repo/ui/components/form-date-picker';
import {
  SelectClassType,
  SelectUser,
} from '@repo/shared/repository';
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
import { Textarea } from '@repo/ui/components/ui/textarea';

interface CreateCreditProps {
  user: SelectUser;
  classTypes: SelectClassType[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal menambah credit',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Menambah credit...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Credit berhasil diperbarui',
  },
};

export default function CreateCreditForm({
  user,
  classTypes,
  open,
  onOpenChange,
}: CreateCreditProps) {
  const trpcUtils = api.useUtils();
  const router = useRouter();
  type FormSchema = CreateCreditSchema;

  const [formState, formAction] = useFormState(createCredit, {
    status: 'default',
    form: {
      amount: 0,
      note: '',
      class_type_id: 1,
      expired_at: new Date(),
      user_id: user.id,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(createCreditSchema),
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
        onOpenChange(ev);
        form.reset();
      }}
    >
      <SheetContent className="p-0">
        <ScrollArea className="h-screen px-6 pt-6">
          <SheetHeader>
            <SheetTitle className="text-left">Tambah kredit</SheetTitle>
            <SheetDescription className="text-left">
              Tambah kredit. Pastikan klik simpan ketika selesai.
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
                      <FormControl>
                        <Input type="hidden" {...field} value={user.id} />
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
                      <FormLabel>Tipe kelas</FormLabel>
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Jumlah kredit</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
                      <FormLabel>Tanggal kedaluwarsa</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            type="hidden"
                            {...field}
                            value={field.value.toDateString()}
                          />
                          <FormDatePicker
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                          />
                        </>
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
                      <FormLabel>Catatan</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
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
