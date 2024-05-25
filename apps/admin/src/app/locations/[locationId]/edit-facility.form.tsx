'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { editFacility } from './_actions/edit-facility';
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
import { EditFacilitySchema, editFacilitySchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Dropzone } from '@repo/ui/components/dropzone';
import { PhotoProvider } from 'react-photo-view';
import FileCard from './file-card';
import { SelectDetailLocation } from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { useDeleteFacilityImageMutation } from './function/delete-facility-image';

type FileWithPreview = File & { preview: string };

interface EditFacilityProps {
  facility: SelectDetailLocation['facilities'][0];
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal login',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Mengirim data...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Login berhasil',
    description: 'Selamat datang',
  },
};

export default function EditFacilityForm({ facility }: EditFacilityProps) {
  const router = useRouter();
  const [formState, formAction] = useFormState(editFacility, {
    status: 'default',
    form: {
      locationId: facility.location_id,
      name: facility.name,
      level: facility.level,
      capacity: facility.capacity,
      file: null,
    },
  });

  type FormSchema = EditFacilitySchema;

  const form = useForm<FormSchema>({
    resolver: zodResolver(editFacilitySchema),
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
      toast.dismiss();
      toast.success(TOAST_MESSAGES.success.title, {
        description: TOAST_MESSAGES.success.description,
      });
      router.push('/');
    }
  }, [formState.form]);

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

  const deleteFacilityImage = useDeleteFacilityImageMutation();
  return (
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
          render={({ field }) => <Input type="hidden" {...field} />}
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
        <FormField
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
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <>
                  <FormLabel>Foto</FormLabel>
                  {field.value ? (
                    <PhotoProvider>
                      <div className="grid grid-cols-2 gap-2">
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
                    <PhotoProvider>
                      <div className="grid grid-cols-2 gap-2">
                        <FileCard
                          file={
                            {
                              preview: facility.image_url,
                              name: facility.name,
                            } as FileWithPreview
                          }
                          onDelete={() => {
                            deleteFacilityImage.mutate(
                              {
                                facilityId: facility.id,
                              },
                              {
                                onSuccess: () => {
                                  router.refresh();
                                },
                              },
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
  );
}
