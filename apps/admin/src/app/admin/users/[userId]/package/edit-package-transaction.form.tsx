'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { editPackageTransaction } from './_actions/edit-package-transaction';
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
import {
  EditPackageTransactionSchema,
  editPackageTransactionSchema,
} from './form-schema';
import FileCard from '@/components/file-card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Dropzone } from '@repo/ui/components/dropzone';
import { PhotoProvider } from 'react-photo-view';

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';
import { SelectPackageTransaction__Package__UserPackage } from '@repo/shared/service';

type FileWithPreview = File & { preview: string };

interface EditPackageTransactionProps {
  data: SelectPackageTransaction__Package__UserPackage;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal upload bukti',
  },
  loading: {
    title: 'Upload bukti...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Bukti berhasil diupload',
  },
};

export default function EditPackageTransactionForm({
  data,
}: EditPackageTransactionProps) {
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);

  const [formState, formAction] = useFormState(editPackageTransaction, {
    status: 'default',
    form: {
      id: data.id,
      file: null,
      image_url: data.image_url ? data.image_url : undefined,
    },
  });

  type FormSchema = EditPackageTransactionSchema;

  const form = useForm<FormSchema>({
    resolver: zodResolver(editPackageTransactionSchema),
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
        <Button variant={'outline'}>Bukti Bayar</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-left">Upload Bukti Bayar</SheetTitle>
          <SheetDescription className="text-left">
            Upload bukti bayar untuk transaksi ini, pastikan bukti bayar yang
            diupload valid.
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
                name="id"
                render={({ field }) => (
                  <Input type="hidden" {...field} value={data.id} />
                )}
              />

              {data.image_url && !imageRemoved && (
                <Input
                  type="hidden"
                  {...form.register('image_url')}
                  value={data.image_url ?? undefined}
                />
              )}

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
                                  form.setValue('file', null);
                                }}
                              />
                            </div>
                          </PhotoProvider>
                        ) : (
                          data.image_url &&
                          !imageRemoved && (
                            <PhotoProvider>
                              <div className="grid h-40 w-full gap-2">
                                <FileCard
                                  file={
                                    {
                                      preview: data.image_url,
                                      name: data.image_url,
                                    } as FileWithPreview
                                  }
                                  onDelete={() => {
                                    setImageRemoved(true);
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
      </SheetContent>
    </Sheet>
  );
}
