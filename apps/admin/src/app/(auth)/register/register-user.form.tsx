'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { PhoneInput } from '@repo/ui/components/phone-input';
import { PasswordInput } from '@repo/ui/components/password-input';
import { registerUser } from './_actions/register-user';
import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Value as PhoneNumberValue } from 'react-phone-number-input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import Link from 'next/link';
import { registerUserSchema } from './form-schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal registrasi',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Mendaftarkan User...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Registrasi berhasil',
    description: 'Kode verifikasi telah dikirim ke whatsapp',
  },
};

export default function RegisterUserForm() {
  const router = useRouter();
  const [formState, formAction] = useFormState(registerUser, {
    status: 'default',
    form: undefined,
  });

  type FormValues = z.output<typeof registerUserSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: formState.form,
  });

  useEffect(() => {
    toast.dismiss();
    if (formState.status === 'field-errors') {
      for (const fieldName in formState.errors) {
        if (Object.prototype.hasOwnProperty.call(formState.errors, fieldName)) {
          const typedFieldName = fieldName as keyof FormValues;
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
    }
  }, [formState.form]);

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
          name="name"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input type="text" placeholder="" {...field} />
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
              <FormLabel>Nomor Whatsapp</FormLabel>
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
                <Input type="email" placeholder="" {...field} />
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
                <Input type="text" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </Form>
  );
}
