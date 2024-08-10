'use client';

import { Button } from '@repo/ui/components/ui/button';
import { loginUser } from './_actions/login-user';
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
import Link from 'next/link';
import { LoginUserSchema, loginUserSchema } from './form-schema';
import { PhoneInput } from '@repo/ui/components/phone-input';
import { Value as PhoneNumberValue } from 'react-phone-number-input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '@repo/ui/components/password-input';
import { api } from '@/trpc/react';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal login',
  },
  loading: {
    title: 'Mengautentikasi...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Login berhasil',
    description: 'Selamat datang',
  },
};

export default function LoginUserForm() {
  const router = useRouter();
  const auth = api.auth.getSession.useQuery(void {}, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (
      auth.data?.user?.role === 'admin' ||
      auth.data?.user?.role === 'owner'
    ) {
      router.push('/admin');
    }
  }, [auth]);

  const [formState, formAction] = useFormState(loginUser, {
    status: 'default',
    form: {
      password: '',
      phoneNumber: '',
    },
  });

  type FormSchema = LoginUserSchema;

  const form = useForm<FormSchema>({
    resolver: zodResolver(loginUserSchema),
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
      router.push('/admin');
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
                <PasswordInput {...field} />
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
