'use client';

import { Button } from '@repo/ui/components/ui/button';
import { resetPassword } from './_actions/reset-password';
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
import { resetPasswordSchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '@repo/ui/components/password-input';
import { Input } from '@repo/ui/components/ui/input';

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [formState, formAction] = useFormState(resetPassword, {
    status: 'default',
    form: {
      token: token,
      password: '',
      passwordConfirmation: '',
    },
  });

  const form = useForm<z.output<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: formState.form,
  });

  useEffect(() => {
    toast.dismiss();
    if (formState.status === 'field-errors') {
      if (formState.errors.password) {
        form.setError('password', formState.errors.password);
      }
      if (formState.errors.passwordConfirmation) {
        form.setError(
          'passwordConfirmation',
          formState.errors.passwordConfirmation
        );
      }
    } else if (formState.status === 'error') {
      toast.error('Gagal melakukan reset password', {
        description: formState.errors,
        id: 'login-error',
      });
      form.setError('root', { message: formState.errors });
    } else {
      form.clearErrors();
    }

    if (formState.status === 'success') {
      toast.success('Berhasil melakukan reset password', {
        description: 'Silahkan login kembali',
        id: 'login-success',
      });
      router.push('/login');
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
            toast.loading('Memproses reset password', {});
            formAction(new FormData(formRef.current!));
          })(evt);
        }}
      >
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem className="w-full grid gap-2">
              <FormControl>
                <Input type="hidden" readOnly placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full grid gap-2">
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
            <FormItem className="w-full grid gap-2">
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Kirim
        </Button>
      </form>
    </Form>
  );
}
