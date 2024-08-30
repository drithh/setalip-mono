'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { createCarousel } from './_actions/create-carousel';
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
import { CreateCarouselSchema, createCarouselSchema } from './form-schema';
import { toast } from 'sonner';

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';

import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { api } from '@/trpc/react';
import { Dropzone } from '@repo/ui/components/dropzone';
import { PhotoProvider } from 'react-photo-view';
import FileCard from '@/components/file-card';

type FileWithPreview = File & { preview: string };

interface CreateCarouselProps {}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal membuat carousel',
  },
  loading: {
    title: 'Membuat carousel',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Carousel berhasil dibuat',
  },
};

export default function CreateCarouselForm({}: CreateCarouselProps) {
  const [openSheet, setOpenSheet] = useState(false);

  const trpcUtils = api.useUtils();
  type FormSchema = CreateCarouselSchema;

  const [formState, formAction] = useFormState(createCarousel, {
    status: 'default',
    form: {
      title: '',
      file: null,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(createCarouselSchema),
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
            <SheetTitle className="text-left">Buat Carousel</SheetTitle>
            <SheetDescription className="text-left">
              Buat Carousel baru. Pastikan klik simpan ketika selesai.
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
                  name="title"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Judul</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                              <div className="grid grid-cols-2 gap-2">
                                <FileCard
                                  file={{
                                    ...field.value,
                                    preview: URL.createObjectURL(field.value),
                                  }}
                                  onDelete={() => {
                                    toast.error(
                                      'Carousel tidak dapat dihapus, silahkan upload file untuk menggantinya',
                                    );
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
