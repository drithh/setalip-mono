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
  editUserPackageSchema,
  EditUserPackageSchema,
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
import { editUserPackage } from './_actions/edit-user-package';
import { DatetimePicker } from '@repo/ui/components/datetime-picker';

type FileWithPreview = File & { preview: string };

interface EditUserPackageProps {
  data: SelectPackageTransaction__Package__UserPackage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal update package user',
  },
  loading: {
    title: 'Update package user...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Package user berhasil diupdate',
  },
};

export default function EditUserPackageForm({
  data,
  open,
  onOpenChange,
}: EditUserPackageProps) {
  const router = useRouter();

  const [formState, formAction] = useFormState(editUserPackage, {
    status: 'default',
    form: {
      id: data.user_package_id ?? 0,
      credit: data.user_package_credit - data.user_package_credit_used,
      expired_at: data.user_package_expired_at,
      credit_used: data.user_package_credit_used,
    },
  });

  type FormSchema = EditUserPackageSchema;

  const form = useForm<FormSchema>({
    resolver: zodResolver(editUserPackageSchema),
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
      onOpenChange(false);
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

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-left">Edit User Package</SheetTitle>
          <SheetDescription className="text-left">
            Edit user package untuk kredit dan waktu expired
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
                  <Input
                    type="hidden"
                    {...field}
                    value={data.user_package_id ?? 0}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="credit_used"
                render={({ field }) => (
                  <Input
                    type="hidden"
                    {...field}
                    value={data.user_package_credit_used}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="credit"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Sisa Kredit</FormLabel>
                    <FormControl>
                      <>
                        <Input type="number" {...field} />
                      </>
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
                    <FormLabel>Waktu Expired</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          type="hidden"
                          {...field}
                          value={field.value.toString()}
                        />
                        <DatetimePicker
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        />
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
