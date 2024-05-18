'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { signin } from './_actions/login-user';
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
import Link from 'next/link';
import { loginUserSchema } from './form-schema';
import { PhoneInput } from '@repo/ui/components/phone-input';
import { Value as PhoneNumberValue } from 'react-phone-number-input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LoginUserForm() {
  const router = useRouter();
  const [formState, formAction] = useFormState(signin, {
    status: 'default',
    form: {
      phoneNumber: '',
      password: '',
    },
  });

  const form = useForm<z.output<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: formState.form,
  });

  useEffect(() => {
    toast.dismiss();
    if (formState.status === 'field-errors') {
      if (formState.errors.phoneNumber) {
        form.setError('phoneNumber', formState.errors.phoneNumber);
      }
      if (formState.errors.password) {
        form.setError('password', formState.errors.password);
      }
    } else if (formState.status === 'error') {
      toast.error('Gagal login', {
        description: formState.errors,
        id: 'login-error',
      });
      form.setError('root', { message: formState.errors });
    } else {
      form.clearErrors();
    }

    if (formState.status === 'success') {
      toast.dismiss();
      toast.success('Login berhasil', {
        description: 'Selamat datang',
        id: 'login-success',
      });
      router.push('/');
    }
  }, [formState.form]);

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        ref={formRef}
        action={formAction}
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            toast.loading('Mengautentikasi...', {
              id: 'authenticating',
            });
            formAction(new FormData(formRef.current!));
          })(evt);
        }}
      >
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
          name="password"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Lupa password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  );
}
