'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
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
import { EditDetailLocationSchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Value as PhoneNumberValue } from 'react-phone-number-input';
import { SelectLocation } from '@repo/shared/repository';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';
import { editDetailLocationSchema } from './form-schema';
import { editDetailLocation } from './_actions/edit-detail-location';
import { PhoneInput } from '@repo/ui/components/phone-input';

interface EditDetailLocationFormProps {
  location: SelectLocation;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal mengubah detail lokasi',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Mengubah detail lokasi...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Detail lokasi berhasil diubah',
  },
};

export default function EditDetailLocationForm({
  location,
}: EditDetailLocationFormProps) {
  const router = useRouter();

  const [openSheet, setOpenSheet] = useState(false);

  const [formState, formAction] = useFormState(editDetailLocation, {
    status: 'default',
    form: {
      locationId: location.id,
      name: location.name,
      address: location.address,
      phoneNumber: location.phone_number,
      email: location.email,
      linkMaps: location.link_maps,
    },
  });

  type FormSchema = EditDetailLocationSchema;
  const form = useForm<FormSchema>({
    resolver: zodResolver(editDetailLocationSchema),
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

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button variant={'outline'}>Edit</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-left">Edit Detail Lokasi</SheetTitle>
          <SheetDescription className="text-left">
            Buat perubahan pada detail lokasi, pastikan klik simpan ketika
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
                render={({ field }) => <Input type="hidden" {...field} />}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Nama Lokasi</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Telepon</FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        value={field.value as PhoneNumberValue}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkMaps"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Google Maps URL</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
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
