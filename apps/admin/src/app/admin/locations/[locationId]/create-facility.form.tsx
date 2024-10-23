'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { createFacility } from './_actions/create-facility';
import { useActionState, useEffect, useRef, useState } from 'react';
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
import { CreateFacilitySchema, createFacilitySchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Dropzone } from '@repo/ui/components/dropzone';
import { PhotoProvider } from 'react-photo-view';
import FileCard from '@/components/file-card';
import { SelectDetailLocation } from '@repo/shared/repository';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';

type FileWithPreview = File & { preview: string };

interface CreateFacilityProps {
  locationId: SelectDetailLocation['id'];
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal membuat fasilitas',
  },
  loading: {
    title: 'Membuat fasilitas...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Fasilitas berhasil dibuat',
  },
};

export default function CreateFacilityForm({
  locationId,
}: CreateFacilityProps) {
  const [openSheet, setOpenSheet] = useState(false);

  const router = useRouter();
  type FormSchema = CreateFacilitySchema;

  const [formState, formAction] = useActionState(createFacility, {
    status: 'default',
    form: {
      locationId: locationId,
      name: '',
      capacity: 0,
      file: null,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(createFacilitySchema),
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
      setOpenSheet(false);
      router.refresh();
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

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button variant={'outline'}>Tambah</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-left">Buat Fasilitas</SheetTitle>
          <SheetDescription className="text-left">
            Buat fasilitas baru untuk lokasi ini. Pastikan klik simpan ketika
            selesai.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              className="grid gap-4"
              ref={formRef}
              action={formAction}
              onSubmit={onFormSubmit}
            >
              <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                  <Input type="hidden" {...field} value={locationId} />
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
                name="capacity"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Kapasitas</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
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
      </SheetContent>
    </Sheet>
  );
}
