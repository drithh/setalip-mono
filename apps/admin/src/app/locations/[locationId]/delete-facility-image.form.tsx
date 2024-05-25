'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { deleteFacilityImage } from './_actions/delete-facility-image';
import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
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
  DeleteFacilityImageSchema,
  deleteFacilityImageSchema,
} from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal menghapus gambar',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Menghapus gambar...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Gambar berhasil dihapus',
    description: 'Gambar lokasi berhasil dihapus',
  },
};

interface DeleteFacilityImageFormProps {
  facilityId: number;
}

export default function DeleteFacilityImageForm({
  facilityId,
}: DeleteFacilityImageFormProps) {
  const router = useRouter();
  const [formState, formAction] = useFormState(deleteFacilityImage, {
    status: 'default',
    form: undefined,
  });

  type FormSchema = DeleteFacilityImageSchema;

  const form = useForm<FormSchema>({
    resolver: zodResolver(deleteFacilityImageSchema),
    defaultValues: formState.form,
    values: {
      facilityId: facilityId ?? -1,
    },
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
        description: TOAST_MESSAGES.error.description,
      });
      form.setError('root', { message: formState.errors });
    } else {
      form.clearErrors();
    }
    if (formState.status === 'success') {
      toast.success(TOAST_MESSAGES.success.title, {
        description: TOAST_MESSAGES.success.description,
      });
      router.refresh();
    }
  }, [formState]);

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
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
    <Form {...form}>
      <form
        className="grid gap-4"
        ref={formRef}
        action={formAction}
        onSubmit={onSubmitForm}
      >
        <FormField
          control={form.control}
          name="facilityId"
          render={({ field }) => (
            <Input
              {...field}
              type="hidden"
              className="w-full"
              value={facilityId}
            />
          )}
        />
        <Button variant={'destructive'}>Ya, Hapus</Button>
      </form>
    </Form>
  );
}
