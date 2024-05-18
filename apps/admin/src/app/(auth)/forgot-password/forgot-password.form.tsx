'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { signin } from './_actions/forgot-password';
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
import { forgotPasswordSchema } from './form-schema';
import { PhoneInput } from '@repo/ui/components/phone-input';
import { Value as PhoneNumberValue } from 'react-phone-number-input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [formState, formAction] = useFormState(signin, {
    status: 'default',
    form: {
      phoneNumber: '',
    },
  });

  const form = useForm<z.output<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: formState.form,
  });

  useEffect(() => {
    toast.dismiss();
    if (formState.status === 'field-errors') {
      if (formState.errors.phoneNumber) {
        form.setError('phoneNumber', formState.errors.phoneNumber);
      }
    } else if (formState.status === 'error') {
      toast.error('Gagal mengirim link reset password', {
        description: formState.errors,
        id: 'login-error',
      });
      form.setError('root', { message: formState.errors });
    } else {
      form.clearErrors();
    }
    if (formState.status === 'success') {
      toast.success('Berhasil mengirim link reset password', {
        description: 'Silahkan cek whatsapp anda',
        id: 'login-success',
      });
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
            toast.loading('Mengirim link reset password...', {
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

        <Button type="submit" className="w-full">
          Kirim
        </Button>
      </form>
    </Form>
  );
}
