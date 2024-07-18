'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { createLoyaltyShop } from './_actions/create-loyalty-shop';
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
import {
  CreateLoyaltyShopSchema,
  createLoyaltyShopSchema,
} from './form-schema';
import { toast } from 'sonner';
import { SelectAllUserName } from '@repo/shared/repository';
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
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Dropzone } from '@repo/ui/components/dropzone';
import { PhotoProvider } from 'react-photo-view';
import FileCard from '../locations/[locationId]/_components/file-card';

interface CreateLoyaltyShopProps {}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal menambahkan item',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Menambahkan item...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Item berhasil dibuat',
  },
};

export default function CreateLoyaltyShopForm({}: CreateLoyaltyShopProps) {
  const [openSheet, setOpenSheet] = useState(false);

  const trpcUtils = api.useUtils();
  type FormSchema = CreateLoyaltyShopSchema;

  const [formState, formAction] = useFormState(createLoyaltyShop, {
    status: 'default',
    form: {
      name: '',
      file: null,
      description: '',
      price: 0,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(createLoyaltyShopSchema),
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

  function handleOnDrop(acceptedFiles: FileList | null) {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      form.setError('file', { message: 'File tidak valid' });
      return;
    }
    const file = acceptedFiles[0];

    if (!file) {
      form.setError('file', { message: 'File tidak valid' });
      return;
    }

    form.setValue('file', file);
    form.clearErrors('file');
  }

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button variant={'outline'}>Tambah</Button>
      </SheetTrigger>
      <SheetContent className="p-0">
        <ScrollArea className="h-screen px-6 pt-6">
          <SheetHeader>
            <SheetTitle className="text-left">Tambah Shop</SheetTitle>
            <SheetDescription className="text-left">
              Tambah shop. Pastikan klik simpan ketika selesai.
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
                        <Input {...field} />
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
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <>
                          <FormLabel>Foto</FormLabel>
                          {field.value && field.value.size !== 0 && (
                            <PhotoProvider>
                              <div className="grid h-40 w-full gap-2">
                                <FileCard
                                  file={{
                                    ...field.value,
                                    preview: URL.createObjectURL(field.value),
                                  }}
                                  onDelete={() => {
                                    form.setValue('file', null);
                                  }}
                                />
                              </div>
                            </PhotoProvider>
                          )}
                          <div className="space-y-6">
                            <Dropzone
                              {...field}
                              accept="image/*"
                              dropMessage="Tarik dan lepas file di sini atau klik untuk memilih file"
                              handleOnDrop={handleOnDrop}
                            />
                          </div>
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