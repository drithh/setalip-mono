'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { editCarousel } from './_actions/edit-carousel';
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
import { EditCarouselSchema, editCarouselSchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Switch } from '@repo/ui/components/ui/switch';
import { MoneyInput } from '@repo/ui/components/money-input';
import { AddonInput } from '@repo/ui/components/addon-input';
import {
  SelectAllUserName,
  SelectClassType,
  SelectCarousel,
  SelectDetailLocation,
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
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Dropzone } from '@repo/ui/components/dropzone';
import { PhotoProvider } from 'react-photo-view';
import FileCard from '../locations/[locationId]/_components/file-card';

type FileWithPreview = File & { preview: string };

interface EditCarouselProps {
  data: SelectCarousel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal memperbarui carousel',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Memperbarui carousel',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Carousel berhasil diperbarui',
  },
};

export default function EditCarouselForm({
  data,
  open,
  onOpenChange,
}: EditCarouselProps) {
  const trpcUtils = api.useUtils();
  const router = useRouter();
  type FormSchema = EditCarouselSchema;

  const [formState, formAction] = useFormState(editCarousel, {
    status: 'default',
    form: {
      id: data.id,
      title: data.title,
      file: null,
      image_url: data.image_url !== '' ? data.image_url : undefined,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(editCarouselSchema),
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

  data;

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
            <SheetTitle className="text-left">Edit Carousel</SheetTitle>
            <SheetDescription className="text-left">
              Edit Carousel. Pastikan klik simpan ketika selesai.
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
                {data.image_url !== '' && (
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem className="grid w-full gap-2">
                        <FormControl>
                          <Input
                            type="hidden"
                            {...field}
                            value={data.image_url}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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
                          {field.value && field.value.size !== 0 ? (
                            <PhotoProvider>
                              <div className="grid h-40 w-full gap-2">
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
                          ) : (
                            data.image_url && (
                              <PhotoProvider>
                                <div className="grid h-40 w-full gap-2">
                                  <FileCard
                                    file={
                                      {
                                        preview: data.image_url,
                                        name: data.title,
                                      } as FileWithPreview
                                    }
                                    onDelete={() => {
                                      toast.error(
                                        'Carousel tidak dapat dihapus, silahkan upload file untuk menggantinya',
                                      );
                                    }}
                                  />
                                </div>
                              </PhotoProvider>
                            )
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
